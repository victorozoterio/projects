import { sendEmail } from '@projects/shared/backend';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentEntity } from './entities/investment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { brapiAxios } from '../../config';
import { Brapi } from '../../types';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { addWeeks, isAfter, startOfDay } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(InvestmentEntity)
    private readonly repository: Repository<InvestmentEntity>,
  ) {}

  async create(dto: CreateInvestmentDto, user: UserEntity) {
    let brapiData: Brapi;

    try {
      const { data } = await brapiAxios.get<Brapi>(`/quote/${dto.code}`);
      brapiData = data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    const investmentAlreadyExists = await this.repository.findOne({
      where: { code: dto.code, user: { uuid: user.uuid } },
    });
    if (investmentAlreadyExists) throw new NotFoundException('Investment already exists.');

    const investment = this.repository.create({ ...dto, name: brapiData.results[0].longName, user });
    return await this.repository.save(investment);
  }

  async findAllByUser(user: UserEntity) {
    return await this.repository.find({ where: { user: { uuid: user.uuid } } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async runInvestmentAlerts() {
    const investments = await this.repository.find({ relations: ['user'] });
    const codesWithoutDuplicates = [...new Set(investments.map((investment) => investment.code))];

    for (const code of codesWithoutDuplicates) {
      try {
        const { data } = await brapiAxios.get<Brapi>(`/quote/${code}`);
        const regularMarketPrice = data.results[0].regularMarketPrice;

        const investmentsWithCode = investments.filter((investment) => investment.code === code);

        for (const investment of investmentsWithCode) {
          const { desiredPurchaseValue, desiredSalesPrice, isActive, lastEmailSentAt, user } = investment;
          const today = new Date();
          const canNotify = isAfter(today, addWeeks(lastEmailSentAt, 1));

          if (canNotify && isActive && desiredPurchaseValue > regularMarketPrice) {
            const percent = Math.abs(((regularMarketPrice - desiredPurchaseValue) / desiredPurchaseValue) * 100);

            await sendEmail({
              from: 'no-reply@victorozoterio.site',
              to: user.email,
              subject: `Hora de comprar ${code}`,
              body: `O investimento ${code} está custando R$ ${regularMarketPrice}, ou seja, ${percent.toFixed(2)}% abaixo do valor de compra que você definiu como R$ ${desiredPurchaseValue}`,
            });

            this.repository.merge(investment, { lastEmailSentAt: startOfDay(today) });
            await this.repository.save(investment);
          }

          if (canNotify && isActive && desiredSalesPrice < regularMarketPrice) {
            const percent = Math.abs(((regularMarketPrice - desiredSalesPrice) / desiredSalesPrice) * 100);

            await sendEmail({
              from: 'no-reply@victorozoterio.site',
              to: user.email,
              subject: `Hora de vender ${code}`,
              body: `O investimento ${code} está custando R$ ${regularMarketPrice}, ou seja, ${percent.toFixed(2)}% acima do valor de venda que você definiu como R$ ${desiredSalesPrice}`,
            });

            this.repository.merge(investment, { lastEmailSentAt: startOfDay(today) });
            await this.repository.save(investment);
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar preço para ${code}:`, error.message);
      }
    }
  }

  async update(uuid: string, dto: UpdateInvestmentDto, user: UserEntity) {
    const investment = await this.repository.findOne({ where: { uuid }, relations: ['user'] });
    if (!investment) throw new NotFoundException('Investment does not exist.');
    if (investment.user.uuid !== user.uuid) throw new UnauthorizedException('Investment does not belong to user.');

    this.repository.merge(investment, dto);
    return await this.repository.save(investment);
  }

  async changeStatus(uuid: string, user: UserEntity) {
    const investment = await this.repository.findOne({ where: { uuid }, relations: ['user'] });
    if (!investment) throw new NotFoundException('Investment does not exist.');
    if (investment.user.uuid !== user.uuid) throw new UnauthorizedException('Investment does not belong to user.');

    this.repository.merge(investment, { isActive: !investment.isActive });
    return await this.repository.save(investment);
  }

  async remove(uuid: string) {
    const investment = await this.repository.findOneBy({ uuid });
    if (!investment) throw new NotFoundException('Investment does not exist.');
    await this.repository.delete({ uuid });
  }
}
