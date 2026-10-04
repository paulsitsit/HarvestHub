import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiUserPlus
} from 'react-icons/fi';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Input from '../../components/common/Input.jsx';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerFarmer } = useAuth();
  const { success, error } = useToast();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      farmName: '',
      bio: '',
      address: '',
      municipality: '',
      province: '',
      contactNumber: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (formData) => {
    try {
      await registerFarmer(formData);

      success(
        'Registration successful. Your account is pending approval.'
      );

      navigate('/farmer/dashboard', {
        replace: true
      });
    } catch {
      error(
        'Unable to register. Please check your information.'
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <GlassCard className="rounded-3xl p-7 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Become a seller
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-[var(--green-900)]">
            Register your farm
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Submit your details for admin review. You will need an
            approved farmer account before creating public listings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-10"
        >
          <section>
            <h2 className="text-xl font-extrabold text-[var(--green-900)]">
              Account information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Full name"
                placeholder="Juan Dela Cruz"
                error={errors.name?.message}
                required
                {...register('name', {
                  required: 'Full name is required',
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

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="juan@example.com"
                error={errors.email?.message}
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Enter a valid email address'
                  }
                })}
              />

              <Input
                label="Phone number"
                type="tel"
                placeholder="09171234567"
                error={errors.phone?.message}
                {...register('phone', {
                  maxLength: {
                    value: 30,
                    message: 'Phone number is too long'
                  }
                })}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  error={errors.password?.message}
                  required
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute right-2 top-8 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-[var(--green-700)] hover:bg-[var(--green-100)]"
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>

              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                error={errors.confirmPassword?.message}
                required
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password ||
                    'Passwords do not match'
                })}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[var(--green-900)]">
              Farm information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Farm name"
                placeholder="Dela Cruz Organic Farm"
                error={errors.farmName?.message}
                required
                {...register('farmName', {
                  required: 'Farm name is required',
                  minLength: {
                    value: 2,
                    message: 'Farm name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 150,
                    message: 'Farm name is too long'
                  }
                })}
              />

              <Input
                label="Farm contact number"
                type="tel"
                placeholder="09171234567"
                error={errors.contactNumber?.message}
                {...register('contactNumber', {
                  maxLength: {
                    value: 30,
                    message: 'Contact number is too long'
                  }
                })}
              />

              <Input
                label="Address"
                placeholder="Barangay San Isidro"
                error={errors.address?.message}
                {...register('address', {
                  maxLength: {
                    value: 300,
                    message: 'Address is too long'
                  }
                })}
              />

              <Input
                label="Municipality or city"
                placeholder="Lipa"
                error={errors.municipality?.message}
                {...register('municipality', {
                  maxLength: {
                    value: 100,
                    message: 'Municipality is too long'
                  }
                })}
              />

              <Input
                label="Province"
                placeholder="Batangas"
                error={errors.province?.message}
                {...register('province', {
                  maxLength: {
                    value: 100,
                    message: 'Province is too long'
                  }
                })}
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="register-bio"
                className="block text-sm font-bold text-[var(--green-900)]"
              >
                Farm bio
              </label>

              <textarea
                id="register-bio"
                rows={5}
                placeholder="Tell buyers about your farm..."
                className={[
                  'glass-input mt-2 resize-y px-4 py-3',
                  errors.bio ? 'border-red-600' : ''
                ].join(' ')}
                {...register('bio', {
                  maxLength: {
                    value: 2000,
                    message: 'Bio cannot exceed 2,000 characters'
                  }
                })}
              />

              {errors.bio && (
                <p
                  role="alert"
                  className="mt-1 text-xs font-semibold text-red-700"
                >
                  {errors.bio.message}
                </p>
              )}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--green-100)] pt-6">
            <p className="text-sm text-[var(--muted)]">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-extrabold text-[var(--green-700)] hover:underline"
              >
                Log in
              </Link>
            </p>

            <Button
              type="submit"
              loading={isSubmitting}
            >
              <FiUserPlus />
              Register farmer account
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default Register;