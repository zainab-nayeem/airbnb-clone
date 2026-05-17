import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f5c6d4', padding: '0 24px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      
      <Link to="/" style={{ fontSize: '22px', fontWeight: '700', color: '#ff385c', textDecoration: 'none' }}>
        🌸 StayPink
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px', color: '#555' }}>Hi, {user.name}!</span>
            <Link to="/dashboard" style={{ border: '1px solid #f5c6d4', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: '#222', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/add-listing" style={{ background: '#ff385c', color: '#fff', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}>
              + List Property
            </Link>
            <button onClick={handleLogout} style={{ border: '1px solid #f5c6d4', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: '#222', background: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ border: '1px solid #f5c6d4', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: '#222', textDecoration: 'none' }}>
              Log in
            </Link>
            <Link to="/register" style={{ background: '#ff385c', color: '#fff', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}