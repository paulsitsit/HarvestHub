import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiSave,
  FiUpload
} from 'react-icons/fi';
import {
  getFarmerProfile,
  updateFarmerProfile
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import ImageUploader from '../../components/common/ImageUploader.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import { API_ORIGIN } from '../../utils/constants.js';

const FarmerProfile = () => {
  const {
    refreshUser
  } = useAuth();

  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] =
    useState([]);
  const [validId, setValidId] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm();

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response =
          await getFarmerProfile();

        if (!active) {
          return;
        }

        const profileData = response.data;

        setProfile(profileData);

        reset({
          farmName: profileData.farmName || '',
          bio: profileData.bio || '',
          address: profileData.address || '',
          municipality: profileData.municipality || '',
          province: profileData.province || '',
          contactNumber: profileData.contactNumber || ''
        });
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load farmer profile'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [error, reset]);

  const onSubmit = async (formData) => {
    const payload = new FormData();

    Object.entries(formData).forEach(
      ([key, value]) => {
        payload.append(key, value || '');
      }
    );

    if (profilePhoto[0] instanceof File) {
      payload.append(
        'profilePhoto',
        profilePhoto[0]
      );
    }

    photos
      .filter((file) => file instanceof File)
      .forEach((file) => {
        payload.append('farmPhotos', file);
      });

    if (validId[0] instanceof File) {
      payload.append(
        'validIdImage',
        validId[0]
      );
    }

    try {
      const response =
        await updateFarmerProfile(payload);

      setProfile(response.data);
      setPhotos([]);
      setProfilePhoto([]);
      setValidId([]);

      await refreshUser();

      success('Farmer profile updated successfully.');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update farmer profile'
        )
      );
    }
  };

  if (loading) {
    return (
      <Loader label="Loading farmer profile..." />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Farm profile
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-extrabold text-[var(--green-900)]">
            Tell buyers about your farm
          </h1>

          <Badge status={profile?.status} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <GlassCard className="p-5 sm:p-7">
          <h2 className="text-xl font-extrabold text-[var(--green-900)]">
            Farm information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input
              label="Farm name"
              required
              error={errors.farmName?.message}
              {...register('farmName', {
                required: 'Farm name is required',
                minLength: {
                  value: 2,
                  message: 'Farm name must be at least 2 characters'
                }
              })}
            />

            <Input
              label="Contact number"
              type="tel"
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
              htmlFor="farmer-bio"
              className="block text-sm font-bold text-[var(--green-900)]"
            >
              Farm bio
            </label>

            <textarea
              id="farmer-bio"
              rows={6}
              className="glass-input mt-2 resize-y px-4 py-3"
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
        </GlassCard>

        <GlassCard className="p-5 sm:p-7">
          <h2 className="text-xl font-extrabold text-[var(--green-900)]">
            Verification and photos
          </h2>

          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            Upload clear images. The valid ID is visible to administrators
            for account verification.
          </p>

          <div className="mt-6 grid gap-7 lg:grid-cols-3">
            <ImageUploader
              label="Profile photo"
              files={profilePhoto}
              onChange={setProfilePhoto}
              multiple={false}
              maxFiles={1}
            />

            <ImageUploader
              label="Farm photos"
              files={photos}
              onChange={setPhotos}
              multiple
              maxFiles={5}
            />

            <ImageUploader
              label="Valid ID"
              files={validId}
              onChange={setValidId}
              multiple={false}
              maxFiles={1}
            />
          </div>
        </GlassCard>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isSubmitting}
          >
            <FiSave />
            Save profile
          </Button>
        </div>
      </form>

      {profile?.profilePhoto && (
        <p className="text-xs text-[var(--muted)]">
          Current profile photo:{' '}
          <a
            href={`${API_ORIGIN}${profile.profilePhoto}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[var(--green-700)] underline"
          >
            View file
          </a>
        </p>
      )}
    </div>
  );
};

export default FarmerProfile;