export default function FacilityCard({ title, description, icon }) {
  return (
    <div className="group p-10 bg-white border border-neutral-200 hover:border-neutral-300 transition-all text-center">
      {/* Icon Container */}
      <div className="mb-6">
        <div className="text-4xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-base font-light mb-3 text-neutral-900 tracking-wide uppercase text-xs">
          {title}
        </h3>
        <p className="text-neutral-700 text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  );
}