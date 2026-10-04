import { useEffect, useState } from 'react';
import {
  getAdminPayments,
  rejectAdminPayment,
  verifyAdminPayment
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import Loader from '../../components/common/Loader.jsx';
import PaymentTable from '../../components/admin/PaymentTable.jsx';
import useToast from '../../hooks/useToast.js';

const ManagePayments = () => {
  const { success, error } = useToast();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'pending'
  });

  const [rejectTarget, setRejectTarget] =
    useState(null);
  const [reason, setReason] = useState('');

  const loadPayments = async () => {
    setLoading(true);

    try {
      const response =
        await getAdminPayments({
          search: filters.search,
          status: filters.status || undefined,
          limit: 100
        });

      setPayments(response.data.payments || []);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load payments'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [
    filters.search,
    filters.status
  ]);

  const handleVerify = async (payment) => {
    setLoadingId(payment._id);

    try {
      await verifyAdminPayment(payment._id);

      success(
        'Payment verified and product activated.'
      );

      await loadPayments();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to verify payment'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = (payment) => {
    setReason('');
    setRejectTarget(payment);
  };

  const confirmReject = async () => {
    if (!rejectTarget) {
      return;
    }

    if (!reason.trim()) {
      error('Rejection reason is required.');
      return;
    }

    setLoadingId(rejectTarget._id);

    try {
      await rejectAdminPayment(
        rejectTarget._id,
        reason.trim()
      );

      success('Payment rejected.');
      setRejectTarget(null);
      setReason('');
      await loadPayments();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to reject payment'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Fee verification
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Manage payments
        </h1>
      </div>

      <div className="glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-[1fr_220px_auto] md:items-end">
        <Input
          label="Search"
          placeholder="Reference, farmer, product..."
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value
            }))
          }
        />

        <Select
          label="Status"
          value={filters.status}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: event.target.value
            }))
          }
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              search: '',
              status: 'pending'
            })
          }
        >
          Reset
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading payments..." />
      ) : (
        <PaymentTable
          payments={payments}
          onVerify={handleVerify}
          onReject={handleReject}
          loadingId={loadingId}
        />
      )}

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Reject payment"
        size="sm"
      >
        <p className="text-sm leading-7 text-[var(--muted)]">
          {rejectTarget?.referenceNumber}
        </p>

        <div className="mt-5">
          <label
            htmlFor="payment-rejection-reason"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Rejection reason
          </label>

          <textarea
            id="payment-rejection-reason"
            rows={5}
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            className="glass-input mt-2 resize-y px-4 py-3"
            placeholder="Explain why the payment could not be verified..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setRejectTarget(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmReject}
            loading={
              loadingId === rejectTarget?._id
            }
          >
            Reject payment
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePayments;