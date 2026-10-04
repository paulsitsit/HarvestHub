import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  title = 'Nothing here yet',
  description = 'There are no records to display.',
  action
}) => {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-[var(--green-100)] p-4 text-[var(--green-700)]">
        <FiInbox size={28} />
      </div>

      <h3 className="text-lg font-extrabold text-[var(--green-900)]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;