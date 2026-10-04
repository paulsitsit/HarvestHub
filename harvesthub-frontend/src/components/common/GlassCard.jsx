const GlassCard = ({
  children,
  className = '',
  dark = false,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={[
        'glass-panel rounded-2xl',
        dark ? 'glass-panel-dark' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;