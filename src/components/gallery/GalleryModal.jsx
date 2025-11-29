export default function GalleryModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

      {/* CLOSE BUTTON */}
      <button
        className="absolute top-6 right-6 text-white text-3xl hover:text-red-400 transition"
        onClick={onClose}
      >
        ✕
      </button>

      {/* IMAGE */}
      <img
        src={image}
        alt="Fullscreen"
        className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
      />
    </div>
  );
}