import axios from 'axios';

const API_URL = 'https://piyo.my.id';

export const registerUser = async (name: string) => {
  const id = Math.random().toString(36).substr(2, 9);
  const response = await axios.post(`${API_URL}/add_user`, {
    id,
    name
  });
  return response.data;
};

export const addCV = async (userId: string, name: string) => {
  const id = Math.random().toString(36).substr(2, 9);
  const response = await axios.post(`${API_URL}/add_cv`, {
    id,
    userId,
    name
  });
  return response.data;
};

export const updateCV = async (id: string, data: any) => {
  const response = await axios.post(`${API_URL}/update_cv`, {
    id,
    data
  });
  return response.data;
};

export const getCV = async (id: string) => {
  const response = await axios.get(`${API_URL}/get_cv/${id}`);
  return response.data;
};

export const getCVs = async (userId: string) => {
  const response = await axios.get(`${API_URL}/get_cvs?userId=${userId}`);
  return response.data;
};

export const generateCV = async (cvData: any) => {
  const response = await axios.post(`${API_URL}/generate_cv`, {
    cvData
  });
  return response.data;
};

export const apiDeleteCV = async (id: string) => {
  await axios.delete(`${API_URL}/delete_cv/${id}`);
}

export const getPositions = async () => {
  const response = await axios.get(`${API_URL}/positions`);
  return response.data;
};

export const getPositionPhrases = async (position: string) => {
  const response = await axios.get(`${API_URL}/position_phrases?position=${position}`);
  return response.data;
};
