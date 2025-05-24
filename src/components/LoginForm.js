import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login con:', { email, password });  // <- Aquí

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
          let errorMessage = 'Error al iniciar sesión';
            if (data.errors) {
            errorMessage = Object.values(data.errors).flat().join(' ');
        } 
         else if (data.message) {
          errorMessage = data.message;
        }
        throw new Error(errorMessage)
      }

      // Guardar el token
      localStorage.setItem('token', data.token);

      // Redirigir a la lista de usuarios o al home
      navigate('/users');

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o error del servidor');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default LoginForm;
