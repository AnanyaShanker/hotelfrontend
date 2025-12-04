import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import RoomService from "../services/RoomService";
import BranchService from "../services/BranchService";
import { getAllRoomTypes } from "../services/RoomTypeService";
import { useAuth } from "../context/AuthContext";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("🔍 Fetching rooms data...");
      const [roomsData, branchesData, typesData] = await Promise.all([
        RoomService.getAllRooms(),
        BranchService.getAllBranches(),
        getAllRoomTypes().then(res => res.data)
      ]);

      console.log("✅ Rooms received:", roomsData);
      console.log("✅ Branches received:", branchesData);
      console.log("✅ Room types received:", typesData);

      setRooms(roomsData || []);
      setBranches(branchesData || []);
      setRoomTypes(typesData || []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setRooms([]);
      setBranches([]);
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const branchMatch = selectedBranch === "ALL" || room.branchId === parseInt(selectedBranch);
    const typeMatch = selectedType === "ALL" || room.typeId === parseInt(selectedType);
    const availableMatch = room.status === 'AVAILABLE';
    return branchMatch && typeMatch && availableMatch;
  });

  const handleBookRoom = () => {
    if (!isAuthenticated) {
      localStorage.setItem("returnUrl", `/book-room`);
      navigate("/login");
      return;
    }
    navigate("/book-room");
  };

  const getRoomTypeName = (typeId) => {
    const type = roomTypes.find(t => t.typeId === typeId);
    return type ? type.typeName : "Unknown";
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.branchId === branchId);
    return branch ? branch.name : "Unknown";
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neutral-600 font-light">Loading rooms...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="py-24 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Our Accommodations
          </span>
          <h1 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            Explore Our Rooms
          </h1>
          <p className="text-neutral-700 text-base max-w-2xl mx-auto font-light">
            Discover comfortable and luxurious rooms tailored to your needs
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 border-t border-b border-neutral-200 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Branch Filter */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Select Branch
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedBranch("ALL")}
                  className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                    selectedBranch === "ALL"
                      ? "bg-neutral-800 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  All Branches
                </button>
                {branches.map((branch) => (
                  <button
                    key={branch.branchId}
                    onClick={() => setSelectedBranch(branch.branchId.toString())}
                    className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                      selectedBranch === branch.branchId.toString()
                        ? "bg-neutral-800 text-white"
                        : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Type Filter */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Select Room Type
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedType("ALL")}
                  className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                    selectedType === "ALL"
                      ? "bg-neutral-800 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  All Types
                </button>
                {roomTypes.map((type) => (
                  <button
                    key={type.typeId}
                    onClick={() => setSelectedType(type.typeId.toString())}
                    className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                      selectedType === type.typeId.toString()
                        ? "bg-neutral-800 text-white"
                        : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {type.typeName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredRooms.length > 0 && (
          <div className="text-center mb-8 text-sm text-neutral-600 font-light">
            Showing {filteredRooms.length} available {filteredRooms.length === 1 ? 'room' : 'rooms'}
          </div>
        )}

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-neutral-400 text-6xl mb-6">🏨</div>
            <p className="text-neutral-600 font-light text-lg mb-4">No rooms available</p>
            <p className="text-neutral-500 font-light text-sm">
              Try selecting different filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
              <div
                key={room.roomId}
                className={`bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-300 overflow-hidden hover:shadow-lg animate-fade-in-up animate-delay-${Math.min(index + 1, 6)}00`}
              >
                {/* Image */}
                <div className="relative h-64 bg-neutral-200 overflow-hidden group">
                  {room.roomPrimaryImage ? (
                    <img
                      src={room.roomPrimaryImage}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🛏️
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-neutral-800 text-white px-4 py-2 text-xs uppercase tracking-wider font-light">
                    {getRoomTypeName(room.typeId)}
                  </div>
                  {room.status === 'AVAILABLE' && (
                    <div className="absolute top-4 left-4 bg-white text-neutral-800 px-3 py-1 text-xs uppercase tracking-wider font-light">
                      Available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-light mb-2 text-neutral-900 tracking-wide">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-neutral-500 font-light">
                      {getBranchName(room.branchId)}
                    </p>
                  </div>

                  {room.description && (
                    <p className="text-neutral-700 font-light text-sm mb-6 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 font-light">Capacity</span>
                      <span className="text-neutral-900 font-light">{room.capacity} guests</span>
                    </div>
                    {room.floorNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 font-light">Floor</span>
                        <span className="text-neutral-900 font-light">{room.floorNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-neutral-500 font-light block mb-1">
                        From
                      </span>
                      <span className="text-2xl font-light text-neutral-900">
                        ₹{parseFloat(room.pricePerNight).toLocaleString()}
                      </span>
                      <span className="text-neutral-600 font-light text-sm">/night</span>
                    </div>
                    <button
                      onClick={handleBookRoom}
                      className="px-6 py-3 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

