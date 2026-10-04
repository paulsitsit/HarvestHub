const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="mesh-orb mesh-orb-green" />
      <div className="mesh-orb mesh-orb-gold" />
      <div className="mesh-orb mesh-orb-cream" />
    </div>
  );
};

export default AnimatedBackground;