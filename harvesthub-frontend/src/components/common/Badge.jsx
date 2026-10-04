const statusClassMap = {
  approved: 'status-pill-success',
  available: 'status-pill-success',
  verified: 'status-pill-success',
  completed: 'status-pill-success',

  pending: 'status-pill-warning',
  low_stock: 'status-pill-warning',
  contacted: 'status-pill-warning',

  rejected: 'status-pill-danger',
  suspended: 'status-pill-danger',
  cancelled: 'status-pill-danger',
  flagged: 'status-pill-danger',
  expired: 'status-pill-danger',
  removed: 'status-pill-danger',
  sold_out: 'status-pill-danger',

  visible: 'status-pill-success',
  hidden: 'status-pill-neutral',
  new: 'status-pill-warning'
};

const formatStatus = (status) => {
  if (!status) {
    return 'Unknown';
  }

  return status.replaceAll('_', ' ');
};

const Badge = ({
  status,
  children,
  className = ''
}) => {
  const statusClass =
    statusClassMap[status] ||
    'status-pill-neutral';

  return (
    <span
      className={[
        'status-pill',
        statusClass,
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children || formatStatus(status)}
    </span>
  );
};

export default Badge;