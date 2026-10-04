export const ROLES = Object.freeze({
  FARMER: 'farmer',
  ADMIN: 'admin'
});

export const FARMER_STATUSES = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
});

export const PRODUCT_STATUSES = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  REMOVED: 'removed'
});

export const PRODUCT_AVAILABILITY = Object.freeze({
  AVAILABLE: 'available',
  LOW_STOCK: 'low_stock',
  SOLD_OUT: 'sold_out'
});

export const PAYMENT_STATUSES = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
});

export const REVIEW_STATUSES = Object.freeze({
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  FLAGGED: 'flagged'
});

export const INQUIRY_STATUSES = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
});

export const UNITS = Object.freeze([
  'kg',
  'piece',
  'sack',
  'bundle'
]);

export const LISTING_FEE = Number(process.env.LISTING_FEE || 20);
export const LISTING_DAYS = Number(process.env.LISTING_DAYS || 30);