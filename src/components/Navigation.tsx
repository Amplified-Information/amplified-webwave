import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/f8f959e3-530e-46d3-8306-1cc3ad3cebee.png" 
              alt="Amplified Information" 
              className="h-8 object-contain" 
            />
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={cn(
                "text-gray-700 hover:text-primary transition-colors",
                isActive("/") && "text-primary font-semibold"
              )}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={cn(
                "text-gray-700 hover:text-primary transition-colors",
                isActive("/services") && "text-primary font-semibold"
              )}
            >
              Services
            </Link>
            <Link
              to="/why-us"
              className={cn(
                "text-gray-700 hover:text-primary transition-colors",
                isActive("/why-us") && "text-primary font-semibold"
              )}
            >
              Why Us
            </Link>
            <Link
              to="/demo/overview"
              className={cn(
                "text-gray-700 hover:text-primary transition-colors",
                location.pathname.startsWith("/demo") && "text-primary font-semibold"
              )}
            >
              Demos
            </Link>
            <Link
              to="/contact"
              className={cn(
                "text-gray-700 hover:text-primary transition-colors",
                isActive("/contact") && "text-primary font-semibold"
              )}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};