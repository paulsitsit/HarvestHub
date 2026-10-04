export const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2
  }).format(amount);
};

export default formatCurrency;