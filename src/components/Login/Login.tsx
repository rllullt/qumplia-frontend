import React, { useState } from 'react';

interface LoginResponse {
  access: string;
  refresh: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Adaptar el manejo de errores según la respuesta de tu API
        setError(errorData.detail || 'Error al iniciar sesión');
        return;
      }

      const data: LoginResponse = await response.json();
      // Almacenar los tokens de forma segura en localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Redirigir al usuario a la página principal o a la que corresponda
      console.log('Inicio de sesión exitoso');
      // Ejemplo de redirección (necesitarás un router como React Router)
      // history.push('/dashboard');
    } catch (error) {
      console.error('Error en la petición de inicio de sesión:', error);
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Sign in</button>
    </div>
  );
};

export default Login;