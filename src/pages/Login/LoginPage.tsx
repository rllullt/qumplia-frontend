import React from "react";
import { useNavigate } from "react-router-dom";
import BaseNavbar from "@/components/layout/BaseNavbar";
import Navbar from "@/components/layout/Navbar";

interface FormData {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    username: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();  // hook for navigating between pages
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });  // spread operator: ‘...’, generates a list from an object
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // const handleSubmit = async () => {
    e.preventDefault();
    setError(null); // Cleans any previous error message

    console.log('Form data:', formData);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(`${apiUrl}/token/`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Error logging in');
        console.error(errorData);
        return;
      }

      const data: LoginResponse = await response.json();
      // TODO: Store the token securely (using localStorage as example)
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      console.log('Login successful:', data);
      console.log('Local storage:', localStorage);
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Could not connect to the server');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Sign in
        </h2>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              placeholder="Your username"
              className="w-full input input-bordered input-primary"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="Your password"
              className="w-full input input-bordered input-primary"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
