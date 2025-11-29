

export default function Button({ children, variant = "primary" }) {
  const base =
    "px-7 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95";

  const styles = {
    primary:
      "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg hover:shadow-2xl",
    outline:
      "border-2 border-black text-black hover:bg-black hover:text-white",
    glass:
      "backdrop-blur-lg bg-white/20 text-white border border-white/30 hover:bg-white/30",
  };

  return <button className={`${base} ${styles[variant]}`}>{children}</button>;
}