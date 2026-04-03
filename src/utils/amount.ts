export const formatAmount = (amount: string): number => {
  if (amount) {
    const formattedAmount = amount
      .replace(/\./g, '')
      .replace(/,/g, '.')
      .replace('€', '')
      .replace('$', '')
      .replace(/ /g, '');

    return Number(formattedAmount);
  }

  return Number.NaN;
};

export const formatAmountToCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export const isValidAmount = (amount: number): boolean => !Number.isNaN(amount) && Number(amount) > 0;
