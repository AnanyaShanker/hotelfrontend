

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * PublicLayout
 *
 * Wraps public pages consistently. It:
 * - Renders a fixed navbar (so we add a spacer for the content)
 * - Centers content and enforces a max-width
 * - Adds graceful background and safe area padding
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#f8fafc, #ffffff)]">
      <Navbar />

      {/* Spacer: equal to navbar height to prevent content from hiding under the fixed header */}
      <div className="h-[72px]" aria-hidden="true" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
