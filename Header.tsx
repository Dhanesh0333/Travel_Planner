import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-xl font-bold text-primary">
              <i className="ri-plane-line mr-2"></i>TripPlanner
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <a className={`flex items-center px-3 py-2 text-sm font-medium ${location === '/' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
              <i className="ri-compass-3-line mr-1"></i> Explore
            </a>
          </Link>
          <Link href="/my-trips">
            <a className={`flex items-center px-3 py-2 text-sm font-medium ${location === '/my-trips' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
              <i className="ri-route-line mr-1"></i> My Trips
            </a>
          </Link>
          <Link href="/destinations">
            <a className={`flex items-center px-3 py-2 text-sm font-medium ${location === '/destinations' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
              <i className="ri-map-pin-line mr-1"></i> Destinations
            </a>
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center">
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-gray-500 hover:text-primary focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-3 border-t border-gray-200">
          <div className="px-2 space-y-1">
            <Link href="/">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}>
                <i className="ri-compass-3-line mr-2"></i> Explore
              </a>
            </Link>
            <Link href="/my-trips">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/my-trips' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}>
                <i className="ri-route-line mr-2"></i> My Trips
              </a>
            </Link>
            <Link href="/destinations">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/destinations' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}>
                <i className="ri-map-pin-line mr-2"></i> Destinations
              </a>
            </Link>
            <div className="pt-2">
              <Button className="w-full" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
