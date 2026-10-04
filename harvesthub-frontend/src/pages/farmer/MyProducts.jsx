import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  FiEdit2,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

import {
  Link
} from 'react-router-dom';

import {
  deleteProduct,
  getFarmerProducts,
  updateProductAvailability
} from '../../api/farmerApi.js';

import {
  getApiErrorMessage
} from '../../api/axiosInstance.js';

import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Select from '../../components/common/Select.jsx';

import useToast from '../../hooks/useToast.js';

import {
  formatCurrency
} from '../../utils/formatCurrency.js';

import {
  formatDate
} from '../../utils/formatDate.js';

import {
  API_ORIGIN
} from '../../utils/constants.js';

const MyProducts = () => {
  const {
    success,
    error
  } = useToast();

  const [
    products,
    setProducts
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    deleteTarget,
    setDeleteTarget
  ] = useState(null);

  const [
    deleting,
    setDeleting
  ] = useState(false);

  const loadProducts = useCallback(
    async () => {
      try {
        setLoading(true);

        const response =
          await getFarmerProducts({
            page: 1,
            limit: 50
          });

        const productList =
          response?.data?.products ||
          response?.products ||
          [];

        setProducts(
          Array.isArray(productList)
            ? productList
            : []
        );
      } catch (requestError) {
        console.error(
          'LOAD PRODUCTS ERROR:',
          requestError
        );

        error(
          getApiErrorMessage(
            requestError,
            'Unable to load products'
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAvailabilityChange = async (
    product,
    availability
  ) => {
    try {
      await updateProductAvailability(
        product._id,
        {
          availability,
          quantity: product.quantity
        }
      );

      setProducts((current) =>
        current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                availability
              }
            : item
        )
      );

      success('Availability updated.');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update availability'
        )
      );
    }
  };

  const handleQuantityChange = async (
    product,
    quantity
  ) => {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      return;
    }

    try {
      await updateProductAvailability(
        product._id,
        {
          availability: product.availability,
          quantity: parsedQuantity
        }
      );

      setProducts((current) =>
        current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: parsedQuantity
              }
            : item
        )
      );

      success('Quantity updated.');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update quantity'
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await deleteProduct(
        deleteTarget._id
      );

      setProducts((current) =>
        current.filter(
          (item) =>
            item._id !== deleteTarget._id
        )
      );

      success('Product removed.');
      setDeleteTarget(null);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to remove product'
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Loader
        label="Loading your products..."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Inventory
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
            My products
          </h1>
        </div>

        <Link
          to="/farmer/products/add"
          className="gold-button"
        >
          <FiPlus />
          Add product
        </Link>
      </div>

      {!products.length ? (
        <EmptyState
          title="You have no products"
          description="Create your first product listing to start reaching buyers."
          action={
            <Link
              to="/farmer/products/add"
              className="gold-button"
            >
              Add your first product
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <GlassCard
              key={product._id}
              className="p-5"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[var(--green-100)]">
                    {product.images?.[0] && (
                      <img
                        src={`${API_ORIGIN}${product.images[0]}`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[var(--green-900)]">
                        {product.name}
                      </h2>

                      <Badge
                        status={product.status}
                      />
                    </div>

                    <p className="mt-2 text-lg font-extrabold text-[var(--gold-600)]">
                      {formatCurrency(
                        product.price
                      )}

                      <span className="ml-1 text-xs text-[var(--muted)]">
                        / {product.unit}
                      </span>
                    </p>

                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Created{' '}
                      {formatDate(
                        product.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[520px]">
                  <Select
                    label="Availability"
                    value={
                      product.availability ||
                      'available'
                    }
                    onChange={(event) =>
                      handleAvailabilityChange(
                        product,
                        event.target.value
                      )
                    }
                  >
                    <option value="available">
                      Available
                    </option>

                    <option value="low_stock">
                      Low stock
                    </option>

                    <option value="sold_out">
                      Sold out
                    </option>
                  </Select>

                  <Input
                    label="Quantity"
                    type="number"
                    min="0"
                    value={
                      product.quantity ?? ''
                    }
                    onChange={(event) =>
                      handleQuantityChange(
                        product,
                        event.target.value
                      )
                    }
                  />

                  <div className="flex items-end gap-2">
                    <Link
                      to={`/farmer/products/${product._id}/edit`}
                      aria-label={`Edit ${product.name}`}
                      className="green-button flex-1"
                    >
                      <FiEdit2 />
                      Edit
                    </Link>

                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setDeleteTarget(product)
                      }
                      aria-label={`Remove ${product.name}`}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
        title="Remove product?"
        message={`Remove ${
          deleteTarget?.name || 'this product'
        } from your listings?`}
        confirmText="Remove product"
        danger
        loading={deleting}
      />
    </div>
  );
};

export default MyProducts;