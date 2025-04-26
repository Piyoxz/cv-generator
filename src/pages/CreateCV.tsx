import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import CVForm from '../components/CVForm';
import { getCV, generateCV } from '../services/api';
import { ArrowLeft } from 'lucide-react';

const CreateCV: React.FC = () => {
  const navigate = useNavigate();
  const { addCV } = useCV();
  const [step, setStep] = useState<'title' | 'form'>('title');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [cvId, setCvId] = useState<string | null>(null);
  
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
        setCvId(response.cv.id);
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

  const handleSubmit = async (formData: any) => {
    const isConfirmed = window.confirm("Apakah CV sudah benar? Anda akan diarahkan ke halaman utama.");
    if (!isConfirmed) return;
  
    try {
      const response = await generateCV({
        ...formData,
        fileName: title
      });
  
      const downloadUrl = response.path;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = title|| 'generated_cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      navigate('/');
    } catch (error) {
      console.error('Failed to generate CV:', error);
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
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] neobrutalism-shadow disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Lanjutkan'}
              </button>
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
      
      <CVForm cvId={cvId} onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCV;