import { useState, useEffect } from "react";
import GalleryCard from "./GalleryCard";
import GalleryModal from "./GalleryModal";
import MediaService from "../../services/MediaService";

export default function GalleryGrid() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(6); // Show 6 images per page (2 rows of 3)

  // Fallback images if backend has no data
  const fallbackImages = [
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      title: "Luxury Room",
      desc: "Premium king-size room with city view",
    },
    {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      title: "Swimming Pool",
      desc: "Infinity edge pool with night lighting",
    },
    {
      src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      title: "Elegant Interior",
      desc: "Modern luxury interior design",
    },
    {
      src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      title: "Hotel Lobby",
      desc: "Spacious 5-star lobby experience",
    },
    {
      src: "https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800&q=80",
      title: "Fine Dining",
      desc: "Global cuisines & candle light dinner",
    },
    {
      src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
      title: "Royal Suite",
      desc: "Luxury stay with maximum comfort",
    },
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      console.log("🔍 Fetching GALLERY images from backend (owner_type='GALLERY' only)...");
      setLoading(true);

      // Use dedicated getGalleryImages method that filters owner_type='GALLERY'
      const galleryMedia = await MediaService.getGalleryImages();
      console.log("✅ Gallery media response:", galleryMedia);

      // Ensure it's an array
      if (!Array.isArray(galleryMedia)) {
        console.warn("⚠️ Gallery media is not an array:", galleryMedia);
        setImages(fallbackImages);
        setError("No gallery images found");
        return;
      }

      console.log("🖼️ Gallery images (owner_type=GALLERY):", galleryMedia.length);

      // Format for gallery display
      const formattedImages = galleryMedia.map(media =>
        MediaService.formatMediaForGallery(media)
      );

      console.log("✨ Formatted gallery images:", formattedImages);

      // Use fetched images or fallback
      if (formattedImages.length > 0) {
        setImages(formattedImages);
        console.log("✅ Using backend GALLERY images");
        setError(null);
      } else {
        console.log("⚠️ No GALLERY images in backend, using fallback");
        setImages(fallbackImages);
        setError("No gallery images found. Showing sample images.");
      }

    } catch (error) {
      console.error("❌ Error fetching gallery images:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      setError("Failed to load gallery images from backend");

      // Use fallback images on error
      console.log("⚠️ Using fallback images due to error");
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  const delayClasses = [
    'animate-delay-100',
    'animate-delay-200',
    'animate-delay-300',
    'animate-delay-400',
    'animate-delay-500',
    'animate-delay-600',
  ];

  // Pagination calculations
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Reset to page 1 when images change
  useEffect(() => {
    setCurrentPage(1);
  }, [images.length]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-neutral-800 mb-4"></div>
          <p className="text-neutral-600 font-light">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Error state (but still shows fallback images)
  if (error && images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchGalleryImages}
          className="px-6 py-2 bg-neutral-800 text-white text-sm uppercase tracking-wider hover:bg-neutral-900 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-600 font-light mb-4">No images available in the gallery yet.</p>
        <p className="text-sm text-neutral-500">Check back soon for updates!</p>
      </div>
    );
  }

  return (
    <>
      {/* Show info message if using fallback */}
      {error && images.length > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm text-center rounded">
          Could not load images from server. Showing sample gallery.
        </div>
      )}

      {/* Image Grid - Show current page images only */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {currentImages.map((item, index) => (
          <div key={item.id || index} className={`animate-fade-in-up ${delayClasses[index % delayClasses.length]}`}>
            <GalleryCard
              image={item.src}
              title={item.title}
              desc={item.desc}
              onClick={() => setSelectedImage(item.src)}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 mb-8">
          {/* Page Info */}
          <div className="text-center mb-8">
            <p className="text-sm text-neutral-600 font-light">
              Showing {indexOfFirstImage + 1}-{Math.min(indexOfLastImage, images.length)} of {images.length} images
            </p>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`
                px-4 py-2 border text-sm font-light uppercase tracking-wider transition-all
                ${currentPage === 1
                  ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'border-neutral-300 text-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-800'
                }
              `}
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                // Show ellipsis
                const showEllipsisBefore = pageNumber === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter = pageNumber === currentPage + 2 && currentPage < totalPages - 2;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={pageNumber} className="px-2 py-2 text-neutral-400">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`
                      min-w-[40px] px-3 py-2 border text-sm font-light transition-all
                      ${currentPage === pageNumber
                        ? 'bg-neutral-800 text-white border-neutral-800'
                        : 'border-neutral-300 text-neutral-800 hover:bg-neutral-100'
                      }
                    `}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`
                px-4 py-2 border text-sm font-light uppercase tracking-wider transition-all
                ${currentPage === totalPages
                  ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'border-neutral-300 text-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-800'
                }
              `}
            >
              Next →
            </button>
          </div>

          {/* Quick Jump (optional - for many pages) */}
          {totalPages > 5 && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-3">
                <span className="text-xs text-neutral-600 uppercase tracking-wider font-light">
                  Jump to page:
                </span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  className="w-16 px-2 py-1 border border-neutral-300 text-center text-sm focus:outline-none focus:border-neutral-500"
                />
                <span className="text-xs text-neutral-500 font-light">
                  of {totalPages}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <GalleryModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
