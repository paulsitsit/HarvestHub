import { useEffect, useState } from 'react';
import {
  approveProduct,
  getAdminProducts,
  rejectProduct,
  removeProduct
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import Loader from '../../components/common/Loader.jsx';
import ProductApprovalTable from '../../components/admin/ProductApprovalTable.jsx';
import useToast from '../../hooks/useToast.js';

const ManageProducts = () => {
  const { success, error } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState('');

  const loadProducts = async () => {
    setLoading(true);

    try {
      const response =
        await getAdminProducts({
          search: filters.search,
          status: filters.status || undefined,
          limit: 100
        });

      setProducts(response.data.products || []);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load products'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [
    filters.search,
    filters.status
  ]);

  const runAction = async (
    product,
    message,
    callback
  ) => {
    setLoadingId(product._id);

    try {
      await callback();
      success(message);
      setModal(null);
      setReason('');
      await loadProducts();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update product'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleApprove = (product) => {
    runAction(
      product,
      'Product approved.',
      () => approveProduct(product._id)
    );
  };

  const handleReject = (product) => {
    setReason('');
    setModal({
      type: 'reject',
      product
    });
  };

  const handleRemove = (product) => {
    setReason('');
    setModal({
      type: 'remove',
      product
    });
  };

  const confirmModal = async () => {
    if (!modal) {
      return;
    }

    if (
      modal.type === 'reject' &&
      !reason.trim()
    ) {
      error('Please provide a rejection reason.');
      return;
    }

    if (modal.type === 'reject') {
      await runAction(
        modal.product,
        'Product rejected.',
        () =>
          rejectProduct(
            modal.product._id,
            reason.trim()
          )
      );
    }

    if (modal.type === 'remove') {
      await runAction(
        modal.product,
        'Product removed.',
        () =>
          removeProduct(
            modal.product._id
          )
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Listing moderation
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Manage products
        </h1>
      </div>

      <div className="glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-[1fr_220px_auto] md:items-end">
        <Input
          label="Search"
          placeholder="Product or description..."
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
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
          <option value="removed">Removed</option>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              search: '',
              status: ''
            })
          }
        >
          Reset
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : (
        <ProductApprovalTable
          products={products}
          onApprove={handleApprove}
          onReject={handleReject}
          onRemove={handleRemove}
          loadingId={loadingId}
        />
      )}

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={
          modal?.type === 'reject'
            ? 'Reject product'
            : 'Remove product'
        }
        size="sm"
      >
        <p className="text-sm leading-7 text-[var(--muted)]">
          {modal?.product?.name}
        </p>

        {modal?.type === 'reject' && (
          <div className="mt-5">
            <label
              htmlFor="product-action-reason"
              className="block text-sm font-bold text-[var(--green-900)]"
            >
              Rejection reason
            </label>

            <textarea
              id="product-action-reason"
              rows={5}
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              className="glass-input mt-2 resize-y px-4 py-3"
              placeholder="Explain what needs to be corrected..."
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setModal(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmModal}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageProducts;