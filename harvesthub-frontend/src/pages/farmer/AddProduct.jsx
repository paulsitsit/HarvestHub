import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/product/ProductForm.jsx';
import {
  createProduct
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import useToast from '../../hooks/useToast.js';

const AddProduct = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSubmit = async (payload) => {
    try {
      await createProduct(payload);

      success(
        'Product submitted for admin approval.'
      );

      navigate('/farmer/products');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to create product'
        )
      );

      throw requestError;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          New listing
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Add a product
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          New listings are reviewed by an administrator before they
          become public.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Submit product"
      />
    </div>
  );
};

export default AddProduct;