import React, { useState, useEffect } from 'react';
import { useGetUsersQuery, useGetUserQuery } from '../redux/apiSlice';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(value) || user.id.toString().includes(value)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>

      <input
        type="text"
        placeholder="Buscar por ID o Email"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <Link to="/users/create">
        <button>Crear Usuario</button>
      </Link>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><Link to={`/users/edit/${user.id}`}>
                      <button>Editar</button> 
                    </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No se encontraron usuarios</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
  );
};

export default UserList;
