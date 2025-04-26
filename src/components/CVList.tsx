import React from 'react';
import CVCard from './CVCard';
import { useCV } from '../context/CVContext';
import { FileWarning } from 'lucide-react';

const CVList: React.FC = () => {
  const { cvs } = useCV();
  
  if (cvs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-4 border-dashed border-gray-300 rounded-lg text-center">
        <FileWarning size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No CVs Found</h2>
        <p className="text-gray-600 mb-6">You haven't created any CVs yet. Get started by creating your first CV!</p>
        <a 
          href="/create" 
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] neobrutalism-shadow"
        >
          Create Your First CV
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map(cv => (
        <CVCard key={cv.id} cv={cv} />
      ))}
    </div>
  );
};

export default CVList;