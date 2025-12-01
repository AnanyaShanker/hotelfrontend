import axios from "../api/axiosConfig";

const API_BASE = "/facilities";
const BOOKING_BASE = "/facility-bookings";

// ========== FACILITY APIs ==========

export const getAllFacilities = async () => {
  const response = await axios.get(`${API_BASE}/all`);
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const addFacility = async (facility) => {
  const response = await axios.post(API_BASE, facility);
  return response.data;
};

export const updateFacility = async (id, facility) => {
  const response = await axios.put(`${API_BASE}/${id}`, facility);
  return response.data;
};

export const deleteFacility = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};

export const uploadPrimaryImage = async (id, file, uploadedBy) => {
  const formData = new FormData();
  formData.append("file", file);
  if (uploadedBy) formData.append("uploadedBy", uploadedBy);

  const response = await axios.post(`${API_BASE}/${id}/primary-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const uploadBrochure = async (id, file, uploadedBy) => {
  const formData = new FormData();
  formData.append("file", file);
  if (uploadedBy) formData.append("uploadedBy", uploadedBy);

  const response = await axios.post(`${API_BASE}/${id}/brochure`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const uploadGalleryImage = async (id, file, uploadedBy) => {
  const formData = new FormData();
  formData.append("file", file);
  if (uploadedBy) formData.append("uploadedBy", uploadedBy);

  const response = await axios.post(`${API_BASE}/${id}/gallery`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const uploadGalleryMultiple = async (id, files, uploadedBy) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  if (uploadedBy) formData.append("uploadedBy", uploadedBy);

  const response = await axios.post(`${API_BASE}/${id}/gallery/multiple`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getFacilityGallery = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}/gallery`);
  return response.data;
};

// ========== FACILITY BOOKING APIs ==========

export const createFacilityBooking = async (bookingRequest) => {
  const response = await axios.post(BOOKING_BASE, bookingRequest);
  return response.data;
};

export const getFacilityBookingById = async (id) => {
  const response = await axios.get(`${BOOKING_BASE}/${id}`);
  return response.data;
};

export const getFacilityBookingDetails = async (id) => {
  const response = await axios.get(`${BOOKING_BASE}/${id}/details`);
  return response.data;
};

export const getFacilityBookingsByFacility = async (facilityId, date) => {
  const response = await axios.get(`${BOOKING_BASE}/facility/${facilityId}`, {
    params: { date }
  });
  return response.data;
};

export const getFacilityBookingsByCustomer = async (customerId) => {
  const response = await axios.get(`${BOOKING_BASE}/customer/${customerId}`);
  return response.data;
};

export const cancelFacilityBooking = async (id, requestedBy) => {
  const response = await axios.post(`${BOOKING_BASE}/${id}/cancel`, null, {
    params: { requestedBy }
  });
  return response.data;
};

