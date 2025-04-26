import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import CVForm from '../components/CVForm';
import { getCV, generateCV } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const CreateCV: React.FC = () => {
  const navigate = useNavigate();
  const { addCV, updateCV } = useCV();
  const [step, setStep] = useState<'title' | 'form'>('title');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [cvId, setCvId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreateCV = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/register');
        return;
      }

      const response = await addCV(userId, title);
      if (response && response.cv) {
        const newCvId = response.cv.id;

        // Simpan ID CV ke localStorage sebagai last_create_cv_id
        localStorage.setItem('last_create_cv_id', newCvId);

        setCvId(newCvId);
        setStep('form');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to create CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSave = useCallback(
    debounce(async (id: string, data: any) => {
      setSaving(true);
      try {
        await updateCV(id, data);
      } catch (error) {
        console.error('Failed to auto-save:', error);
      } finally {
        setSaving(false);
      }
    }, 3000),
    []
  );

  const handleFormChange = (data: any) => {
    if (cvId) {
      debouncedSave(cvId, data);
    }
  };

  const handleSubmit = async (formData: any) => {
    const isConfirmed = window.confirm("Apakah CV sudah benar? Anda akan diarahkan ke halaman utama.");
    if (!isConfirmed) return;

    try {
      const response = await generateCV({
        ...formData,
        fileName: title,
      });

      const downloadUrl = response.path;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = title || 'generated_cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`File CV "${title || 'generated_cv.pdf'}" berhasil diunduh!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Hapus last_create_cv_id dari localStorage setelah CV selesai dibuat
      localStorage.removeItem('last_create_cv_id');

      navigate('/');
    } catch (error) {
      console.error('Failed to generate CV:', error);
      toast.error('Gagal menghasilkan CV. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (step === 'title') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md">
          <form onSubmit={handleCreateCV} className="bg-white p-8 border-4 border-black rounded-lg neobrutalism-shadow">
            <h1 className="text-4xl font-black mb-6 neobrutalism-text">Buat CV Baru</h1>
            <p className="text-gray-600 mb-8">Berikan judul untuk CV Anda.</p>

            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Judul CV</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                  placeholder="Contoh: CV Software Developer"
                  required
                />
              </div>

              {/* Tombol Lanjutkan */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] neobrutalism-shadow disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Lanjutkan'}
              </button>

              {/* Tombol Lanjutkan CV Terakhir */}
              {
  localStorage.getItem('last_create_cv_id') && (
    <button
      type="button"
      onClick={async () => {
        const lastCvId = localStorage.getItem('last_create_cv_id');
        if (lastCvId) {
          try {
            // Periksa apakah CV ada di database
            const response = await axios.get(`/get_cv/${lastCvId}`);
            if (response.status === 200 && response.data.cv) {
              navigate(`/edit/${lastCvId}`);
            } else {
              throw new Error('CV not found');
            }
          } catch (error) {
            console.warn('CV terakhir tidak ditemukan di database. Menghapus dari localStorage.');
            localStorage.removeItem('last_create_cv_id');
          }
        }
      }}
      className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] neobrutalism-shadow"
    >
      Lanjutkan CV Terakhir - ID: {localStorage.getItem('last_create_cv_id')}
    </button>
  )
}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 font-bold hover:underline"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-4xl font-black mb-2 neobrutalism-text">Buat CV Baru</h1>
      <p className="text-gray-600 mb-8">Isi formulir di bawah untuk membuat CV profesional Anda</p>

      <CVForm cvId={cvId} onSubmit={handleSubmit} onChange={handleFormChange} />
    </div>
  );
};

export default CreateCV;
