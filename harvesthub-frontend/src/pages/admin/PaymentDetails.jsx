import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import {
  getAdminPaymentById
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getImageUrl } from '../../utils/getImageUrl.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import useToast from '../../hooks/useToast.js';

const PaymentDetails = () => {
  const { id } = useParams();
  const { error } = useToast();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPayment = async () => {
      try {
        const response =
          await getAdminPaymentById(id);

        if (active) {
          setPayment(response.data);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load payment'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPayment();

    return () => {
      active = false;
    };
  }, [id, error]);

  if (loading) {
    return (
      <Loader label="Loading payment details..." />
    );
  }

  if (!payment) {
    return (
      <GlassCard className="p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[var(--green-900)]">
          Payment not found
        </h1>

        <Link
          to="/admin/payments"
          className="gold-button mt-6"
        >
          Back to payments
        </Link>
      </GlassCard>
    );
  }

  const proofUrl = payment.proofImage
    ? getImageUrl(payment.proofImage)
    : '';

  return (
    <div className="space-y-8">
      <Link
        to="/admin/payments"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--green-700)] hover:underline"
      >
        <FiArrowLeft />
        Back to payments
      </Link>

      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Payment submission
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
              {payment.referenceNumber}
            </h1>
          </div>

          <Badge status={payment.status} />
        </div>

        <div className="mt-7 grid gap-4 text-sm sm:grid-cols-2">
          <p>
            <strong className="text-[var(--green-900)]">
              Farmer:
            </strong>{' '}
            {payment.farmer?.farmName || '—'}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Product:
            </strong>{' '}
            {payment.product?.name || '—'}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Amount:
            </strong>{' '}
            {formatCurrency(payment.amount)}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Method:
            </strong>{' '}
            {payment.method}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Period start:
            </strong>{' '}
            {formatDate(payment.periodStart)}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Period end:
            </strong>{' '}
            {formatDate(payment.periodEnd)}
          </p>
        </div>

        {proofUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-[var(--green-900)]">
              Uploaded payment proof
            </h2>

            <a
              href={proofUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block max-w-xl overflow-hidden rounded-2xl border border-white/60"
            >
              <img
                src={proofUrl}
                alt={`Payment receipt ${payment.referenceNumber}`}
                className="max-h-[600px] w-full object-contain"
              />
            </a>
          </div>
        )}

        {payment.rejectionReason && (
          <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm leading-7 text-red-800">
            {payment.rejectionReason}
          </p>
        )}
      </GlassCard>
    </div>
  );
};

export default PaymentDetails;