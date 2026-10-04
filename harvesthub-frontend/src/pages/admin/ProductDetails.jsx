import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import {
  getAdminProductById
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { API_ORIGIN } from '../../utils/constants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import useToast from '../../hooks/useToast.js';

const ProductDetails = () => {
  const { id } = useParams();
  const { error } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        const response =
          await getAdminProductById(id);

        if (active) {
          setProduct(response.data);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load product'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, error]);

  if (loading) {
    return (
      <Loader label="Loading product details..." />
    );
  }

  if (!product) {
    return (
      <GlassCard className="p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[var(--green-900)]">
          Product not found
        </h1>

        <Link
          to="/admin/products"
          className="gold-button mt-6"
        >
          Back to products
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--green-700)] hover:underline"
      >
        <FiArrowLeft />
        Back to products
      </Link>

      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-[var(--green-900)]">
                {product.name}
              </h1>

              <Badge status={product.status} />
            </div>

            <p className="mt-3 text-2xl font-extrabold text-[var(--gold-600)]">
              {formatCurrency(product.price)}
              <span className="ml-2 text-sm font-semibold text-[var(--muted)]">
                / {product.unit}
              </span>
            </p>
          </div>

          <div className="text-right text-sm text-[var(--muted)]">
            <p>Created {formatDate(product.createdAt)}</p>

            <p className="mt-1">
              Quantity: {product.quantity}
            </p>
          </div>
        </div>

        {product.description && (
          <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">
            {product.description}
          </p>
        )}

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {product.images?.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={`${API_ORIGIN}${image}`}
              alt={`${product.name} image ${index + 1}`}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-xl font-extrabold text-[var(--green-900)]">
          Farmer information
        </h2>

        <div className="mt-4 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
          <p>
            <strong className="text-[var(--green-900)]">
              Farm:
            </strong>{' '}
            {product.farmer?.farmName || '—'}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Location:
            </strong>{' '}
            {product.farmer?.municipality || '—'}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Farmer status:
            </strong>{' '}
            {product.farmer?.status || '—'}
          </p>

          <p>
            <strong className="text-[var(--green-900)]">
              Fee active until:
            </strong>{' '}
            {formatDate(product.feePaidUntil)}
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProductDetails;