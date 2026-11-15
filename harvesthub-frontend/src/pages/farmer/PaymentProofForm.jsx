import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';

const PaymentProofForm = ({
  product,
  onSubmit,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      referenceNumber: '',
      method: 'gcash'
    }
  });

  const submit = async (formData) => {
    const proofImage = formData.proofImage?.[0];

    if (!proofImage) {
      return;
    }

    const payload = new FormData();

    payload.append(
      'productId',
      product._id
    );

    payload.append(
      'referenceNumber',
      formData.referenceNumber
    );

    payload.append(
      'method',
      formData.method
    );

    payload.append(
      'proofImage',
      proofImage
    );

    await onSubmit(payload);
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <h2 className="text-xl font-extrabold text-[var(--green-900)]">
        Submit payment proof
      </h2>

      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
        Send ₱20 through the displayed payment channel, then upload
        your receipt and reference number.
      </p>

      <form
        onSubmit={handleSubmit(submit)}
        className="mt-5 space-y-5"
      >
        <Input
          label="Payment reference number"
          placeholder="GCASH-20261004-001"
          error={errors.referenceNumber?.message}
          required
          {...register('referenceNumber', {
            required: 'Reference number is required',
            minLength: {
              value: 3,
              message: 'Reference number is too short'
            }
          })}
        />

        <Select
          label="Payment method"
          {...register('method')}
        >
          <option value="gcash">GCash</option>
          <option value="bank_transfer">
            Bank transfer
          </option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </Select>

        <div>
          <label
            htmlFor="payment-proof"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Receipt screenshot
          </label>

          <input
            id="payment-proof"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="glass-input mt-2 px-4 py-3"
            {...register('proofImage', {
              required: 'Payment proof is required'
            })}
          />

          {errors.proofImage && (
            <p
              role="alert"
              className="mt-1 text-xs font-semibold text-red-700"
            >
              {errors.proofImage.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Submit proof
        </Button>
      </form>
    </GlassCard>
  );
};

export default PaymentProofForm;
