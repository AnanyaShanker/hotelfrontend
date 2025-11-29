import { useState } from "react";
import GalleryCard from "./GalleryCard";
import GalleryModal from "./GalleryModal";

export default function GalleryGrid() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      title: "Luxury Room",
      desc: "Premium king-size room with city view",
    },
    {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      title: "Swimming Pool",
      desc: "Infinity edge pool with night lighting",
    },
    {
      src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      title: "Elegant Interior",
      desc: "Modern luxury interior design",
    },
    {
      src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
      title: "Hotel Lobby",
      desc: "Spacious 5-star lobby experience",
    },
    {
      src: "https://images.unsplash.com/photo-1576675784201-0e142b423952",
      title: "Fine Dining",
      desc: "Global cuisines & candle light dinner",
    },
    {
      src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      title: "Royal Suite",
      desc: "Luxury stay with maximum comfort",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {images.map((item, index) => (
          <GalleryCard
            key={index}
            image={item.src}
            title={item.title}
            desc={item.desc}
            onClick={() => setSelectedImage(item.src)}
          />
        ))}
      </div>

      <GalleryModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
