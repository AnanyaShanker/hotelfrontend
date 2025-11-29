

export default function Card({ title, children }) {
  return (
    <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition duration-300">
      {title && (
        <h3 className="text-xl font-bold mb-6 text-gray-800">{title}</h3>
      )}
      {children}
    </div>
  );
}
