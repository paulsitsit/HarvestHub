const BrandIcon = ({
  size = 'md',
  className = '',
  rounded = true
}) => {
  const sizes = {
    xs: 'h-8 w-8',
    sm: 'h-11 w-11',
    md: 'h-20 w-20',
    lg: 'h-32 w-32',
    xl: 'h-44 w-44'
  };

  return (
    <img
      src="/harvesthub-icon.png"
      alt="HarvestHub"
      width="176"
      height="176"
      className={[
        sizes[size] || sizes.md,
        'block shrink-0 object-contain',
        rounded ? 'rounded-2xl' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

export default BrandIcon;