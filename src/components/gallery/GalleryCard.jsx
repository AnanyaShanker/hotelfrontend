export default function GalleryCard({ image, title, desc, onClick }) {
  return (
    <div
      className="group cursor-pointer border border-neutral-200 hover:border-neutral-300 transition-all bg-white overflow-hidden"
      onClick={onClick}
    >
      {/* IMAGE */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />

        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Minimal View Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 border border-white flex items-center justify-center text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="p-6 border-t border-neutral-200">
        <h3 className="text-base font-light mb-2 text-neutral-900 tracking-wide uppercase text-xs">
          {title}
        </h3>
        <p className="text-neutral-700 text-sm font-light">{desc}</p>
      </div>
    </div>
  );
}
