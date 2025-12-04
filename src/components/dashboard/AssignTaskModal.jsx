// Assign Task Modal Component
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import RoomService from '../../services/RoomService';

const AssignTaskModal = ({ isOpen, onClose, staff, onSuccess }) => {
  const [formData, setFormData] = useState({
    staffId: staff?.staffId || '',
    roomId: '',
    taskType: 'CLEANING',
    remarks: '',
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && staff) {
      setFormData((prev) => ({
        ...prev,
        staffId: staff.staffId,
      }));
      fetchRooms();
    }
  }, [isOpen, staff]);

  const fetchRooms = async () => {
    try {
      const response = await RoomService.getAllRooms();
      setRooms(response.data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSuccess(formData);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      staffId: '',
      roomId: '',
      taskType: 'CLEANING',
      remarks: '',
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-neutral-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-900">
              Assign Task to {staff?.name}
            </h3>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Room Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Room *
              </label>
              <select
                required
                value={formData.roomId}
                onChange={(e) =>
                  setFormData({ ...formData, roomId: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    Room {room.roomNumber} - {room.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Task Type *
              </label>
              <select
                required
                value={formData.taskType}
                onChange={(e) =>
                  setFormData({ ...formData, taskType: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CLEANING">Cleaning</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="CHECKOUT">Checkout</option>
                <option value="INSPECTION">Inspection</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                rows="3"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                placeholder="Enter any special instructions..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Assigning...' : 'Assign Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;

