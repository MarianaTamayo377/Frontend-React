import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar datos si estamos editando
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            password: '', // no mostrar la real
          });
        })
        .catch((err) => {
          console.error(err);
          setError('Error al cargar el usuario.');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const url = id
      ? `http://localhost:8000/api/users/${id}`
      : 'http://localhost:8000/api/users';
    const method = id ? 'PUT' : 'POST';

    const dataToSend = {
      name: formData.name,
      email: formData.email,
    };

    if (!id || formData.password.trim() !== '') {
      dataToSend.password = formData.password;
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Error al guardar');
      }

      navigate('/users');
    } catch (err) {
      console.error(err);
      setError('Error al guardar el usuario.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás segura de que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Error al eliminar');
      }

      navigate('/users');
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el usuario.');
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id='name'
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Correo:</label>
          <input
            type="email"
            id='email'
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id='password'
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={id ? '(dejar vacío si no deseas cambiarla)' : ''}
          />
          {id && (
            <small style={{ color: 'gray' }}>
              Deja el campo vacío si no deseas cambiar la contraseña.
            </small>
          )}
        </div>
        <br />
        <button type="submit">{id ? 'Guardar cambios' : 'Crear usuario'}</button>
        {id && (
          <button
            type="button"
            onClick={handleDelete}
            style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
          >
            Eliminar usuario
          </button>
        )}
      </form>
    </div>
  );
};

export default UserForm;
