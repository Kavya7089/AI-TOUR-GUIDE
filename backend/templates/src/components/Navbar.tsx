import { Compass, Globe2, Hotel, Map, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="h-8 w-8" />
            <span className="font-bold text-xl">TravelGuide</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/hotels" className="flex items-center space-x-1 hover:text-blue-200">
              <Hotel className="h-5 w-5" />
              <span>Hotels</span>
            </Link>
            <Link to="/places" className="flex items-center space-x-1 hover:text-blue-200">
              <Map className="h-5 w-5" />
              <span>Places</span>
            </Link>
            <Link to="/shopping" className="flex items-center space-x-1 hover:text-blue-200">
              <ShoppingBag className="h-5 w-5" />
              <span>Shopping</span>
            </Link>
            <Link to="/translator" className="flex items-center space-x-1 hover:text-blue-200">
              <Globe2 className="h-5 w-5" />
              <span>Translator</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}