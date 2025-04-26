import React from 'react';
import { Link } from 'react-router-dom';
import CVList from '../components/CVList';
import { Plus } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 neobrutalism-text">Your CVs</h1>
          <p className="text-gray-600">Piyo CV Generator</p>
        </div>
        <Link 
          to="/create" 
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] flex items-center gap-2 neobrutalism-shadow"
        >
          <Plus size={20} />
          <span>Create New CV</span>
        </Link>
      </div>
      
      <CVList />
    </div>
  );
};

export default Home;