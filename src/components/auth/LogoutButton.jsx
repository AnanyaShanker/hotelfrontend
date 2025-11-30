export default function LogoutButton() {
    const handleLogout = () => {
    localStorage.removeItem("token"); // delete JWT token
    window.location.href = "/login"; // redirect to login
    };
   
    return (
    <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
    Logout
    </button>
    );
   }