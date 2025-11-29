export default function FacilityCard({ title, description, icon }) {
  return (
    <div className="p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}