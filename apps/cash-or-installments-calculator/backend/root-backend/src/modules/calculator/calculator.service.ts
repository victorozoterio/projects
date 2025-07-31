import { Injectable, Logger } from '@nestjs/common';
import { CalculatorDto } from './dto/calculator.dto';

@Injectable()
export class CalculatorService {
  private readonly logger = new Logger(CalculatorService.name);

  async calculate(dto: CalculatorDto) {
    this.logger.log('Starting calculation');
    const INCOME_TAX_RATE = 22.5;

    const monthlySelicRateDecimal = (1 + dto.annualSelicRatePercent / 100) ** (1 / 12) - 1;
    this.logger.log(`Converted annual Selic rate to monthly: ${(monthlySelicRateDecimal * 100).toFixed(4)}%`);

    let balance = dto.cashValue - dto.installmentValue;
    let totalEarnings = 0;

    for (let i = 0; i < dto.numberOfInstallments; i++) {
      const earnings = balance * monthlySelicRateDecimal;
      balance += earnings;
      totalEarnings += earnings;
      balance -= dto.installmentValue;
    }

    const netEarnings = totalEarnings * (1 - INCOME_TAX_RATE / 100);
    const totalInstallmentValue = dto.installmentValue * dto.numberOfInstallments;
    const cashSavings = totalInstallmentValue - dto.cashValue;

    const result = netEarnings > cashSavings ? 'É melhor pagar parcelado!' : 'É melhor pagar à vista!';
    const note = `Foi considerada uma taxa Selic de ${dto.annualSelicRatePercent.toFixed(2)}%, uma alíquota de imposto de renda de ${INCOME_TAX_RATE}% e simulado uma aplicação de R$${(totalInstallmentValue - dto.installmentValue).toFixed(2)} em um CDB de liquidez diária (100% do CDI), onde R$${dto.installmentValue} são sacados todos os meses para pagar as parcelas.`;

    return {
      result,
      cashOption: `Pagando em dinheiro você economizará R$${cashSavings.toFixed(2)}`,
      installmentOption: `Pagando parcelado você economizará R$${netEarnings.toFixed(2)}`,
      note,
    };
  }
}
