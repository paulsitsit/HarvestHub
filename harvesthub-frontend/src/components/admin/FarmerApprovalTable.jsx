import {
  FiCheck,
  FiEye,
  FiFlag,
  FiSlash,
  FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import GlassCard from '../common/GlassCard.jsx';
import { formatDate } from '../../utils/formatDate.js';

const FarmerApprovalTable = ({
  farmers = [],
  onApprove,
  onReject,
  onSuspend,
  onFlag,
  loadingId
}) => {
  if (!farmers.length) {
    return (
      <EmptyState
        title="No farmers found"
        description="There are no farmer accounts matching your filters."
      />
    );
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-245 w-full text-left">
          <caption className="sr-only">
            Farmer account management table
          </caption>

          <thead className="bg-(--green-100)">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-(--green-900)"
              >
                Farmer
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Farm
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Location
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Registered
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
            {farmers.map((farmer) => {
              const isLoading =
                loadingId === farmer._id;

              return (
                <tr
                  key={farmer._id}
                  className="transition hover:bg-white/70"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-[var(--green-900)]">
                      {farmer.user?.name || 'Unknown'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {farmer.user?.email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[var(--green-900)]">
                    {farmer.farmName}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {farmer.municipality || '—'}
                    {farmer.province
                      ? `, ${farmer.province}`
                      : ''}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge status={farmer.status} />

                      {farmer.isFlaggedFraud && (
                        <Badge status="flagged">
                          Fraud flag
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(farmer.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/farmers/${farmer._id}`}
                        aria-label={`View ${farmer.farmName}`}
                        className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-[var(--green-700)] text-[var(--green-700)] hover:bg-[var(--green-100)]"
                      >
                        <FiEye />
                      </Link>

                      {farmer.status !== 'approved' && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            onApprove(farmer)
                          }
                          loading={isLoading}
                          aria-label={`Approve ${farmer.farmName}`}
                        >
                          <FiCheck />
                        </Button>
                      )}

                      {farmer.status === 'pending' && (
                        <Button
                          variant="danger"
                          onClick={() =>
                            onReject(farmer)
                          }
                          disabled={isLoading}
                          aria-label={`Reject ${farmer.farmName}`}
                        >
                          <FiX />
                        </Button>
                      )}

                      {farmer.status === 'approved' && (
                        <Button
                          variant="danger"
                          onClick={() =>
                            onSuspend(farmer)
                          }
                          disabled={isLoading}
                          aria-label={`Suspend ${farmer.farmName}`}
                        >
                          <FiSlash />
                        </Button>
                      )}

                      <Button
                        variant={
                          farmer.isFlaggedFraud
                            ? 'outline'
                            : 'ghost'
                        }
                        onClick={() =>
                          onFlag(farmer)
                        }
                        disabled={isLoading}
                        aria-label={
                          farmer.isFlaggedFraud
                            ? `Remove fraud flag from ${farmer.farmName}`
                            : `Flag ${farmer.farmName} as fraud`
                        }
                      >
                        <FiFlag />
                      </Button>
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

export default FarmerApprovalTable;