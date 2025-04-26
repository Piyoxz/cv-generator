import React, { useState, useEffect } from "react";
import { Save, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import ReactQuill from "react-quill";
import { getPositions, getPositionPhrases } from "../services/api";
import "react-quill/dist/quill.snow.css";

interface CVFormProps {
  initialData?: any;
  onSubmit: (formData: any) => void;
  onChange?: (formData: any) => void;
  cvId?: string | null;
}

const CVForm: React.FC<CVFormProps> = ({
  initialData,
  onSubmit,
  onChange,
  cvId,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      personalInfo: {
        namaLengkap: "",
        email: "",
        nomorHp: "",
        linkedinUrl: "",
        portofolioUrl: "",
        alamat: "",
      },
      objective: "",
      educationHistory: [],
      workExperience: [],
      certifications: [],
      awards: [],
      skills: {
        hardSkills: "",
        softSkills: "",
        softwareSkills: "",
      },
    }
  );

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    education: false,
    experience: false,
    certifications: false,
    awards: false,
    skills: false,
  });

  const [showPhraseSuggestions, setShowPhraseSuggestions] = useState(false);
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      const parseObjective = (htmlString: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const paragraphs = Array.from(doc.querySelectorAll("p")).map((p) =>
          p.textContent?.trim() || ""
        );
        return paragraphs.filter((text) => text.length > 0);
      };

      const objective = initialData.objective;
      if (objective) {
        const parsedPhrases = parseObjective(objective);
        setSelectedPhrases(parsedPhrases);
      }
    }
    loadPositions();
  }, [initialData]);

  const loadPositions = async () => {
    try {
      const response = await getPositions();
      setPositions(response.positions);
    } catch (error) {
      console.error("Failed to load positions:", error);
    }
  };

  const loadPhrases = async (position: string) => {
    try {
      const response = await getPositionPhrases(position);
      setPhrases(response.phrases);
    } catch (error) {
      console.error("Failed to load phrases:", error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePositionSelect = async (position: string) => {
    setSelectedPosition(position);
    await loadPhrases(position);
  };

  const togglePhrase = (phrase: string) => {
    let newObjective = formData.objective;
    const phraseExists = selectedPhrases.includes(phrase);

    if (phraseExists) {
      setSelectedPhrases((prev) => prev.filter((p) => p !== phrase));
      newObjective = newObjective.replace(phrase, "").trim();
    } else {
      setSelectedPhrases((prev) => [...prev, phrase]);
      newObjective = newObjective ? `${newObjective} ${phrase}` : phrase;
    }

    const newFormData = {
      ...formData,
      objective: newObjective,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      const newFormData = {
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      };
      setFormData(newFormData);
      onChange?.(newFormData);
    } else {
      const newFormData = {
        ...formData,
        [name]: value,
      };
      setFormData(newFormData);
      onChange?.(newFormData);
    }
  };

  const handleQuillChange = (value: string, field: string) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const addEducation = () => {
    const newFormData = {
      ...formData,
      educationHistory: [
        ...formData.educationHistory,
        {
          institution: "",
          location: "",
          startYear: "",
          endYear: "",
          educationLevel: "",
          program: "",
          gpa: "",
          maxGpa: "",
          description: "",
          currentlyStudying: false,
        },
      ],
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...formData.educationHistory];
    updatedEducation.splice(index, 1);
    const newFormData = {
      ...formData,
      educationHistory: updatedEducation,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedEducation = [...formData.educationHistory];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    const newFormData = {
      ...formData,
      educationHistory: updatedEducation,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const addWorkExperience = () => {
    const newFormData = {
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          institution: "",
          position: "",
          employeeStatus: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
          currentlyWorking: false,
        },
      ],
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const removeWorkExperience = (index: number) => {
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience.splice(index, 1);
    const newFormData = {
      ...formData,
      workExperience: updatedWorkExperience,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleWorkExperienceChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience[index] = {
      ...updatedWorkExperience[index],
      [field]: value,
    };
    const newFormData = {
      ...formData,
      workExperience: updatedWorkExperience,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const addCertification = () => {
    const newFormData = {
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          name: "",
          issuer: "",
          number: "",
          year: "",
        },
      ],
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    const newFormData = {
      ...formData,
      certifications: updatedCertifications,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleCertificationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };
    const newFormData = {
      ...formData,
      certifications: updatedCertifications,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const addAward = () => {
    const newFormData = {
      ...formData,
      awards: [
        ...formData.awards,
        {
          name: "",
          issuer: "",
          year: "",
        },
      ],
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const removeAward = (index: number) => {
    const updatedAwards = [...formData.awards];
    updatedAwards.splice(index, 1);
    const newFormData = {
      ...formData,
      awards: updatedAwards,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleAwardChange = (index: number, field: string, value: string) => {
    const updatedAwards = [...formData.awards];
    updatedAwards[index] = {
      ...updatedAwards[index],
      [field]: value,
    };
    const newFormData = {
      ...formData,
      awards: updatedAwards,
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div className="bg-white rounded-lg border-4 border-black p-6 neobrutalism-shadow mb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        {/* Basic Info Section */}
        <div className="section-header" onClick={() => toggleSection("basic")}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Informasi Dasar</h2>
            {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {expandedSections.basic && (
          <div className="section-content">
            <div className="space-y-6">

              <div className="form-group">
                <label className="font-bold mb-2 block">Nama Lengkap</label>
                <input
                  type="text"
                  name="personalInfo.namaLengkap"
                  value={formData.personalInfo.namaLengkap}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                  placeholder="Nama lengkap Anda"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="font-bold mb-2 block">Email</label>
                  <input
                    type="email"
                    name="personalInfo.email"
                    value={formData.personalInfo.email}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="font-bold mb-2 block">Nomor Telepon</label>
                  <input
                    type="tel"
                    name="personalInfo.nomorHp"
                    value={formData.personalInfo.nomorHp}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                    placeholder="+62..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="font-bold mb-2 block">URL LinkedIn</label>
                  <input
                    type="url"
                    name="personalInfo.linkedinUrl"
                    value={formData.personalInfo.linkedinUrl}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                    placeholder="https://linkedin.com/in/profil-anda"
                  />
                </div>

                <div className="form-group">
                  <label className="font-bold mb-2 block">URL Portofolio</label>
                  <input
                    type="url"
                    name="personalInfo.portofolioUrl"
                    value={formData.personalInfo.portofolioUrl}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                    placeholder="https://portofolio-anda.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="font-bold mb-2 block">Alamat</label>
                <textarea
                  name="personalInfo.alamat"
                  value={formData.personalInfo.alamat}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                  placeholder="Alamat lengkap Anda"
                  rows={3}
                />
              </div>

              <div className="form-group relative">
                <label className="font-bold mb-2 block">Objektif</label>
                <div className="relative">
                  <ReactQuill
                    value={formData.objective}
                    onChange={(value) => handleQuillChange(value, "objective")}
                    modules={quillModules}
                    className="quill-editor neobrutalism-input"
                    placeholder="Deskripsikan tujuan karir Anda"
                  />
                  <div
                    className={`phrase-indicator ${
                      showPhraseSuggestions ? "active" : ""
                    }`}
                    onClick={() =>
                      setShowPhraseSuggestions(!showPhraseSuggestions)
                    }
                    title="Rekomendasi Frasa"
                  >
                    <Lightbulb size={16} />
                  </div>

                  {showPhraseSuggestions && (
                    <div className="phrase-suggestions">
                      <h3 className="font-bold mb-3">Rekomendasi Frasa</h3>
                      {!selectedPosition ? (
                        <div>
                          <p className="text-sm mb-2">Pilih Posisi:</p>
                          <div
                            className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto"
                            style={{ maxHeight: "200px" }}
                          >
                            {positions.map((position, index) => (
                              <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => handlePositionSelect(position)}
                              >
                                {position}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <p className="font-medium">{selectedPosition}</p>
                            <button
                              type="button"
                              className="text-sm text-secondary hover:underline"
                              onClick={() => setSelectedPosition(null)}
                            >
                              Ganti Posisi
                            </button>
                          </div>
                          <div
                            className="space-y-2 max-h-[200px] overflow-y-auto"
                            style={{ maxHeight: "200px" }}
                          >
                            {phrases.map((phrase, index) => (
                              <div
                                key={index}
                                className={`suggestion-item ${
                                  selectedPhrases.includes(phrase)
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => togglePhrase(phrase)}
                              >
                                {phrase}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        <div
          className="section-header"
          onClick={() => toggleSection("education")}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Pendidikan</h2>
            {expandedSections.education ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {expandedSections.education && (
          <div className="section-content">
            <div className="space-y-6">
              {formData.educationHistory.map(
                (education: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-black rounded-md bg-accent-light mb-4 neobrutalism-shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">
                        Pendidikan #{index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="bg-error text-white p-2 rounded-md"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="font-bold mb-2 block">
                          Institusi
                        </label>
                        <input
                          type="text"
                          value={education.institution}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="Nama Universitas/Sekolah"
                        />
                      </div>

                      <div className="form-group">
                        <label className="font-bold mb-2 block">Lokasi</label>
                        <input
                          type="text"
                          value={education.location}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="Kota, Negara"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="font-bold mb-2 block">
                          Tingkat Pendidikan
                        </label>
                        <select
                          value={education.educationLevel}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "educationLevel",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                        >
                          <option value="">Pilih Tingkat</option>
                          <option value="SD">SD</option>
                          <option value="SMP">SMP</option>
                          <option value="SMK">SMK</option>
                          <option value="SMA">SMA</option>
                          <option value="D3">D3</option>
                          <option value="D4">D4</option>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="font-bold mb-2 block">Jurusan</label>
                        <input
                          type="text"
                          value={education.program}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "program",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="Teknik Informatika, Ekonomi, dll."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="font-bold mb-2 block">
                          Tahun Mulai
                        </label>
                        <input
                          type="number"
                          value={education.startYear}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "startYear",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="2018"
                          min="1900"
                          max="2100"
                        />
                      </div>

                      <div className="form-group">
                        <label className="font-bold mb-2 block">
                          Tahun Selesai
                        </label>
                        <input
                          type="number"
                          value={education.endYear}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "endYear",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="2022"
                          min="1900"
                          max="2100"
                          disabled={education.currentlyStudying}
                        />

                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={education.currentlyStudying}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "currentlyStudying",
                                  e.target.checked
                                )
                              }
                              className="form-checkbox h-5 w-5 text-primary border-2 border-black rounded"
                            />
                            <span className="ml-2">Masih Disini ?</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="font-bold mb-2 block">Deskripsi</label>
                      <ReactQuill
                        value={education.description}
                        onChange={(value) =>
                          handleEducationChange(index, "description", value)
                        }
                        modules={quillModules}
                        className="quill-editor neobrutalism-input"
                        placeholder="Jelaskan prestasi, proyek, atau mata kuliah relevan"
                      />
                    </div>
                  </div>
                )
              )}

              <button
                type="button"
                onClick={addEducation}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-md neobrutalism-shadow"
              >
                + Tambah Pendidikan
              </button>
            </div>
          </div>
        )}

        {/* Work Experience Section */}
        <div
          className="section-header"
          onClick={() => toggleSection("experience")}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Pengalaman Kerja</h2>
            {expandedSections.experience ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {expandedSections.experience && (
          <div className="section-content">
            <div className="space-y-6">
              {formData.workExperience.map((experience: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border-2 border-black rounded-md bg-secondary-light mb-4 neobrutalism-shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">
                      Pengalaman #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
                      className="bg-error text-white p-2 rounded-md"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="form-group mb-4">
                    <label className="font-bold mb-2 block">
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      value={experience.institution}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                      placeholder="Nama Perusahaan"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="font-bold mb-2 block">Posisi</label>
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                        placeholder="Jabatan"
                      />
                    </div>

                    <div className="form-group">
                      <label className="font-bold mb-2 block">
                        Tipe Pekerjaan
                      </label>
                      <select
                        value={experience.employeeStatus}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "employeeStatus",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                      >
                        <option value="">Pilih Tipe</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Kontrak</option>
                        <option value="Internship">Magang</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="form-group">
                      <label className="font-bold mb-2 block">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        value={experience.startDate}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="font-bold mb-2 block">
                        Tanggal Selesai
                      </label>
                      <input
                        type="date"
                        value={experience.endDate}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                        disabled={experience.currentlyWorking}
                      />

                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={experience.currentlyWorking}
                            onChange={(e) =>
                              handleWorkExperienceChange(
                                index,
                                "currentlyWorking",
                                e.target.checked
                              )
                            }
                            className="form-checkbox h-5 w-5 text-primary border-2 border-black rounded"
                          />
                          <span className="ml-2">Masih Bekerja</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="font-bold mb-2 block">Lokasi</label>
                      <input
                        type="text"
                        value={experience.location}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "location",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                        placeholder="Kota, Negara"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="font-bold mb-2 block">Deskripsi</label>
                    <ReactQuill
                      value={experience.description}
                      onChange={(value) =>
                        handleWorkExperienceChange(index, "description", value)
                      }
                      modules={quillModules}
                      className="quill-editor neobrutalism-input"
                      placeholder="Jelaskan tanggung jawab dan pencapaian Anda"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addWorkExperience}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-md neobrutalism-shadow"
              >
                + Tambah Pengalaman Kerja
              </button>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        <div
          className="section-header"
          onClick={() => toggleSection("certifications")}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Sertifikasi</h2>
            {expandedSections.certifications ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {expandedSections.certifications && (
          <div className="section-content">
            <div className="space-y-6">
              {formData.certifications.map(
                (certification: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-black rounded-md bg-primary-light mb-4 neobrutalism-shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">
                        Sertifikasi #{index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="bg-error text-white p-2 rounded-md"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="font-bold mb-2 block">
                          Nama Sertifikasi
                        </label>
                        <input
                          type="text"
                          value={certification.name}
                          onChange={(e) =>
                            handleCertificationChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="Nama Sertifikasi"
                        />
                      </div>

                      <div className="form-group">
                        <label className="font-bold mb-2 block">Penerbit</label>
                        <input
                          type="text"
                          value={certification.issuer}
                          onChange={(e) =>
                            handleCertificationChange(
                              index,
                              "issuer",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="Nama Penerbit"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="font-bold mb-2 block">
                          Nomor Sertifikat
                        </label>
                        <input
                          type="text"
                          value={certification.number}
                          onChange={(e) =>
                            handleCertificationChange(
                              index,
                              "number",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="Nomor Sertifikat"
                        />
                      </div>

                      <div className="form-group">
                        <label className="font-bold mb-2 block">Tahun</label>
                        <input
                          type="number"
                          value={certification.year}
                          onChange={(e) =>
                            handleCertificationChange(
                              index,
                              "year",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                          placeholder="2024"
                          min="1900"
                          max="2100"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}

              <button
                type="button"
                onClick={addCertification}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-md neobrutalism-shadow"
              >
                + Tambah Sertifikasi
              </button>
            </div>
          </div>
        )}

        {/* Awards Section */}
        <div className="section-header" onClick={() => toggleSection("awards")}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Penghargaan</h2>
            {expandedSections.awards ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {expandedSections.awards && (
          <div className="section-content">
            <div className="space-y-6">
              {formData.awards.map((award: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border-2 border-black rounded-md bg-accent-light mb-4 neobrutalism-shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">
                      Penghargaan #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="bg-error text-white p-2 rounded-md"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="font-bold mb-2 block">
                        Nama Penghargaan
                      </label>
                      <input
                        type="text"
                        value={award.name}
                        onChange={(e) =>
                          handleAwardChange(index, "name", e.target.value)
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                        placeholder="Nama Penghargaan"
                      />
                    </div>

                    <div className="form-group">
                      <label className="font-bold mb-2 block">
                        Pemberi Penghargaan
                      </label>
                      <input
                        type="text"
                        value={award.issuer}
                        onChange={(e) =>
                          handleAwardChange(index, "issuer", e.target.value)
                        }
                        className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                        placeholder="Nama Pemberi"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="font-bold mb-2 block">Tahun</label>
                    <input
                      type="number"
                      value={award.year}
                      onChange={(e) =>
                        handleAwardChange(index, "year", e.target.value)
                      }
                      className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                      placeholder="2024"
                      min="1900"
                      max="2100"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addAward}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-md neobrutalism-shadow"
              >
                + Tambah Penghargaan
              </button>
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div className="section-header" onClick={() => toggleSection("skills")}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Keahlian</h2>
            {expandedSections.skills ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {expandedSections.skills && (
          <div className="section-content">
            <div className="space-y-6">
              <div className="form-group">
                <label className="font-bold mb-2 block">Hard Skills</label>
                <input
                  type="text"
                  name="skills.hardSkills"
                  value={formData.skills.hardSkills}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                  placeholder="Pisahkan dengan koma (contoh: Java, Python, Project Management)"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Kemampuan teknis yang dapat diukur
                </p>
              </div>

              <div className="form-group">
                <label className="font-bold mb-2 block">Soft Skills</label>
                <input
                  type="text"
                  name="skills.softSkills"
                  value={formData.skills.softSkills}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                  placeholder="Pisahkan dengan koma (contoh: Komunikasi, Kerja Tim, Kepemimpinan)"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Kemampuan interpersonal dan perilaku
                </p>
              </div>

              <div className="form-group">
                <label className="font-bold mb-2 block">Software Skills</label>
                <input
                  type="text"
                  name="skills.softwareSkills"
                  value={formData.skills.softwareSkills}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black rounded-md neobrutalism-input"
                  placeholder="Pisahkan dengan koma (contoh: Microsoft Office, Adobe Photoshop, AutoCAD)"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Penguasaan aplikasi perangkat lunak
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t-4 border-black">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-md transform transition-transform hover:translate-y-[-2px] hover:translate-x-[2px] flex items-center justify-center gap-2 neobrutalism-shadow"
          >
            <Save size={20} />
            <span>Simpan CV</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CVForm;
