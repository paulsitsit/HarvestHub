import { useCallback, useEffect, useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import {
  getFarmerPayments,
  submitPaymentProof
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import FeeStatusCard from '../../components/farmer/FeeStatusCard.jsx';
import PaymentProofForm from '../../components/farmer/PaymentProofForm.jsx';
import useToast from '../../hooks/useToast.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const Payments = () => {
  const { success, error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] =
    useState(null);
  const [submitting, setSubmitting] =
    useState(false);

  const loadPayments = useCallback(async () => {
    try {
      const response =
        await getFarmerPayments({
          limit: 100
        });

      setData(response.data);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load payment information'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    Promise.resolve().then(loadPayments);
  }, [loadPayments]);

  const handleSubmitProof = async (payload) => {
    setSubmitting(true);

    try {
      await submitPaymentProof(payload);

      success(
        'Payment proof submitted for admin verification.'
      );

      setSelectedProduct(null);
      await loadPayments();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to submit payment proof'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Loader label="Loading payments..." />
    );
  }

  const products = data?.products || [];
  const payments = data?.payments || [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Listing fees
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Payments
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Each approved product needs a verified {formatCurrency(data?.listingFee ?? 20)}{' '}
          listing fee for {data?.listingDays ?? 30} days.
        </p>
      </div>

      <GlassCard
        dark
        className="p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <FiCreditCard
            size={28}
            className="text-[var(--gold-300)]"
          />

          <div>
            <h2 className="text-xl font-extrabold">
              GCash payment instructions
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/70">
              Send {formatCurrency(data?.listingFee ?? 20)} to your HarvestHub payment
              account, then upload the receipt screenshot and reference
              number below.
            </p>

            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/85">
              <p>
                <span className="font-bold">Account name:</span>{' '}
                {data?.gcashAccountName || 'HarvestHub Marketplace'}
              </p>

              <p className="mt-2">
                <span className="font-bold">GCash number:</span>{' '}
                {data?.gcashAccountNumber || 'GCash account number not configured'}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <section>
        <h2 className="text-2xl font-extrabold text-[var(--green-900)]">
          Product fee status
        </h2>

        {products.length ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {products.map((product) => (
              <FeeStatusCard
                key={product._id}
                product={product}
                onSubmitPayment={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="No products to renew"
              description="Create a product listing first."
            />
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-[var(--green-900)]">
          Payment history
        </h2>

        {!payments.length ? (
          <div className="mt-5">
            <EmptyState
              title="No payment submissions"
              description="Your submitted payment proofs will appear here."
            />
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {payments.map((payment) => (
              <GlassCard
                key={payment._id}
                className="p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-[var(--green-900)]">
                      {payment.product?.name || 'Product listing'}
                    </h3>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {payment.referenceNumber}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Submitted {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-[var(--gold-600)]">
                      {formatCurrency(payment.amount)}
                    </p>

                    <div className="mt-2">
                      <Badge status={payment.status} />
                    </div>
                  </div>
                </div>

                {payment.rejectionReason && (
                  <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800">
                    {payment.rejectionReason}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      <Modal
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        title={`Payment for ${selectedProduct?.name || 'product'}`}
        size="md"
      >
        {selectedProduct && (
          <PaymentProofForm
            product={selectedProduct}
            onSubmit={handleSubmitProof}
            loading={submitting}
          />
        )}
      </Modal>
    </div>
  );
};

export default Payments;