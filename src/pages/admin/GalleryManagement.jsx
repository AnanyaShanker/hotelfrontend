// src/pages/admin/GalleryManagement.jsx
import { useState, useEffect } from 'react';
//import { useAuth } from '../../context/AuthContext';
import AdminGalleryService from '../../services/AdminGalleryService';
import { useAuth } from '../../hooks/useAuth';
export default function GalleryManagement() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ totalImages: 0, totalSize: 0, totalSizeMB: '0.00' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Upload form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, imageId: null, imageName: '' });

  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      const [imagesData, statsData] = await Promise.all([
        AdminGalleryService.getAllGalleryImages(),
        AdminGalleryService.getGalleryStats(),
      ]);
      setImages(imagesData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Failed to load gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  // File selection handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setUploadError('');
    setUploadSuccess('');

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, WEBP, and GIF images are allowed');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('Image size must be less than 10MB');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload handler
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image first');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      setUploadSuccess('');

      await AdminGalleryService.uploadGalleryImage(selectedFile, user.userId, description);

      setUploadSuccess('Image uploaded successfully!');
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setDescription('');
      document.getElementById('fileInput').value = '';

      // Reload gallery
      await loadGalleryData();

      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (error) {
      setUploadError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Delete handler
  const handleDelete = async (imageId) => {
    try {
      await AdminGalleryService.deleteGalleryImage(imageId);
      setDeleteModal({ isOpen: false, imageId: null, imageName: '' });
      await loadGalleryData();
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert('Failed to delete image');
    }
  };

  // Cancel upload
  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
    setUploadError('');
    setUploadSuccess('');
    document.getElementById('fileInput').value = '';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-neutral-800 mb-4"></div>
          <p className="text-neutral-600 font-light">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-light text-neutral-900 tracking-wide mb-2">Gallery Management</h1>
        <p className="text-neutral-600 font-light">Upload and manage hotel gallery images</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-sm uppercase tracking-widest text-neutral-600 font-light mb-2">Total Images</div>
          <div className="text-3xl font-light text-neutral-900">{stats.totalImages}</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-sm uppercase tracking-widest text-neutral-600 font-light mb-2">Total Storage</div>
          <div className="text-3xl font-light text-neutral-900">{stats.totalSizeMB} MB</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-sm uppercase tracking-widest text-neutral-600 font-light mb-2">Average Size</div>
          <div className="text-3xl font-light text-neutral-900">
            {stats.totalImages > 0 ? (stats.totalSize / stats.totalImages / (1024 * 1024)).toFixed(2) : '0.00'} MB
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-neutral-200 p-8">
        <h2 className="text-xl font-light text-neutral-900 mb-6">Upload New Image</h2>

        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
            {uploadError}
          </div>
        )}

        <div className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-sm uppercase tracking-widest text-neutral-600 font-light mb-3">
              Select Image *
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-500"
            />
            <p className="mt-2 text-xs text-neutral-500 font-light">
              Accepted formats: JPG, PNG, WEBP, GIF (Max 10MB)
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <label className="block text-sm uppercase tracking-widest text-neutral-600 font-light mb-3">
                Preview
              </label>
              <div className="border border-neutral-200 p-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto object-contain" />
                <p className="mt-3 text-sm text-neutral-700 text-center font-light">
                  {selectedFile?.name} ({formatFileSize(selectedFile?.size)})
                </p>
              </div>
            </div>
          )}

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm uppercase tracking-widest text-neutral-600 font-light mb-3">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Add a description for this image..."
              className="w-full px-4 py-3 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-500 font-light"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`px-8 py-3 text-sm uppercase tracking-wider font-light transition ${
                !selectedFile || uploading
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-neutral-800 text-white hover:bg-neutral-900'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {selectedFile && (
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="px-8 py-3 border border-neutral-300 text-neutral-800 text-sm uppercase tracking-wider font-light hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white border border-neutral-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light text-neutral-900">Gallery Images ({images.length})</h2>
          
          {/* View Toggle */}
          <div className="flex gap-2 border border-neutral-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-light transition ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-light transition ${
                viewMode === 'list' ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 text-neutral-600 font-light">
            <p className="text-lg mb-2">No images in gallery yet...</p>
            <p className="text-sm">Upload your first image to get started.</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.mediaId} className="group border border-neutral-200 hover:border-neutral-300 transition">
                <div className="aspect-video bg-neutral-100 overflow-hidden">
                  <img
                    src={`http://localhost:9193/${image.filePath.replace(/\\/g, '/')}`}
                    alt={image.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-neutral-900 font-light truncate mb-1">{image.fileName}</p>
                  <p className="text-xs text-neutral-600 font-light mb-3">{formatFileSize(image.fileSize)}</p>
                  <p className="text-xs text-neutral-500 font-light mb-4">{formatDate(image.uploadedAt)}</p>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, imageId: image.mediaId, imageName: image.fileName })}
                    className="w-full px-4 py-2 border border-red-300 text-red-700 text-xs uppercase tracking-wider font-light hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {images.map((image) => (
              <div key={image.mediaId} className="flex items-center gap-4 border border-neutral-200 p-4 hover:bg-neutral-50 transition">
                <div className="w-24 h-24 bg-neutral-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={`http://localhost:9193/${image.filePath.replace(/\\/g, '/')}`}
                    alt={image.fileName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=Image';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 font-light truncate">{image.fileName}</p>
                  <p className="text-xs text-neutral-600 font-light mt-1">
                    {formatFileSize(image.fileSize)} • {image.fileType}
                  </p>
                  <p className="text-xs text-neutral-500 font-light mt-1">{formatDate(image.uploadedAt)}</p>
                </div>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, imageId: image.mediaId, imageName: image.fileName })}
                  className="px-6 py-2 border border-red-300 text-red-700 text-xs uppercase tracking-wider font-light hover:bg-red-50 transition flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 border border-neutral-200">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Confirm Delete</h3>
            <p className="text-neutral-700 font-light mb-6">
              Are you sure you want to delete <strong>{deleteModal.imageName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteModal.imageId)}
                className="flex-1 px-6 py-3 bg-red-600 text-white text-sm uppercase tracking-wider font-light hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: false, imageId: null, imageName: '' })}
                className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-800 text-sm uppercase tracking-wider font-light hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

