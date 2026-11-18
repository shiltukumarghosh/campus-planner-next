export default function UniversityBrand({ subtitle }) {
  return (
    <div className="brand">
      <img className="brand-logo" src="/svu-logo.png" alt="" width={48} height={48} />
      <div className="brand-name">SVU Campus Planner{subtitle && <small>{subtitle}</small>}</div>
    </div>
  );
}
