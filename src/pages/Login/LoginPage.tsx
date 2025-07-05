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

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async () => {
    // e.preventDefault();
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
    <>
      <div className='pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden'>
        <BaseNavbar>
          <Navbar />
        </BaseNavbar>
      </div>
      <div>
        <h2>Iniciar Sesión</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            placeholder="Username"
            className="input input-bordered"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            className="input input-bordered"
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit}>Login</button>
      </div>
    </>
  );
}

export default LoginPage;
