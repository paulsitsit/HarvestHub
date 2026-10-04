import { useId, useMemo } from 'react';
import { FiImage, FiX } from 'react-icons/fi';

const ImageUploader = ({
  label = 'Images',
  files = [],
  onChange,
  maxFiles = 5,
  multiple = true,
  accept = 'image/jpeg,image/png,image/webp',
  error,
  hint = 'JPG, PNG, or WEBP up to 2 MB per image.'
}) => {
  const inputId = useId();

  const previews = useMemo(() => {
    return files.map((file) => {
      if (typeof file === 'string') {
        return {
          key: file,
          source: file,
          file
        };
      }

      return {
        key: `${file.name}-${file.lastModified}`,
        source: URL.createObjectURL(file),
        file
      };
    });
  }, [files]);

  const handleChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const nextFiles = multiple
      ? [...files, ...selectedFiles].slice(0, maxFiles)
      : selectedFiles.slice(0, 1);

    onChange(nextFiles);

    event.target.value = '';
  };

  const removeFile = (index) => {
    onChange(
      files.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        className="block text-sm font-bold text-[var(--green-900)]"
      >
        {label}
      </label>

      <label
        htmlFor={inputId}
        className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--green-300)] bg-white/40 p-5 text-center transition hover:bg-white/70"
      >
        <FiImage
          size={28}
          className="mb-2 text-[var(--green-700)]"
        />

        <span className="text-sm font-bold text-[var(--green-900)]">
          Choose image{multiple ? 's' : ''}
        </span>

        <span className="mt-1 text-xs text-[var(--muted)]">
          {hint}
        </span>

        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {previews.map((preview, index) => (
            <div
              key={preview.key}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/60 bg-white/60"
            >
              <img
                src={preview.source}
                alt={`Selected upload ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeFile(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1 top-1 inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-lg bg-black/65 text-white opacity-100 transition hover:bg-red-700 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="text-xs font-semibold text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;