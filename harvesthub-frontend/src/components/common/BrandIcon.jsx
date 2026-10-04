const BrandIcon = ({
  size = 'md',
  className = '',
  rounded = true
}) => {
  const sizes = {
    xs: 'h-8 w-8',
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  return (
    <img
      src="/harvesthub-icon.png"
      alt="HarvestHub"
      className={[
        sizes[size] || sizes.md,
        'shrink-0 object-contain',
        rounded ? 'rounded-full' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

export default BrandIcon;