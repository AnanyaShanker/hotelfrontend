// src/services/MediaService.js
import axios from "../api/axiosConfig";
 
const API_URL = "/media";
 
class MediaService {
  // Get all media
  getAllMedia() {
    console.log("🔍 Fetching all media from:", API_URL + "/all");
    return axios.get(`${API_URL}/all`);
  }
 
  // Get media by ID
  getMediaById(id) {
    return axios.get(`${API_URL}/${id}`);
  }
 
  // Upload file
  uploadFile(file, ownerType, ownerId, uploadedBy) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerType", ownerType);
    formData.append("ownerId", ownerId);
    formData.append("uploadedBy", uploadedBy);
 
    return axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
 
  // Delete media
  deleteMedia(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
 
  // Download file
  downloadFile(id) {
    return axios.get(`${API_URL}/download/${id}`, {
      responseType: "blob",
    });
  }
 
  // Get gallery images (filter by owner type)
  getGalleryImages(ownerType = "GALLERY") {
    console.log("🔍 Fetching gallery images...");
    return this.getAllMedia().then((response) => {
      const allMedia = response.data || response || [];
      // Filter images for gallery (you can filter by ownerType or fileType)
      return allMedia.filter((media) => {
        // Filter only images
        const isImage = media.fileType?.startsWith("image/");
        // Optionally filter by owner type
        const isGalleryImage = !ownerType || media.ownerType === ownerType;
        return isImage && isGalleryImage;
      });
    });
  }
 
  // Get images by owner (e.g., FACILITY, ROOM)
  getImagesByOwner(ownerType, ownerId) {
    return this.getAllMedia().then((response) => {
      const allMedia = response.data || response || [];
      return allMedia.filter(
        (media) =>
          media.ownerType === ownerType &&
          media.ownerId === ownerId &&
          media.fileType?.startsWith("image/")
      );
    });
  }
 
  // Helper: Convert file path to URL
  getImageUrl(filePath) {
    if (!filePath) return null;
 
    // If it's already a full URL (http/https), return as is
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
 
    // If it's a local path, construct download URL
    // Assuming backend serves files at /media/download/{id}
    // You might need to adjust this based on your backend setup
    return filePath;
  }
 
  // Helper: Format media object for display
  formatMediaForGallery(media) {
    return {
      id: media.mediaId,
      src: this.getImageUrl(media.filePath),
      title: media.fileName?.split("_").slice(1).join("_") || "Image", // Remove timestamp prefix
      desc: `Uploaded ${new Date(media.uploadedAt).toLocaleDateString()}`,
      type: media.fileType,
      ownerType: media.ownerType,
      ownerId: media.ownerId,
    };
  }
}
 
export default new MediaService();
 
// Create and export an instance of the service
 
 
 