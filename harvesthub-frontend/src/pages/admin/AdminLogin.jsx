import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
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

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

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

      if (data.user?.role !== 'admin') {
        error('This account does not have admin access.');
        return;
      }

      success('Admin login successful.');

      navigate(
        location.state?.from || '/admin/dashboard',
        {
          replace: true
        }
      );
    } catch {
      error('Unable to log in as administrator.');
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-lg items-center px-5 py-12">
      <GlassCard className="w-full rounded-3xl p-7 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--green-900)] text-2xl text-white">
            🛡️
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-[var(--green-900)]">
            Admin login
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Manage farmers, products, payments, users, and reviews.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          <Input
            label="Admin email"
            type="email"
            autoComplete="email"
            placeholder="admin@harvesthub.local"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address'
              }
            })}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your admin password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full"
          >
            <FiLock />
            Log in to admin panel
          </Button>
        </form>

        <div className="mt-7 border-t border-[var(--green-100)] pt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--green-700)] hover:underline"
          >
            <FiArrowLeft />
            Back to marketplace
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminLogin;