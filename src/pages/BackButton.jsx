import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/manager-dashboard")}
      className="mb-6 text-neutral-600 hover:text-neutral-900 font-medium text-base tracking-wide px-4 py-2 transition-colors duration-200 ease-in-out hover:scale-105"
    >
      ← Back to Dashboard
    </button>
  );
}
