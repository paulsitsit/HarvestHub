import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createReview } from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import StarRating from '../common/StarRating.jsx';
import useToast from '../../hooks/useToast.js';

const ReviewForm = ({
  farmerId,
  onSubmitted
}) => {
  const { success, error } = useToast();

  const [selectedRating, setSelectedRating] =
    useState(0);

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
      comment: '',
      website: ''
    }
  });

  const onSubmit = async (formData) => {
    if (selectedRating < 1) {
      error('Please select a rating.');
      return;
    }

    try {
      await createReview({
        farmer: farmerId,
        buyerName: formData.buyerName,
        rating: selectedRating,
        comment: formData.comment,
        website: formData.website
      });

      success('Thank you. Your review was submitted.');

      reset();
      setSelectedRating(0);
      onSubmitted?.();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to submit your review'
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
        Leave a review
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Share your experience as a guest buyer.
      </p>

      <div className="mt-5 space-y-5">
        <Input
          label="Your name"
          placeholder="Maria Santos"
          error={errors.buyerName?.message}
          {...register('buyerName', {
            required: 'Your name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            },
            maxLength: {
              value: 100,
              message: 'Name is too long'
            }
          })}
        />

        <div>
          <p className="mb-2 text-sm font-bold text-[var(--green-900)]">
            Rating
          </p>

          <StarRating
            value={selectedRating}
            interactive
            onChange={setSelectedRating}
            label="Choose your rating"
            size={25}
          />
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Comment
          </label>

          <textarea
            id="review-comment"
            rows={5}
            placeholder="Tell other buyers about your experience..."
            className={[
              'glass-input mt-2 resize-y px-4 py-3',
              errors.comment ? 'border-red-600' : ''
            ].join(' ')}
            aria-invalid={Boolean(errors.comment)}
            {...register('comment', {
              required: 'Comment is required',
              minLength: {
                value: 5,
                message: 'Comment must be at least 5 characters'
              },
              maxLength: {
                value: 1500,
                message: 'Comment is too long'
              }
            })}
          />

          {errors.comment && (
            <p
              role="alert"
              className="mt-1 text-xs font-semibold text-red-700"
            >
              {errors.comment.message}
            </p>
          )}
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="review-website">
            Website
          </label>

          <input
            id="review-website"
            tabIndex="-1"
            autoComplete="off"
            {...register('website')}
          />
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full sm:w-auto"
        >
          Submit review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;