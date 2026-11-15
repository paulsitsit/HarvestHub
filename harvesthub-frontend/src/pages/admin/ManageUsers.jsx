import { useCallback, useEffect, useState } from 'react';
import {
  deleteUser,
  getAdminUsers,
  resetUserPassword,
  updateUserStatus
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import Loader from '../../components/common/Loader.jsx';
import UserTable from '../../components/admin/UserTable.jsx';
import useToast from '../../hooks/useToast.js';

const ManageUsers = () => {
  const { success, error } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: ''
  });

  const [passwordTarget, setPasswordTarget] =
    useState(null);
  const [newPassword, setNewPassword] =
    useState('');
  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response =
        await getAdminUsers({
          search: filters.search,
          role: filters.role || undefined,
          isActive:
            filters.isActive === ''
              ? undefined
              : filters.isActive,
          limit: 100
        });

      setUsers(response.data.users || []);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load users'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [error, filters.isActive, filters.role, filters.search]);

  useEffect(() => {
    Promise.resolve().then(loadUsers);
  }, [loadUsers]);

  const handleStatusChange = async (
    account,
    isActive
  ) => {
    setLoadingId(account._id);

    try {
      await updateUserStatus(
        account._id,
        isActive
      );

      success(
        isActive
          ? 'User activated.'
          : 'User deactivated.'
      );

      await loadUsers();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update account status'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handlePasswordReset = async () => {
    if (!passwordTarget) {
      return;
    }

    if (newPassword.length < 8) {
      error(
        'Password must be at least 8 characters.'
      );
      return;
    }

    setLoadingId(passwordTarget._id);

    try {
      await resetUserPassword(
        passwordTarget._id,
        newPassword
      );

      success('Password reset successfully.');
      setPasswordTarget(null);
      setNewPassword('');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to reset password'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setLoadingId(deleteTarget._id);

    try {
      await deleteUser(deleteTarget._id);

      success('User account deleted.');
      setDeleteTarget(null);
      await loadUsers();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to delete user'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Account administration
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Manage users
        </h1>
      </div>

      <div className="glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-[1fr_180px_180px_auto] md:items-end">
        <Input
          label="Search"
          placeholder="Name, email, phone..."
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value
            }))
          }
        />

        <Select
          label="Role"
          value={filters.role}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              role: event.target.value
            }))
          }
        >
          <option value="">All roles</option>
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
        </Select>

        <Select
          label="Account status"
          value={filters.isActive}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              isActive: event.target.value
            }))
          }
        >
          <option value="">All accounts</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              search: '',
              role: '',
              isActive: ''
            })
          }
        >
          Reset
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading users..." />
      ) : (
        <UserTable
          users={users}
          onStatusChange={handleStatusChange}
          onResetPassword={setPasswordTarget}
          onDelete={setDeleteTarget}
          loadingId={loadingId}
        />
      )}

      <Modal
        open={Boolean(passwordTarget)}
        onClose={() => {
          setPasswordTarget(null);
          setNewPassword('');
        }}
        title="Reset user password"
        size="sm"
      >
        <p className="text-sm leading-7 text-[var(--muted)]">
          Set a new password for{' '}
          <strong className="text-[var(--green-900)]">
            {passwordTarget?.email}
          </strong>
          .
        </p>

        <div className="mt-5">
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            placeholder="At least 8 characters"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              setPasswordTarget(null);
              setNewPassword('');
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handlePasswordReset}
            loading={
              loadingId === passwordTarget?._id
            }
          >
            Reset password
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete user account?"
        message={`Delete ${deleteTarget?.email || 'this account'} and its associated farmer data? This cannot be undone.`}
        confirmText="Delete account"
        danger
        loading={loadingId === deleteTarget?._id}
      />
    </div>
  );
};

export default ManageUsers;