export const formatDate = (
  value,
  options = {}
) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }
  ).format(date);
};

export default formatDate;