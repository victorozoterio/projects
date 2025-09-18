import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentEntity } from './entities/investment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { brapiAxios } from '../../config';
import { Brapi } from '../../types';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(InvestmentEntity)
    private readonly repository: Repository<InvestmentEntity>,
  ) {}

  async create(dto: CreateInvestmentDto, user: UserEntity) {
    try {
      const { data } = await brapiAxios.get<Brapi>(`/quote/${dto.code}`);

      const invesmentAlreadyExists = await this.repository.findOne({
        where: { code: dto.code, user },
        relations: ['user'],
      });
      if (invesmentAlreadyExists) throw new NotFoundException('Investment already exists.');

      const investment = this.repository.create({ ...dto, name: data.results[0].longName, user });
      return await this.repository.save(investment);
    } catch (error) {
      if (error?.response?.status === 404) throw new NotFoundException('Investment does not exist.');
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllByUser(user: UserEntity) {
    return await this.repository.find({ where: { user: { uuid: user.uuid } } });
  }

  async runInvestmentAlerts() {
    const investments = await this.repository.find({ relations: ['user'] });
    const codesWithoutDuplicates = [...new Set(investments.map((investment) => investment.code))];

    for (const code of codesWithoutDuplicates) {
      try {
        const { data } = await brapiAxios.get<Brapi>(`/quote/${code}`);
        const regularMarketPrice = data.results[0].regularMarketPrice;

        console.log(`${code}: Preço atual R$ ${regularMarketPrice}`);

        const investmentsWithCode = investments.filter((investment) => investment.code === code);

        for (const investment of investmentsWithCode) {
          const { desiredPurchaseValue, desiredSalesPrice, user } = investment;

          if (desiredPurchaseValue > regularMarketPrice) {
            const percent = Math.abs(((regularMarketPrice - desiredPurchaseValue) / desiredPurchaseValue) * 100);

            console.log(
              `${user.email} o investimento ${code} está custando R$ ${regularMarketPrice}, ou seja, ${percent.toFixed(2)}% abaixo do valor de compra que você definiu como R$ ${desiredPurchaseValue}`,
            );
          }

          if (desiredSalesPrice < regularMarketPrice) {
            const percent = Math.abs(((regularMarketPrice - desiredSalesPrice) / desiredSalesPrice) * 100);

            console.log(
              `${user.email} o investimento ${code} está custando R$ ${regularMarketPrice}, ou seja, ${percent.toFixed(2)}% acima do valor de venda que você definiu como R$ ${desiredSalesPrice}`,
            );
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

  async remove(uuid: string) {
    const investment = await this.repository.findOneBy({ uuid });
    if (!investment) throw new NotFoundException('Investment does not exist.');
    await this.repository.delete({ uuid });
  }
}
