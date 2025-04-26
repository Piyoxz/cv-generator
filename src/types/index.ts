export interface PersonalInfo {
  namaLengkap: string;
  email: string;
  nomorHp: string;
  linkedinUrl: string;
  portofolioUrl: string;
  alamat: string;
}

export interface Education {
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  educationLevel: string;
  program: string;
  gpa: string;
  maxGpa: string;
  description: string;
  currentlyStudying: boolean;
}

export interface WorkExperience {
  institution: string;
  position: string;
  employeeStatus: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  currentlyWorking: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  number: string;
  year: string;
}

export interface Award {
  name: string;
  issuer: string;
  year: string;
}

export interface Skills {
  hardSkills: string;
  softSkills: string;
  softwareSkills: string;
}

export interface CV {
  id: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  objective: string;
  educationHistory: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  awards: Award[];
  skills: Skills;
}