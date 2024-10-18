import React, { useEffect, useState } from "react";

interface Celebrity {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

const CelebrityList: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState<Celebrity[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedCelebrity, setEditedCelebrity] = useState<Celebrity | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/celebrities.json")
      .then((res) => res.json())
      .then((data) => {
        setCelebrities(data);
        setFilteredCelebrities(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = celebrities.filter(
      (celebrity) =>
        celebrity.first.toLowerCase().includes(lowercasedSearch) ||
        celebrity.last.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredCelebrities(filtered);
  }, [search, celebrities]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const toggleDetails = (id: number) => {
    if (editMode !== null && editMode !== id) return;
    setExpandedId(expandedId === id ? null : id);
  };

  const startEditMode = (celebrity: Celebrity) => {
    if (calculateAge(celebrity.dob) < 18) {
      alert("Only adults can be edited.");
      return;
    }
    setEditMode(celebrity.id);
    setEditedCelebrity({ ...celebrity });
    setExpandedId(celebrity.id);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedCelebrity((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedCelebrity(null);
  };

  const saveEdit = () => {
    if (!editedCelebrity) return;

    setCelebrities((prev) =>
      prev.map((c) => (c.id === editedCelebrity.id ? editedCelebrity : c))
    );
    setFilteredCelebrities((prev) =>
      prev.map((c) => (c.id === editedCelebrity.id ? editedCelebrity : c))
    );
    setEditMode(null);
    setEditedCelebrity(null);
  };

  const confirmDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setCelebrities((prev) => prev.filter((c) => c.id !== id));
      setFilteredCelebrities((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEditClick = (e: React.MouseEvent, celebrity: Celebrity) => {
    e.stopPropagation();
    startEditMode(celebrity);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">List View</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search user"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      {filteredCelebrities.map((celebrity) => (
        <div key={celebrity.id} className="border p-4 rounded-lg mb-2">
          <div
            className="cursor-pointer"
            onClick={() => toggleDetails(celebrity.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={celebrity.picture}
                  alt={`${celebrity.first} ${celebrity.last}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h2 className="text-lg font-semibold">
                  {celebrity.first} {celebrity.last}
                </h2>
              </div>
              <span>{expandedId === celebrity.id ? "▲" : "▼"}</span>
            </div>
          </div>

          {expandedId === celebrity.id && (
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              {editMode === celebrity.id ? (
                <div>
                  <div className="flex flex-col mb-4">

                    <div className="flex justify-between w-1/2 mb-2">
                      <strong>First</strong>
                      <strong>Last</strong>
                    </div>


                    <div className="flex gap-3">

                      <input
                        type="text"
                        name="first"
                        value={editedCelebrity?.first || ""}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="border p-2 rounded w-1/3"
                      />

                      <input
                        type="text"
                        name="last"
                        value={editedCelebrity?.last || ""}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="border p-2 rounded w-1/3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex justify-between mb-2">
                      <strong>Age</strong>
                      <strong>Gender</strong>
                      <strong>Country</strong>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="dob"
                        value={editedCelebrity?.dob || ""}
                        onChange={handleInputChange}
                        placeholder="Date of Birth"
                        className="border p-2 rounded w-1/3"
                      />
                      <select
                        name="gender"
                        value={editedCelebrity?.gender || ""}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-1/3"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Rather not say">Rather not say</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="text"
                        name="country"
                        value={editedCelebrity?.country || ""}
                        onChange={handleInputChange}
                        placeholder="Country"
                        className="border p-2 rounded w-1/3"
                      />
                    </div>
                  </div>
                  <strong>Description: <br /></strong>
                  <textarea
                    name="description"
                    value={editedCelebrity?.description || ""}
                    onChange={handleInputChange}
                    className="border p-4 rounded w-full h-40"
                  ></textarea>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-2">
                      <strong>Age</strong>
                      <strong>Gender</strong>
                      <strong>Country</strong>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{calculateAge(celebrity.dob)} Years</span>
                      <span>{celebrity.gender}</span>
                      <span>{celebrity.country}</span>
                    </div>
                  </div>
                  <p className="mt-2">
                    <strong>Description: <br /></strong>
                    {celebrity.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => handleEditClick(e, celebrity)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(celebrity.id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CelebrityList;