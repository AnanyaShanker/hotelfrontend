    public int addFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public Facility getFacilityById(int id) {
        return facilityRepository.findById(id);
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public boolean updateFacility(Facility facility) {
        return facilityRepository.update(facility);
    }

    public boolean deleteFacility(int id) {
        return facilityRepository.delete(id);
    }

    // ---------- FILE UPLOADS ----------
    public String uploadAndSetPrimaryImage(int facilityId, MultipartFile file, Integer uploadedBy) throws Exception {
        String original = file.getOriginalFilename().toLowerCase();
        if (!(original.endsWith(".jpg") || original.endsWith(".jpeg") || original.endsWith(".png") || original.endsWith(".webp"))) {
            throw new IllegalArgumentException("Primary image must be JPG, JPEG, PNG, or WEBP");
        }

        MediaUploadRequest req = mediaService.handleFileUpload(file, "FACILITY", facilityId, uploadedBy);
        mediaRepository.save(req);

        String path = req.getFilePath();
        boolean ok = facilityRepository.updatePrimaryImage(facilityId, path);
        if (!ok) throw new RuntimeException("Failed to update facility primary image");

        return path;
    }

    public String uploadAndSetBrochure(int facilityId, MultipartFile file, Integer uploadedBy) throws Exception {
        String original = file.getOriginalFilename().toLowerCase();
        if (!original.endsWith(".pdf")) {
            throw new IllegalArgumentException("Brochure must be a PDF file");
        }

        MediaUploadRequest req = mediaService.handleFileUpload(file, "FACILITY_BROCHURE", facilityId, uploadedBy);
        mediaRepository.save(req);

        String path = req.getFilePath();
        boolean ok = facilityRepository.updateBrochure(facilityId, path);
        if (!ok) throw new RuntimeException("Failed to update facility brochure");

        return path;
    }

    public int uploadGalleryImage(int facilityId, MultipartFile file, Integer uploadedBy) throws Exception {
        String original = file.getOriginalFilename().toLowerCase();
        if (!(original.endsWith(".jpg") || original.endsWith(".jpeg") || original.endsWith(".png") || original.endsWith(".webp"))) {
            throw new IllegalArgumentException("Gallery image must be JPG, JPEG, PNG, or WEBP");
        }

        MediaUploadRequest req = mediaService.handleFileUpload(file, "FACILITY", facilityId, uploadedBy);
        return mediaRepository.save(req);
    }

    public List<Media> getGallery(int facilityId) {
        return mediaRepository.findByOwner("FACILITY", facilityId);
    }

    // ---------- DTO BUILDER ----------
    public FacilityResponseDTO buildResponseDTO(Facility f) {
        FacilityResponseDTO dto = new FacilityResponseDTO();
        dto.setFacilityId(f.getFacilityId());
        dto.setName(f.getName());
        dto.setType(f.getType());
        dto.setPrice(f.getPrice());
        dto.setCapacity(f.getCapacity());
        dto.setEventStart(f.getEventStart());
        dto.setEventEnd(f.getEventEnd());
        dto.setStatus(f.getStatus());
        dto.setPrimaryImage(f.getFacilityPrimaryImage());
        dto.setBrochure(f.getBrochureDocument());
        dto.setDescription(f.getDescription());
        dto.setLocation(f.getLocation());
        dto.setCreatedAt(f.getCreatedAt());
        dto.setUpdatedAt(f.getUpdatedAt());

        // Attach gallery
        dto.setGallery(mediaRepository.findByOwner("FACILITY", f.getFacilityId()));

        return dto;
    }
}







@echo off
echo ========================================
echo Backend SecurityConfig Locator
echo ========================================
echo.
echo Searching for your backend SecurityConfig.java...
echo.

REM Search common locations
for %%D in (
    "C:\Users\anany\Desktop"
    "C:\Users\anany\Documents"
    "C:\Users\anany\WebstormProjects"
    "C:\Users\703440113\Desktop"
    "C:\Users\703440113\Documents"
) do (
    if exist %%D (
        echo Searching in %%D...
        dir /s /b "%%D\SecurityConfig.java" 2>nul
    )
)

echo.
echo ========================================
echo If you see paths above, that's your backend SecurityConfig!
echo Copy the path and use it in the next step.
echo ========================================
echo.
pause

