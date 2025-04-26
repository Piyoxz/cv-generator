import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, RefreshCw } from 'lucide-react';

const Navbar: React.FC = () => {
  const handleReset = () => {
    // Hapus semua data lokal untuk piyo.my.id
    const keys = Object.keys(localStorage);
    const piyoKeys = keys.filter(
      key => key.startsWith('piyo.') || key === 'userId' || key === 'userName'
    );
    piyoKeys.forEach(key => localStorage.removeItem(key));
    window.location.href = '/register';
  };

  return (
    <nav className="bg-white border-b-4 border-black neobrutalism-shadow">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-black text-xl sm:text-2xl tracking-tight"
        >
          <div className="bg-primary text-white p-2 rounded-md neobrutalism-shadow">
            <FileText size={20} />
          </div>
          <span className="hidden sm:block neobrutalism-text">CV Builder</span>
        </Link>

        {/* Actions (Responsive) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          {/* Reset Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
                handleReset();
              }
            }}
            className="bg-error hover:bg-error-dark text-white font-bold py-2 px-4 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] flex items-center gap-2 neobrutalism-shadow"
          >
            <RefreshCw size={16} className="hidden sm:block" />
            <span>Reset Data</span>
          </button>

          {/* Create New CV Button */}
          <Link 
            to="/create" 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] flex items-center gap-2 neobrutalism-shadow"
          >
            <FileText size={16} className="block sm:hidden" />
            <span className="hidden sm:block">Create New CV</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
