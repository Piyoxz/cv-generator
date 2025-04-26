import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getCV } from '../services/api';

const ViewCV: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState<any>(null);
  
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
      
      <div className="bg-white p-8 border-4 border-black rounded-lg neobrutalism-shadow">
        <h1 className="text-4xl font-black mb-6">{cv.fileName || "Untitled CV"}</h1>
        
        {/* Personal Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Informasi Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold">Nama Lengkap</p>
              <p>{cv.personalInfo.namaLengkap || "-"}</p>
            </div>
            <div>
              <p className="font-bold">Email</p>
              <p>{cv.personalInfo.email || "-"}</p>
            </div>
            <div>
              <p className="font-bold">Nomor Telepon</p>
              <p>{cv.personalInfo.nomorHp || "-"}</p>
            </div>
            <div>
              <p className="font-bold">LinkedIn</p>
              <p>{cv.personalInfo.linkedinUrl || "-"}</p>
            </div>
          </div>
        </div>
        
        {/* Objective */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Objektif</h2>
          <div dangerouslySetInnerHTML={{ __html: cv.objective || "-" }} />
        </div>
        
        {/* Education */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pendidikan</h2>
          {cv.educationHistory.length > 0 ? (
            cv.educationHistory.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-bold">{edu.institution}</h3>
                <p>{edu.program} - {edu.educationLevel}</p>
                <p>{edu.startYear} - {edu.currentlyStudying ? "Sekarang" : edu.endYear}</p>
                <div dangerouslySetInnerHTML={{ __html: edu.description || "" }} />
              </div>
            ))
          ) : (
            <p>-</p>
          )}
        </div>
        
        {/* Work Experience */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pengalaman Kerja</h2>
          {cv.workExperience.length > 0 ? (
            cv.workExperience.map((work: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-bold">{work.institution}</h3>
                <p>{work.position} - {work.employeeStatus}</p>
                <p>{work.startDate} - {work.currentlyWorking ? "Sekarang" : work.endDate}</p>
                <div dangerouslySetInnerHTML={{ __html: work.description || "" }} />
              </div>
            ))
          ) : (
            <p>-</p>
          )}
        </div>
        
        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Keahlian</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-bold">Hard Skills</p>
              <p>{cv.skills.hardSkills || "-"}</p>
            </div>
            <div>
              <p className="font-bold">Soft Skills</p>
              <p>{cv.skills.softSkills || "-"}</p>
            </div>
            <div>
              <p className="font-bold">Software Skills</p>
              <p>{cv.skills.softwareSkills || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCV;