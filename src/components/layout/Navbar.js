import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/history">Consultation History</Link>
      </li>
      <li>
        <Link to="/">New Consultation</Link>
      </li>
      <li className="nav-user">
        {user && <span>Welcome, {user.name}</span>}
      </li>
      <li>
        <button onClick={handleLogout} className="nav-logout">
          Logout
        </button>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">🏥</span>
          <span className="nav-logo-text">Medical Assistant</span>
        </Link>

        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar; 