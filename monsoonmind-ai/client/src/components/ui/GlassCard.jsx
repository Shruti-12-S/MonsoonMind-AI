const GlassCard = ({ children, className = "" }) => (
  <section className={`glass-panel rounded-2xl p-5 ${className}`}>
    {children}
  </section>
);

export default GlassCard;