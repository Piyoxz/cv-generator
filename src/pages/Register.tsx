import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await registerUser(name);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userName', response.user.name);
      onLogin(userId);
      window.location.href = '/';
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 border-4 border-black rounded-lg neobrutalism-shadow">
          <h1 className="text-4xl font-black mb-6 neobrutalism-text">Selamat Datang!</h1>
          <p className="text-gray-600 mb-8">Masukkan nama Anda untuk memulai membuat CV.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] neobrutalism-shadow disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Mulai'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
