import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;
