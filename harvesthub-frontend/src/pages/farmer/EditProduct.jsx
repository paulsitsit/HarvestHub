import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/product/ProductForm.jsx';
import {
  getFarmerProducts,
  updateProduct
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import useToast from '../../hooks/useToast.js';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        const response =
          await getFarmerProducts({
            limit: 100
          });

        const found = response.data.products.find(
          (item) => item._id === id
        );

        if (active) {
          setProduct(found || null);
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

  const handleSubmit = async (payload) => {
    try {
      await updateProduct(id, payload);

      success(
        'Product updated and resubmitted for approval.'
      );

      navigate('/farmer/products');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update product'
        )
      );

      throw requestError;
    }
  };

  if (loading) {
    return (
      <Loader label="Loading product..." />
    );
  }

  if (!product) {
    return (
      <GlassCard className="p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[var(--green-900)]">
          Product not found
        </h1>

        <Link
          to="/farmer/products"
          className="gold-button mt-6"
        >
          Back to products
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Edit listing
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Update {product.name}
        </h1>
      </div>

      <ProductForm
        initialValues={product}
        existingImages={product.images || []}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  );
};

export default EditProduct;