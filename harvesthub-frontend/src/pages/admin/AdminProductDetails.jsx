import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAdminProductById } from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Loader from '../../components/common/Loader.jsx';
import Badge from '../../components/common/Badge.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const showDate = (value) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
};

const AdminProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setProduct(null);
    getAdminProductById(id)
      .then((response) => {
        if (active) {
          if (!response.data) setError('Product not found.');
          else setProduct(response.data);
        }
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError, 'Unable to load product.'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const back = <Link to="/admin/products" className="inline-block font-bold text-(--green-700) underline">Back to products</Link>;
  if (loading) return <Loader label="Loading product details..." />;
  if (error || !product) return <div className="glass-panel rounded-2xl p-6 space-y-4"><p role="alert">{error || 'Product not found.'}</p>{back}</div>;

  const farmer = product.farmer;
  const blockers = [];
  if (product.status !== 'approved') blockers.push(`Product status is ${product.status || 'not set'}, not approved.`);
  if (!product.feePaidUntil || !(new Date(product.feePaidUntil).getTime() > Date.now())) blockers.push('Listing-fee expiry is missing, invalid, or expired.');
  if (!farmer || typeof farmer !== 'object') blockers.push('Farmer profile is unavailable.');
  else {
    if (farmer.status !== 'approved') blockers.push(`Farmer status is ${farmer.status || 'not set'}, not approved.`);
    if (farmer.isFlaggedFraud) blockers.push('Farmer is flagged for fraud.');
  }

  const details = [
    ['Product ID', product._id],
    ['Price', `${formatCurrency(product.price)} / ${product.unit || ''}`],
    ['Quantity', product.quantity ?? 'Not set'],
    ['Category', product.category?.name || 'Uncategorized'],
    ['Availability', product.availability || 'Not set'],
    ['Listing fee paid until', showDate(product.feePaidUntil)],
    ['Farmer', farmer?.farmName || 'Unavailable'],
    ['Farmer status', farmer?.status || 'Not set'],
    ['Fraud flagged', farmer?.isFlaggedFraud ? 'Yes' : 'No'],
    ['Location', [farmer?.municipality, farmer?.province].filter(Boolean).join(', ') || 'Not set'],
    ['Created', showDate(product.createdAt)],
    ['Harvest date', showDate(product.harvestDate)]
  ];

  return (
    <div className="space-y-6">
      {back}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-(--green-900)">{product.name}</h1>
        <Badge status={product.status} />
        <p className="whitespace-pre-wrap">{product.description || 'No description provided.'}</p>
        <dl className="grid gap-5 sm:grid-cols-2">
          {details.map(([label, value]) => <div key={label}><dt className="text-sm text-(--muted)">{label}</dt><dd className="font-semibold break-words">{value}</dd></div>)}
        </dl>
        {product.rejectionReason && <p>Rejection reason: {product.rejectionReason}</p>}
      </div>
      <section className="glass-panel rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-bold text-(--green-900)">Public visibility checks</h2>
        {blockers.length ? <ul className="list-disc pl-5 space-y-2">{blockers.map((reason) => <li key={reason}>{reason}</li>)}</ul> : <p>This record meets the approval, fee-expiry, and farmer checks for public listing. Search filters can still exclude it.</p>}
        <p className="text-sm text-(--muted)">These checks use the loaded record and your device time. They do not change product approval or payment status.</p>
      </section>
    </div>
  );
};

export default AdminProductDetails;
