import { useCallback, useEffect, useState } from 'react';
import {
  approveFarmer,
  flagFarmerFraud,
  getAdminFarmers,
  rejectFarmer,
  suspendFarmer
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import FarmerApprovalTable from '../../components/admin/FarmerApprovalTable.jsx';
import Loader from '../../components/common/Loader.jsx';
import useToast from '../../hooks/useToast.js';

const ManageFarmers = () => {
  const { success, error } = useToast();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    flagged: ''
  });

  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState('');

  const loadFarmers = useCallback(async () => {
    setLoading(true);

    try {
      const response =
        await getAdminFarmers({
          search: filters.search,
          status: filters.status || undefined,
          flagged: filters.flagged || undefined,
          limit: 100
        });

      setFarmers(response.data.farmers || []);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load farmers'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [error, filters.flagged, filters.search, filters.status]);

  useEffect(() => {
    Promise.resolve().then(loadFarmers);
  }, [loadFarmers]);

  const runAction = async (
    farmer,
    action,
    callback
  ) => {
    setLoadingId(farmer._id);

    try {
      await callback();

      success(
        action
      );

      await loadFarmers();
      setModal(null);
      setReason('');
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to update farmer'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const openReasonModal = (
    type,
    farmer
  ) => {
    setReason('');

    setModal({
      type,
      farmer
    });
  };

  const handleModalConfirm = async () => {
    if (!modal) {
      return;
    }

    const { type, farmer } = modal;

    if (
      ['reject', 'suspend', 'flag'].includes(type) &&
      !reason.trim()
    ) {
      error('Please provide a reason.');
      return;
    }

    if (type === 'reject') {
      await runAction(
        farmer,
        'Farmer rejected.',
        () =>
          rejectFarmer(
            farmer._id,
            reason.trim()
          )
      );
    }

    if (type === 'suspend') {
      await runAction(
        farmer,
        'Farmer suspended.',
        () =>
          suspendFarmer(
            farmer._id,
            reason.trim()
          )
      );
    }

    if (type === 'flag') {
      await runAction(
        farmer,
        farmer.isFlaggedFraud
          ? 'Fraud flag removed.'
          : 'Farmer flagged.',
        () =>
          flagFarmerFraud(
            farmer._id,
            !farmer.isFlaggedFraud,
            reason.trim()
          )
      );
    }
  };

  const handleApprove = async (farmer) => {
    await runAction(
      farmer,
      'Farmer approved.',
      () => approveFarmer(farmer._id)
    );
  };

  const handleReject = (farmer) => {
    openReasonModal('reject', farmer);
  };

  const handleSuspend = (farmer) => {
    openReasonModal('suspend', farmer);
  };

  const handleFlag = (farmer) => {
    if (farmer.isFlaggedFraud) {
      runAction(
        farmer,
        'Fraud flag removed.',
        () =>
          flagFarmerFraud(
            farmer._id,
            false,
            ''
          )
      );

      return;
    }

    openReasonModal('flag', farmer);
  };

  const modalTitle = {
    reject: 'Reject farmer',
    suspend: 'Suspend farmer',
    flag: modal?.farmer?.isFlaggedFraud
      ? 'Remove fraud flag'
      : 'Flag farmer as fraud'
  }[modal?.type];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Account verification
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Manage farmers
        </h1>
      </div>

      <div className="glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-[1fr_220px_180px_auto] md:items-end">
        <Input
          label="Search"
          placeholder="Name, email, farm, location..."
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value
            }))
          }
        />

        <Select
          label="Status"
          value={filters.status}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: event.target.value
            }))
          }
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </Select>

        <Select
          label="Fraud flag"
          value={filters.flagged}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              flagged: event.target.value
            }))
          }
        >
          <option value="">All farmers</option>
          <option value="true">Flagged</option>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              search: '',
              status: '',
              flagged: ''
            })
          }
        >
          Reset
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading farmers..." />
      ) : (
        <FarmerApprovalTable
          farmers={farmers}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onFlag={handleFlag}
          loadingId={loadingId}
        />
      )}

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modalTitle || 'Confirm action'}
        size="sm"
      >
        <p className="text-sm leading-7 text-[var(--muted)]">
          {modal?.farmer?.farmName}
        </p>

        <div className="mt-5">
          <label
            htmlFor="farmer-action-reason"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Reason
          </label>

          <textarea
            id="farmer-action-reason"
            rows={5}
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Enter a reason for this action..."
            className="glass-input mt-2 resize-y px-4 py-3"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setModal(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleModalConfirm}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageFarmers;