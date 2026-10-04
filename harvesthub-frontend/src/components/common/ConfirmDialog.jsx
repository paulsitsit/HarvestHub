import Button from './Button.jsx';
import Modal from './Modal.jsx';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  loading = false,
  danger = false
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <p className="text-sm leading-7 text-[var(--muted)]">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant={danger ? 'danger' : 'gold'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;