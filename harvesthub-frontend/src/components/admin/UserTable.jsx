import {
  FiKey,
  FiPower,
  FiTrash2
} from 'react-icons/fi';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import GlassCard from '../common/GlassCard.jsx';
import { formatDate } from '../../utils/formatDate.js';

const UserTable = ({
  users = [],
  onStatusChange,
  onResetPassword,
  onDelete,
  loadingId
}) => {
  if (!users.length) {
    return (
      <EmptyState
        title="No users found"
        description="There are no accounts matching your filters."
      />
    );
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-[950px] w-full text-left">
          <caption className="sr-only">
            User account management table
          </caption>

          <thead className="bg-[var(--green-100)]">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Account
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Farmer status
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Last login
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--green-100)]">
            {users.map((user) => {
              const isLoading =
                loadingId === user._id;

              return (
                <tr
                  key={user._id}
                  className="transition hover:bg-white/70"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-[var(--green-900)]">
                      {user.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {user.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      status={
                        user.role === 'admin'
                          ? 'approved'
                          : 'visible'
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    {user.farmerProfile ? (
                      <Badge
                        status={
                          user.farmerProfile.status
                        }
                      />
                    ) : (
                      <span className="text-sm text-[var(--muted)]">
                        Not applicable
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(user.lastLogin)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={
                          user.isActive
                            ? 'danger'
                            : 'outline'
                        }
                        onClick={() =>
                          onStatusChange(
                            user,
                            !user.isActive
                          )
                        }
                        loading={isLoading}
                        aria-label={
                          user.isActive
                            ? `Deactivate ${user.email}`
                            : `Activate ${user.email}`
                        }
                      >
                        <FiPower />
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() =>
                          onResetPassword(user)
                        }
                        disabled={isLoading}
                        aria-label={`Reset password for ${user.email}`}
                      >
                        <FiKey />
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          onDelete(user)
                        }
                        disabled={isLoading}
                        aria-label={`Delete ${user.email}`}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default UserTable;