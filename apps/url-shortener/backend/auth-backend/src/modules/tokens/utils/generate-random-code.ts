export function generateRandomCode(length: number): number {
  const characters = '0123456789';
  const charactersLength = characters.length;
  let result = '';

  result += characters.charAt(Math.floor(Math.random() * (charactersLength - 1) + 1));

  for (let i = 1; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return Number(result);
}
