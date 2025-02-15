
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/why-us", label: "Why Us" },
    { path: "/demo/overview", label: "Demos", isDemo: true },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/uploads/f8f959e3-530e-46d3-8306-1cc3ad3cebee.png" 
              alt="Amplified Information" 
              className="h-8 object-contain" 
            />
          </Link>
          
          {isMobile ? (
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <div className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-gray-700 hover:text-primary transition-colors",
                    (item.isDemo ? location.pathname.startsWith("/demo") : isActive(item.path)) && 
                    "text-primary font-semibold"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="container mx-auto px-6 py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block text-gray-700 hover:text-primary transition-colors",
                  (item.isDemo ? location.pathname.startsWith("/demo") : isActive(item.path)) && 
                  "text-primary font-semibold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
