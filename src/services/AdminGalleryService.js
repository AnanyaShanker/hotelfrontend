// src/services/AdminGalleryService.js
import axios from '../api/axiosConfig';

const AdminGalleryService = {
  /**
   * Upload a new gallery image
   * @param {File} file - Image file
   * @param {number} uploadedBy - Admin user ID
   * @param {string} description - Optional description
   * @returns {Promise} Upload response
   */
  uploadGalleryImage: async (file, uploadedBy, description = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', uploadedBy);
      if (description) {
        formData.append('description', description);
      }

      console.log('📤 Uploading gallery image...', {
        fileName: file.name,
        fileSize: file.size,
        uploadedBy
      });

      const response = await axios.post('/api/admin/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  },

  /**
   * Get all gallery images
   * @returns {Promise<Array>} List of gallery images
   */
  getAllGalleryImages: async () => {
    try {
      console.log('🔍 Fetching all gallery images...');
      const response = await axios.get('/api/admin/gallery/all');
      console.log(`✅ Fetched ${response.data.length} gallery images`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch gallery images:', error);
      throw error;
    }
  },

  /**
   * Get gallery statistics
   * @returns {Promise<Object>} Gallery stats (totalImages, totalSize, totalSizeMB)
   */
  getGalleryStats: async () => {
    try {
      console.log('📊 Fetching gallery statistics...');
      const response = await axios.get('/api/admin/gallery/stats');
      console.log('✅ Gallery stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch gallery stats:', error);
      throw error;
    }
  },

  /**
   * Delete a gallery image
   * @param {number} mediaId - Media ID to delete
   * @returns {Promise} Delete response
   */
  deleteGalleryImage: async (mediaId) => {
    try {
      console.log(`🗑️ Deleting gallery image ${mediaId}...`);
      const response = await axios.delete(`/media/${mediaId}`);
      console.log('✅ Image deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete image:', error);
      throw error;
    }
  },

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size (e.g., "2.34 MB")
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get image URL for display
   * @param {string} filePath - File path from backend
   * @returns {string} Full image URL
   */
  getImageUrl: (filePath) => {
    if (!filePath) return '';
    
    const cleanPath = filePath.replace(/^uploads\//, '');
    return `http://localhost:9193/uploads/${cleanPath}`;
  },

  /**
   * Validate image file before upload
   * @param {File} file - File to validate
   * @returns {Object} { isValid: boolean, error: string }
   */
  validateImageFile: (file) => {
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPG, PNG, WEBP, and GIF images are allowed'
      };
    }

    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image size must be less than 10MB'
      };
    }

    return { isValid: true, error: null };
  }
};

export default AdminGalleryService;

