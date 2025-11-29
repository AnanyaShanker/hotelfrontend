export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 pt-16">
      
      {/* MAIN FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">HotelEase</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Experience luxury, comfort, and world-class service at HotelEase.
            Where every stay becomes a beautiful memory.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#/" className="hover:text-white transition">Home</a></li>
            <li><a href="#/gallery" className="hover:text-white transition">Gallery</a></li>
            <li><a href="#" className="hover:text-white transition">Rooms</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-white font-semibold mb-4">Our Services</h3>
          <ul className="space-y-3 text-sm">
            <li>Luxury Rooms</li>
            <li>Spa & Wellness</li>
            <li>Fine Dining</li>
            <li>Swimming Pool</li>
            <li>Conference Halls</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li>📍 India</li>
            <li>📧 hotel.mgmt.app@gmail.com</li>
            <li>📞 +91 98765 43210</li>
            <li>⏰ 24/7 Customer Support</li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="mt-12 border-t border-white/10"></div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center py-6 text-sm text-gray-400 gap-4">
        <p>© {new Date().getFullYear()} HotelEase. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>
      </div>
    </footer>
  );
}
