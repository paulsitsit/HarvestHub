import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiSave
} from 'react-icons/fi';
import {
  getCategories
} from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../common/Button.jsx';
import GlassCard from '../common/GlassCard.jsx';
import ImageUploader from '../common/ImageUploader.jsx';
import Input from '../common/Input.jsx';
import Loader from '../common/Loader.jsx';
import Select from '../common/Select.jsx';
import useToast from '../../hooks/useToast.js';
import {
  PRODUCT_UNITS
} from '../../utils/constants.js';

const ProductForm = ({
  initialValues = {},
  existingImages = [],
  onSubmit,
  submitLabel = 'Save product'
}) => {
  const { error } = useToast();

  const [categories, setCategories] =
    useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);
  const [images, setImages] = useState(existingImages);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm({
    defaultValues: {
      name: initialValues.name || '',
      category: initialValues.category?._id ||
        initialValues.category ||
        '',
      price: initialValues.price || '',
      unit: initialValues.unit || 'kg',
      quantity: initialValues.quantity || '',
      availability:
        initialValues.availability || 'available',
      harvestDate: initialValues.harvestDate
        ? initialValues.harvestDate.slice(0, 10)
        : '',
      description: initialValues.description || ''
    }
  });

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response =
          await getCategories();

        if (active) {
          setCategories(response.data || []);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load categories'
            )
          );
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [error]);

  const submit = async (formData) => {
    const payload = new FormData();

    Object.entries(formData).forEach(
      ([key, value]) => {
        payload.append(key, value ?? '');
      }
    );

    const retainedImages = images.filter(
      (image) => typeof image === 'string'
    );

    payload.append(
      'existingImages',
      JSON.stringify(retainedImages)
    );

    images
      .filter((image) => image instanceof File)
      .forEach((file) => {
        payload.append('images', file);
      });

    await onSubmit(payload);
  };

  if (loadingCategories) {
    return (
      <Loader label="Loading product categories..." />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-8"
    >
      <GlassCard className="p-5 sm:p-7">
        <h2 className="text-xl font-extrabold text-[var(--green-900)]">
          Product details
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input
            label="Product name"
            required
            placeholder="Fresh tomatoes"
            error={errors.name?.message}
            {...register('name', {
              required: 'Product name is required',
              minLength: {
                value: 2,
                message: 'Product name must be at least 2 characters'
              }
            })}
          />

          <Select
            label="Category"
            required
            error={errors.category?.message}
            {...register('category', {
              required: 'Category is required'
            })}
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.icon} {category.name}
              </option>
            ))}
          </Select>

          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="120"
            error={errors.price?.message}
            {...register('price', {
              required: 'Price is required',
              min: {
                value: 0,
                message: 'Price cannot be negative'
              }
            })}
          />

          <Select
            label="Unit"
            required
            error={errors.unit?.message}
            {...register('unit', {
              required: 'Unit is required'
            })}
          >
            {PRODUCT_UNITS.map((unit) => (
              <option
                key={unit}
                value={unit}
              >
                Per {unit}
              </option>
            ))}
          </Select>

          <Input
            label="Quantity"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="50"
            error={errors.quantity?.message}
            {...register('quantity', {
              required: 'Quantity is required',
              min: {
                value: 0,
                message: 'Quantity cannot be negative'
              }
            })}
          />

          <Select
            label="Availability"
            {...register('availability')}
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
            label="Harvest date"
            type="date"
            error={errors.harvestDate?.message}
            {...register('harvestDate')}
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="product-description"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Description
          </label>

          <textarea
            id="product-description"
            rows={7}
            placeholder="Describe your produce, quality, pickup details, and availability."
            className={[
              'glass-input mt-2 resize-y px-4 py-3',
              errors.description ? 'border-red-600' : ''
            ].join(' ')}
            {...register('description', {
              maxLength: {
                value: 3000,
                message: 'Description cannot exceed 3,000 characters'
              }
            })}
          />

          {errors.description && (
            <p
              role="alert"
              className="mt-1 text-xs font-semibold text-red-700"
            >
              {errors.description.message}
            </p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-7">
        <ImageUploader
          label="Product images"
          files={images}
          onChange={setImages}
          maxFiles={5}
          multiple
        />

        {!existingImages.length && !images.length && (
          <p className="mt-3 text-xs text-red-700">
            Add at least one image before submitting.
          </p>
        )}
      </GlassCard>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSubmitting}
        >
          <FiSave />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;