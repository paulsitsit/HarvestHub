import { useCallback, useEffect, useState } from 'react';
import {
  FiMessageSquare,
  FiPhone
} from 'react-icons/fi';
import {
  getFarmerInquiries,
  updateInquiryStatus
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import Select from '../../components/common/Select.jsx';
import useToast from '../../hooks/useToast.js';
import { formatDate } from '../../utils/formatDate.js';

const ReceivedOrders = () => {
  const { success, error } = useToast();

  const [inquiries, setInquiries] =
    useState([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = useCallback(async () => {
    try {
      const response =
        await getFarmerInquiries({
          limit: 100
        });

      setInquiries(
        response.data.inquiries || []
      );
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load inquiries'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    Promise.resolve().then(loadInquiries);
  }, [loadInquiries]);

  const handleStatusChange = async (
    inquiry,
    status
  ) => {
    try {
      await updateInquiryStatus(
        inquiry._id,
        status
      );

      setInquiries((current) =>
        current.map((item) =>
          item._id === inquiry._id
            ? {
                ...item,
                status
              }
            : item
        )
      );

      success('Inquiry status updated.');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update inquiry status'
        )
      );
    }
  };

  if (loading) {
    return (
      <Loader label="Loading buyer inquiries..." />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Buyer communication
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Received inquiries
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Follow up with buyers who called or sent messages.
        </p>
      </div>

      {!inquiries.length ? (
        <EmptyState
          title="No inquiries yet"
          description="Buyer calls and messages will appear here."
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <GlassCard
              key={inquiry._id}
              className="p-5"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {inquiry.type === 'call' ? (
                      <FiPhone className="text-[var(--green-700)]" />
                    ) : (
                      <FiMessageSquare className="text-[var(--green-700)]" />
                    )}

                    <h2 className="text-xl font-extrabold text-[var(--green-900)]">
                      {inquiry.product?.name || 'Product inquiry'}
                    </h2>

                    <Badge status={inquiry.status} />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
                    <p>
                      <span className="font-bold text-[var(--green-900)]">
                        Buyer:
                      </span>{' '}
                      {inquiry.buyerName}
                    </p>

                    <p>
                      <span className="font-bold text-[var(--green-900)]">
                        Phone:
                      </span>{' '}
                      {inquiry.buyerPhone || 'Not provided'}
                    </p>

                    <p>
                      <span className="font-bold text-[var(--green-900)]">
                        Quantity:
                      </span>{' '}
                      {inquiry.quantityWanted || 'Not specified'}
                    </p>

                    <p>
                      <span className="font-bold text-[var(--green-900)]">
                        Received:
                      </span>{' '}
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>

                  {inquiry.message && (
                    <p className="mt-4 rounded-xl bg-[var(--green-100)] p-4 text-sm leading-7 text-[var(--green-900)]">
                      {inquiry.message}
                    </p>
                  )}
                </div>

                <div className="w-full xl:w-52">
                  <Select
                    label="Update status"
                    value={inquiry.status}
                    onChange={(event) =>
                      handleStatusChange(
                        inquiry,
                        event.target.value
                      )
                    }
                  >
                    <option value="new">New</option>
                    <option value="contacted">
                      Contacted
                    </option>
                    <option value="completed">
                      Completed
                    </option>
                    <option value="cancelled">
                      Cancelled
                    </option>
                  </Select>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedOrders;