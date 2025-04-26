import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, RefreshCw } from 'lucide-react';

const Navbar: React.FC = () => {

  return (
    <nav className="bg-white border-b-4 border-black neobrutalism-shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-black text-2xl tracking-tight"
        >
          <div className="bg-primary text-white p-2 rounded-md neobrutalism-shadow">
            <FileText size={24} />
          </div>
          <span className="neobrutalism-text">CV Builder</span>
        </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
