export default function GalleryModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 animate-fade-in">

      {/* CLOSE BUTTON - Minimal Style */}
      <button
        className="absolute top-8 right-8 w-12 h-12 border border-white/30 text-white hover:bg-white/10 transition flex items-center justify-center text-2xl font-light animate-fade-in animate-delay-100"
        onClick={onClose}
      >
        ×
      </button>

      {/* IMAGE - No rounded corners */}
      <img
        src={image}
        alt="Fullscreen"
        className="max-w-[90%] max-h-[90%] border-4 border-white animate-scale-in"
      />
    </div>
  );
}