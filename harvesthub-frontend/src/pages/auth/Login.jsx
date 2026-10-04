import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail
} from 'react-icons/fi';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Input from '../../components/common/Input.jsx';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';

const getRedirectPath = (user, from) => {
  if (from) {
    return from;
  }

  return user?.role === 'admin'
    ? '/admin/dashboard'
    : '/farmer/dashboard';
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (formData) => {
    try {
      const data = await login(formData);

      success('Welcome back to HarvestHub.');

      const from = location.state?.from;

      navigate(
        getRedirectPath(data.user, from),
        {
          replace: true
        }
      );
    } catch {
      error('Unable to log in. Check your credentials.');
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-5 py-12 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden rounded-3xl bg-[var(--green-900)] p-10 text-white lg:block">
          <div className="text-5xl">🌾</div>

          <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold-300)]">
            Seller portal
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight">
            Bring your harvest closer to buyers.
          </h1>

          <p className="mt-5 leading-8 text-white/70">
            Manage your farmer profile, product listings, buyer
            inquiries, reviews, and listing fees in one place.
          </p>

          <div className="mt-10 space-y-4 text-sm text-white/75">
            <p className="flex items-center gap-3">
              <span className="text-[var(--gold-300)]">✓</span>
              Direct buyer inquiries
            </p>

            <p className="flex items-center gap-3">
              <span className="text-[var(--gold-300)]">✓</span>
              Admin-reviewed listings
            </p>

            <p className="flex items-center gap-3">
              <span className="text-[var(--gold-300)]">✓</span>
              Simple farmer dashboard
            </p>
          </div>
        </section>

        <GlassCard className="rounded-3xl p-7 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Farmer login
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-[var(--green-900)]">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Log in to manage your farm and listings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email address'
                }
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                error={errors.password?.message}
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

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
            >
              <FiLock />
              Log in
            </Button>
          </form>

          <div className="mt-7 border-t border-[var(--green-100)] pt-6 text-center">
            <p className="text-sm text-[var(--muted)]">
              Do not have a farmer account?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--green-700)] hover:underline"
            >
              Register as a farmer
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/admin/login"
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--green-700)]"
            >
              Admin login
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;