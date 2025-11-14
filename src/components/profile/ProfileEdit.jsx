import { useState } from "react";
import { FaUser, FaCamera } from "react-icons/fa";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    website: "",
    bio: "",
    email: "",
    phone: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full px-4 sm:px-8">
      <div className="w-full max-w-2xl relative">
        {/* Submit Button - Placed in Top-Right Corner */}
        <button
          type="submit"
          className="absolute cursor-pointer top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          Update
        </button>

        {/* Profile Picture & Username */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full relative">
            <FaUser className="text-gray-500 text-3xl" />
            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
              <FaCamera className="text-gray-500 text-sm" />
            </button>
          </div>
          <div>
            <p className="font-bold text-lg">Username</p>
            <button className="text-blue-500 text-sm">Change Profile Photo</button>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-600 font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
