import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, RefreshCw } from 'lucide-react';

const Navbar: React.FC = () => {
  const handleReset = () => {
  // Konfirmasi pengguna sebelum mereset data
  if (!window.confirm('Are you sure you want to reset all data for piyo.my.id? This action cannot be undone.')) {
    return;
  }

  try {
    // Hapus semua cookies untuk domain piyo.my.id
    const deleteCookiesForDomain = (domain: string) => {
      const cookies = document.cookie.split(";");

      cookies.forEach(cookie => {
        const [name] = cookie.split("=");
        const cookieName = name.trim();

        // Hapus cookie dengan mengatur expired date ke masa lalu
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      });
    };

    // Hapus cookies untuk piyo.my.id
    deleteCookiesForDomain("piyo.my.id");

    // Hapus semua localStorage keys yang terkait dengan piyo.my.id
    const keys = Object.keys(localStorage);
    const piyoKeys = keys.filter(key =>
      key.startsWith('piyo.') ||
      key === 'userId' ||
      key === 'userName'
    );

    piyoKeys.forEach(key => localStorage.removeItem(key));

    // Reload halaman untuk menerapkan perubahan
    window.location.href = '/register';

    // Tampilkan notifikasi sukses
    alert('All data for piyo.my.id has been reset successfully.');
  } catch (error) {
    console.error('Failed to reset data:', error);
    alert('Failed to reset data. Please try again.');
  }
};

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
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
                handleReset();
              }
            }}
            className="bg-error hover:bg-error-dark text-white font-bold py-2 px-4 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] flex items-center gap-2 neobrutalism-shadow"
          >
            <RefreshCw size={16} />
            Reset Data
          </button>
          
          <Link 
            to="/create" 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] flex items-center gap-2 neobrutalism-shadow"
          >
            Create New CV
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
