import React, { createContext, useContext, useState, useEffect } from 'react';
import { CV } from '../types';
import { addCV as apiAddCV, updateCV as apiUpdateCV, getCVs, apiDeleteCV } from '../services/api';

interface CVContextType {
  cvs: CV[];
  addCV: (userId: string, title: string) => Promise<any>;
  updateCV: (id: string, cv: CV) => Promise<any>;
  deleteCV: (id: string) => void;
  apiDeleteCV: (id: string) => Promise<any>;
  getCVById: (id: string) => CV | undefined;
  loadCVs: () => Promise<void>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvs, setCVs] = useState<CV[]>([]);
  
  const loadCVs = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const response = await getCVs(userId);
        setCVs(response.cvs);
      } catch (error) {
        console.error('Failed to load CVs:', error);
      }
    }
  };
  
  useEffect(() => {
    loadCVs();
  }, []);
  
  const addCV = async (userId: string, title: string) => {
    try {
      const response = await apiAddCV(userId, title);
      await loadCVs(); 
      return response;
    } catch (error) {
      console.error('Failed to add CV:', error);
      throw error;
    }
  };
  
  const updateCV = async (id: string, updatedCV: CV) => {
    try {
      const response = await apiUpdateCV(id, updatedCV);
      await loadCVs();
      return response;
    } catch (error) {
      console.error('Failed to update CV:', error);
      throw error;
    }
  };
  
  const deleteCV = async (id: string) => {
    try {
      await apiDeleteCV(id);
      setCVs((prevCVs) => prevCVs.filter((cv) => cv.id !== id));
    } catch (error) {
      console.error('Failed to delete CV:', error);
    }
  };
  
  const getCVById = (id: string) => {
    return cvs.find((cv) => cv.id === id);
  };
  
  return (
    <CVContext.Provider
      value={{
        cvs,
        addCV,
        updateCV,
        deleteCV,
        getCVById,
        loadCVs,
        apiDeleteCV,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};