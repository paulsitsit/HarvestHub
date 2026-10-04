import {
  FiCheck,
  FiEye,
  FiTrash2,
  FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import GlassCard from '../common/GlassCard.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const ProductApprovalTable = ({
  products = [],
  onApprove,
  onReject,
  onRemove,
  loadingId
}) => {
  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="There are no product listings matching your filters."
      />
    );
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-left">
          <caption className="sr-only">
            Product listing management table
          </caption>

          <thead className="bg-[var(--green-100)]">
            <tr>
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
                Farmer
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Price
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
                Created
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
            {products.map((product) => {
              const isLoading =
                loadingId === product._id;

              return (
                <tr
                  key={product._id}
                  className="transition hover:bg-white/70"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-[var(--green-900)]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {product.category?.name || 'Uncategorized'}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-[var(--green-900)]">
                      {product.farmer?.farmName || 'Unknown'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {product.farmer?.municipality || '—'}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-extrabold text-[var(--gold-600)]">
                    {formatCurrency(product.price)}
                    <span className="ml-1 text-xs font-normal text-[var(--muted)]">
                      / {product.unit}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Badge status={product.status} />
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(product.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${product._id}`}
                        aria-label={`View ${product.name}`}
                        className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-[var(--green-700)] text-[var(--green-700)] hover:bg-[var(--green-100)]"
                      >
                        <FiEye />
                      </Link>

                      {product.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() =>
                              onApprove(product)
                            }
                            loading={isLoading}
                            aria-label={`Approve ${product.name}`}
                          >
                            <FiCheck />
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              onReject(product)
                            }
                            disabled={isLoading}
                            aria-label={`Reject ${product.name}`}
                          >
                            <FiX />
                          </Button>
                        </>
                      )}

                      {product.status !== 'removed' && (
                        <Button
                          variant="danger"
                          onClick={() =>
                            onRemove(product)
                          }
                          disabled={isLoading}
                          aria-label={`Remove ${product.name}`}
                        >
                          <FiTrash2 />
                        </Button>
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

export default ProductApprovalTable;