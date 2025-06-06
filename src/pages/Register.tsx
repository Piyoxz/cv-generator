import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';

const Register = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API untuk registrasi
      const response = await registerUser(name);
      const userId = response.user.id;

      // Simpan data user ke localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', response.user.name);

      // Update state global melalui onLogin
      onLogin(userId);

      // Tampilkan notifikasi sukses
      toast.success(`Selamat datang, ${response.user.name}! Anda akan dialihkan ke halaman utama.`);

      // Redirect ke halaman utama setelah delay singkat
      setTimeout(() => {
        navigate('/');
      }, 2000); // Delay 2 detik untuk memberikan waktu membaca notifikasi
    } catch (error) {
  console.error('Registration failed:', error);

  // Tampilkan pesan error umum
  let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

  if (error.response) {
    // Jika error berasal dari respons API
    errorMessage = error.response.data?.message || 'Error dari server.';
  } else if (error.request) {
    // Jika tidak ada respons dari server (misalnya, timeout atau jaringan mati)
    errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  } else {
    // Jika error adalah exception JavaScript biasa
    errorMessage = error.message || 'Terjadi kesalahan tidak diketahui.';
  }

  // Tampilkan notifikasi error
  toast.error(errorMessage);
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
