import React, { useState, ChangeEvent } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface Celebrity {
  id: number;
  name: string;
  dob: string;
  gender: string;
  country: string;
  description: string;
}

interface Props {
  celebrity: Celebrity;
  onDelete: (id: number) => void;
}

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const CelebrityAccordion: React.FC<Props> = ({ celebrity, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...celebrity });
  const [hasChanged, setHasChanged] = useState(false);

  const age = calculateAge(celebrity.dob);

  const handleToggle = () => {
    if (!isEditing) setIsOpen(!isOpen);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
    setHasChanged(true);
  };

  const handleSave = () => {
    if (hasChanged) {
      setIsEditing(false);
      setHasChanged(false);
    }
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={handleToggle}>
        <h2>{celebrity.name}</h2>
        {isOpen ? <FaMinus /> : <FaPlus />}
      </div>
      {isOpen && (
        <div className="accordion-body">
          <p>Age: {age}</p>
          {isEditing ? (
            <>
              <input
                name="gender"
                value={editedData.gender}
                onChange={handleEditChange}
              />
              <input
                name="country"
                value={editedData.country}
                onChange={handleEditChange}
              />
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleEditChange}
              />
              <button onClick={handleSave} disabled={!hasChanged}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p>Gender: {celebrity.gender}</p>
              <p>Country: {celebrity.country}</p>
              <p>Description: {celebrity.description}</p>
              {age >= 18 && <button onClick={() => setIsEditing(true)}>Edit</button>}
              <button onClick={() => onDelete(celebrity.id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CelebrityAccordion;
