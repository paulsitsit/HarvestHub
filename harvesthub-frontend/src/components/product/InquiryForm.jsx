import { useForm } from 'react-hook-form';
import { createInquiry } from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import useToast from '../../hooks/useToast.js';

const InquiryForm = ({
  productId,
  onSubmitted
}) => {
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm({
    defaultValues: {
      buyerName: '',
      buyerPhone: '',
      quantityWanted: '',
      message: '',
      website: ''
    }
  });

  const onSubmit = async (formData) => {
    try {
      await createInquiry({
        product: productId,
        buyerName: formData.buyerName,
        buyerPhone: formData.buyerPhone,
        quantityWanted: formData.quantityWanted
          ? Number(formData.quantityWanted)
          : undefined,
        message: formData.message,
        type: 'message',
        website: formData.website
      });

      success('Your inquiry was sent to the farmer.');
      reset();
      onSubmitted?.();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to send inquiry'
        )
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-panel rounded-2xl p-5 sm:p-6"
    >
      <h2 className="text-xl font-extrabold text-[var(--green-900)]">
        Send an inquiry
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Ask the farmer about availability, pickup, or delivery.
      </p>

      <div className="mt-5 space-y-5">
        <Input
          label="Your name"
          placeholder="Juan Santos"
          error={errors.buyerName?.message}
          {...register('buyerName', {
            required: 'Your name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="09171234567"
          error={errors.buyerPhone?.message}
          {...register('buyerPhone', {
            required: 'Phone number is required',
            maxLength: {
              value: 30,
              message: 'Phone number is too long'
            }
          })}
        />

        <Input
          label="Quantity wanted"
          type="number"
          min="0"
          step="0.01"
          placeholder="5"
          error={errors.quantityWanted?.message}
          {...register('quantityWanted', {
            min: {
              value: 0,
              message: 'Quantity cannot be negative'
            }
          })}
        />

        <div>
          <label
            htmlFor="inquiry-message"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Message
          </label>

          <textarea
            id="inquiry-message"
            rows={5}
            placeholder="Is this available for pickup tomorrow?"
            className={[
              'glass-input mt-2 resize-y px-4 py-3',
              errors.message ? 'border-red-600' : ''
            ].join(' ')}
            aria-invalid={Boolean(errors.message)}
            {...register('message', {
              required: 'Message is required',
              minLength: {
                value: 5,
                message: 'Message must be at least 5 characters'
              },
              maxLength: {
                value: 1000,
                message: 'Message is too long'
              }
            })}
          />

          {errors.message && (
            <p
              role="alert"
              className="mt-1 text-xs font-semibold text-red-700"
            >
              {errors.message.message}
            </p>
          )}
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="inquiry-website">
            Website
          </label>

          <input
            id="inquiry-website"
            tabIndex="-1"
            autoComplete="off"
            {...register('website')}
          />
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >
          Send inquiry
        </Button>
      </div>
    </form>
  );
};

export default InquiryForm;