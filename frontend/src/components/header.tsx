import { useEffect, useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <header className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="/" className="flex items-center lg:flex-1">
          <span className="text-blue-900 text-2xl font-bold py-4 hover:text-blue-600 transition duration-300">
            CryptoPulse
          </span>
        </a>

        {/* Desktop & Medium Screens Menu */}
        <div className="hidden md:flex space-x-10 ">
          <div className="flex space-x-6 text-md font-medium text-blue-900">
            <a
              href="/crypto"
              className="hover:text-blue-600 transition duration-200"
            >
              Explore Crypto
            </a>
            <a
              href="/alerts"
              className="hover:text-blue-600 transition duration-200"
            >
              Set Alerts
            </a>
            
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-blue-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } bg-gray-100 shadow-lg absolute top-0 left-0 w-full mt-16`}
      >
        <div className="flex flex-col space-y-4 px-6 py-4">
          <a
            href="/crypto"
            className="text-blue-900 font-medium hover:text-blue-600 transition duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Explore Crypto
          </a>

          <a
            href="/alerts"
            className="text-blue-900 font-medium hover:text-blue-600 transition duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Set Alerts
          </a>
          <a
            href="/dashboard"
            className="text-blue-900 font-medium hover:text-blue-600 transition duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </a>
        </div>
      </div>
    </header>
  );
}
