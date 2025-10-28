import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUsers } from '../../services/authService'; // API call for registration

export default function Register({ open, closeModal, openLoginModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userData = { username, password };

    try {
      const response = await createUsers(userData); // expects { userId, username } on success
      if (!response || !response.userId) {
        setError(response?.message || "Registration failed. Please try again.");
      } else {
        // Save user info locally instead of Redux
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("username", response.username || "");

        setUsername("");
        setPassword("");
        if (closeModal) closeModal();
        navigate("/home");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    if (openLoginModal) {
      openLoginModal();
      if (closeModal) closeModal();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 relative">
        <button
          className="absolute top-2 right-2 text-2xl cursor-pointer text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform"
          onClick={closeModal}
        >
          &times;
        </button>

        <h2 className="text-center text-xl font-bold text-gray-900">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full mt-2 p-2 border rounded-md"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full mt-2 p-2 border rounded-md"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </form>

        {/* Login Redirect */}
        <div className="text-center mt-4">
          Already have an account?
          <button onClick={handleSignInClick}>
            <span className="cursor-pointer text-blue-500 hover:text-blue-700"> Log In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
