import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import CVForm from '../components/CVForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getCV, generateCV } from '../services/api';
import debounce from 'lodash/debounce';

const EditCV: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateCV } = useCV();
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const loadCV = async () => {
      if (id) {
        try {
          const response = await getCV(id);
          setCV(response.cv);
        } catch (error) {
          console.error('Failed to load CV:', error);
          navigate('/');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadCV();
  }, [id]);

  // Debounced auto-save function
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
    }, 5000),
    []
  );

  const handleFormChange = (data: any) => {
    if (id) {
      debouncedSave(id, data);
    }
  };

  const handleSubmit = async (formData: any) => {
    const isConfirmed = window.confirm("Apakah CV sudah benar? Anda akan diarahkan ke halaman utama.");
    if (!isConfirmed) return;
  
    try {
      const response = await generateCV({
        ...formData,
        fileName: cv.fileName
      });
  
      const downloadUrl = response.path;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = cv.fileName || 'generated_cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      navigate('/');
    } catch (error) {
      console.error('Failed to generate CV:', error);
    }
  };
  
  
  
  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  
  if (!cv) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto mb-4 text-error" />
        <h2 className="text-2xl font-bold mb-2">CV Tidak Ditemukan</h2>
        <p className="mb-6">CV yang Anda cari tidak ada atau telah dihapus.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md neobrutalism-shadow"
        >
          Kembali ke Beranda
        </button>
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
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 neobrutalism-text">Edit CV</h1>
          <p className="text-gray-600">Perbarui informasi CV Anda di bawah ini</p>
        </div>
        {saving && (
          <span className="text-sm text-gray-500">Menyimpan perubahan...</span>
        )}
      </div>
      
      <CVForm 
        initialData={cv} 
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        cvId={id}
      />
    </div>
  );
};

export default EditCV;