import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('nexhire_user');
    if (stored) setUser(JSON.parse(stored));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { credentials: 'include' });
    localStorage.removeItem('nexhire_user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{
        backgroundColor: scrolled ? 'rgba(15,52,96,0.98)' : '#0f3460',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.3s ease'
      }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/"
          style={{ fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
          Nex<span style={{ color: '#e94560' }}>Hire</span>
        </Link>

        <button className="navbar-toggler border-0" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/browse">Browse</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3" href="/compare.html" target="_blank">Compare</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3" href="/search.html" target="_blank">Search</a>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item ms-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-white opacity-75">Hi, {user.name?.split(' ')[0]}!</span>
                    <button className="btn btn-sm px-3 py-1 fw-bold"
                      style={{ backgroundColor: '#e94560', border: 'none', borderRadius: '20px', color: 'white' }}
                      onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <li className="nav-item ms-2">
                <Link className="btn btn-sm px-4 py-2 fw-bold"
                  style={{ backgroundColor: '#e94560', border: 'none', borderRadius: '20px', color: 'white' }}
                  to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;