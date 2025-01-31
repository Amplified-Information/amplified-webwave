export const formatPercentage = (value: string) => {
  const num = parseFloat(value);
  return num.toFixed(2) + '%';
};

export const formatMoney = (value: string) => {
  const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};