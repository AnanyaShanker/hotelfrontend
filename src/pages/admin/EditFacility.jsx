// Edit Facility - Edit existing facility with pre-filled data
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFacilityById, updateFacility, uploadPrimaryImage, uploadGalleryMultiple } from '../../services/FacilityService';
import { useAuth } from '../../hooks/useAuth';

const EditFacility = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    type: 'SPA',
    price: '',
    capacity: '',
    status: 'AVAILABLE',
    location: '',
    description: '',
    eventStart: '',
    eventEnd: ''
  });

  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingPrimaryImage, setExistingPrimaryImage] = useState(null);

  const facilityTypes = ['SPA', 'GYM', 'POOL', 'BANQUET', 'MEETING_HALL', 'RESTAURANT', 'OTHER'];

  useEffect(() => {
    fetchFacility();
  }, [id]);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      const data = await getFacilityById(id);

      setFormData({
        name: data.name || '',
        type: data.type || 'SPA',
        price: data.price || '',
        capacity: data.capacity || '',
        status: data.status || 'AVAILABLE',
        location: data.location || '',
        description: data.description || '',
        eventStart: data.eventStart ? data.eventStart.substring(0, 16) : '',
        eventEnd: data.eventEnd ? data.eventEnd.substring(0, 16) : ''
      });

      setExistingPrimaryImage(data.primaryImage);
    } catch (error) {
      console.error('Error fetching facility:', error);
      alert('Failed to load facility details');
      navigate('/admin/facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, primaryImage: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, primaryImage: 'Image must be less than 5MB' }));
        return;
      }
      setPrimaryImageFile(file);
      setPrimaryImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, primaryImage: '' }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped (invalid type or too large)');
    }

    setGalleryFiles(validFiles);
    setGalleryPreviews(validFiles.map(file => URL.createObjectURL(file)));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Facility name is required';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.eventStart && formData.eventEnd) {
      const start = new Date(formData.eventStart);
      const end = new Date(formData.eventEnd);
      if (end <= start) {
        newErrors.eventEnd = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert('Please fix all errors before submitting');
      return;
    }

    setSaving(true);

    try {
      // Step 1: Update facility details
      const facilityPayload = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        facilityPrimaryImage: existingPrimaryImage // Keep existing image reference
      };

      console.log('Updating facility:', facilityPayload);
      await updateFacility(id, facilityPayload);

      // Step 2: Upload new primary image if provided
      if (primaryImageFile) {
        console.log('Uploading new primary image...');
        await uploadPrimaryImage(id, primaryImageFile, user?.userId);
      }

      // Step 3: Upload new gallery images if provided
      if (galleryFiles.length > 0) {
        console.log('Uploading new gallery images...');
        await uploadGalleryMultiple(id, galleryFiles, user?.userId);
      }

      alert('Facility updated successfully!');
      navigate('/admin/facilities');
    } catch (error) {
      console.error('Error updating facility:', error);
      alert('Failed to update facility: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading facility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/facilities')}
            className="text-amber-600 hover:text-amber-700 mb-4 flex items-center gap-2"
          >
            ← Back to Facilities
          </button>
          <h1 className="text-3xl font-bold text-neutral-900">Edit Facility</h1>
          <p className="text-neutral-600 mt-2">Update facility details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Basic Information - Same as Create Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facility Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="e.g., Luxury Spa"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {facilityTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.capacity ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Event Timing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Event Timing (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Event Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="eventStart"
                  value={formData.eventStart}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Event End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="eventEnd"
                  value={formData.eventEnd}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.eventEnd ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.eventEnd && <p className="mt-1 text-sm text-red-500">{errors.eventEnd}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Images</h2>

            {/* Current Primary Image */}
            {existingPrimaryImage && !primaryImagePreview && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Current Primary Image
                </label>
                <img
                  src={existingPrimaryImage}
                  alt="Current primary"
                  className="w-48 h-48 object-cover rounded-lg border border-neutral-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {/* New Primary Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {existingPrimaryImage ? 'Replace Primary Image' : 'Upload Primary Image'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePrimaryImageChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.primaryImage && <p className="mt-1 text-sm text-red-500">{errors.primaryImage}</p>}
              {primaryImagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-neutral-600 mb-2">New primary image:</p>
                  <img
                    src={primaryImagePreview}
                    alt="New primary preview"
                    className="w-48 h-48 object-cover rounded-lg border border-neutral-200"
                  />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Add Gallery Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {galleryPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => navigate('/admin/facilities')}
              className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {saving ? 'Updating...' : 'Update Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFacility;

