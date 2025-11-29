export default function GalleryCard({ image, title, desc, onClick }) {
  return (
    <div
      className="h-72 w-full cursor-pointer [perspective:1200px]"
      onClick={onClick}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 
        [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]"
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl
          [backface-visibility:hidden]"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 bg-black text-white rounded-2xl
          flex flex-col items-center justify-center p-6 text-center shadow-xl
          [transform:rotateY(180deg)] [backface-visibility:hidden]"
        >
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300 text-sm">{desc}</p>
        </div>
      </div>
    </div>
  );
}
