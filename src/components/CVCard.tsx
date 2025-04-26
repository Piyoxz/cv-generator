import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { CV } from '../types';
import { useCV } from '../context/CVContext';

interface CVCardProps {
  cv: CV;
}

const CVCard: React.FC<CVCardProps> = ({ cv }) => {
  const { deleteCV } = useCV();
  const cardColors = ['bg-accent-light', 'bg-primary-light', 'bg-secondary-light', 'bg-success-light'];
  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this CV?')) {
      deleteCV(cv.id);
    }
  };

  const formatDate = (date: string | number) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`${randomColor} rounded-lg p-6 border-black border-4 neobrutalism-shadow transform hover:translate-y-[-5px] transition-transform duration-200`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-black text-xl truncate">{cv.fileName || "Untitled CV"}</h3>
        <span className="bg-white text-xs font-bold px-2 py-1 rounded-md border-2 border-black">
          {formatDate(cv.updatedAt || cv.createdAt)}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="font-medium truncate">{cv.personalInfo?.namaLengkap || "No name"}</p>
        <p className="text-sm truncate">{cv.personalInfo?.email || "No email"}</p>
      </div>
      
      <div className="flex gap-2 mt-6">
        <Link 
          to={`/view/${cv.id}`} 
          className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-2 flex justify-center items-center rounded-md border-2 border-black"
        >
          <Eye size={16} className="mr-1" /> Preview
        </Link>
        <Link 
          to={`/edit/${cv.id}`} 
          className="flex-1 bg-secondary hover:bg-secondary-dark text-white font-bold py-2 flex justify-center items-center rounded-md border-2 border-black"
        >
          <Edit size={16} className="mr-1" /> Edit
        </Link>
        <button 
          onClick={handleDelete}
          className="flex-1 bg-error hover:bg-error-dark text-white font-bold py-2 flex justify-center items-center rounded-md border-2 border-black"
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default CVCard;