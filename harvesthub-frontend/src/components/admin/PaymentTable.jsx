import {
  FiCheck,
  FiEye,
  FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import GlassCard from '../common/GlassCard.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { API_ORIGIN } from '../../utils/constants.js';

const PaymentTable = ({
  payments = [],
  onVerify,
  onReject,
  loadingId
}) => {
  if (!payments.length) {
    return (
      <EmptyState
        title="No payments found"
        description="There are no payment submissions matching your filters."
      />
    );
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-[1050px] w-full text-left">
          <caption className="sr-only">
            Payment verification table
          </caption>

          <thead className="bg-[var(--green-100)]">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Farmer
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Product
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Reference
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Proof
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--green-100)]">
            {payments.map((payment) => {
              const isLoading =
                loadingId === payment._id;

              const proofUrl = payment.proofImage
                ? `${API_ORIGIN}${payment.proofImage}`
                : null;

              return (
                <tr
                  key={payment._id}
                  className="transition hover:bg-white/70"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-[var(--green-900)]">
                      {payment.farmer?.farmName || 'Unknown'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {payment.farmer?.user?.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-[var(--green-900)]">
                      {payment.product?.name || 'Unknown'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--gold-600)]">
                      {formatCurrency(payment.amount)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[var(--green-900)]">
                      {payment.referenceNumber}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {formatDate(payment.createdAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {proofUrl ? (
                      <a
                        href={proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-[var(--green-700)] underline"
                      >
                        Open receipt
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--muted)]">
                        Missing
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <Badge status={payment.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/payments/${payment._id}`}
                        aria-label={`View payment ${payment.referenceNumber}`}
                        className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-[var(--green-700)] text-[var(--green-700)] hover:bg-[var(--green-100)]"
                      >
                        <FiEye />
                      </Link>

                      {payment.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() =>
                              onVerify(payment)
                            }
                            loading={isLoading}
                            aria-label={`Verify payment ${payment.referenceNumber}`}
                          >
                            <FiCheck />
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              onReject(payment)
                            }
                            disabled={isLoading}
                            aria-label={`Reject payment ${payment.referenceNumber}`}
                          >
                            <FiX />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default PaymentTable;