import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('nexhire_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { credentials: 'include' });
    localStorage.removeItem('nexhire_user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0f3460' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">NexHire</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
  <Link className="nav-link" to="/browse">Browse Freelancers</Link>
</li>
<li className="nav-item">
  <a className="nav-link" href="/compare.html" target="_blank">
  Compare
</a>
</li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm ms-2" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;