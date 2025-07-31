import axios from 'axios';

export const getAnnualSelicRatePercent = async (): Promise<number> => {
  const response = await axios.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
  return Number.parseFloat(response.data[0].valor);
};
