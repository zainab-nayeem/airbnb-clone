import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('listings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([
      API.get('/listings/my'),
      API.get('/bookings/my')
    ]).then(([l, b]) => {
      setListings(l.data);
      setBookings(b.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await API.delete(`/listings/${id}`);
    setListings(listings.filter(l => l._id !== id));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#717171' }}>Loading...</div>;

  return (
    <div style={{ background: '#ffecf1', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#222' }}>Welcome, {user?.name} 🌸</h1>
            <p style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            style={{ background: '#fff', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', color: '#ff385c', fontWeight: '600', cursor: 'pointer' }}>
            Log out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['listings', 'bookings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 24px', borderRadius: '20px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                background: tab === t ? '#ff385c' : '#fff',
                color: tab === t ? '#fff' : '#717171',
                border: tab === t ? 'none' : '1px solid #f5c6d4' }}>
              {t === 'listings' ? '🏡 My Listings' : '📅 My Bookings'}
            </button>
          ))}
          <button onClick={() => navigate('/add-listing')}
            style={{ marginLeft: 'auto', padding: '10px 24px', borderRadius: '20px', border: 'none', background: '#222', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            + Add Listing
          </button>
        </div>

        {/* Listings Tab */}
        {tab === 'listings' && (
          <div>
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px', border: '1px solid #f5c6d4' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏡</div>
                <p style={{ color: '#717171', fontSize: '15px' }}>You haven't added any listings yet.</p>
                <button onClick={() => navigate('/add-listing')}
                  style={{ marginTop: '16px', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Add your first listing
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {listings.map(l => (
                  <div key={l._id} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #f5c6d4' }}>
                    <div style={{ height: '160px', background: '#ffd6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {l.images?.[0] ? <img src={l.images[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '40px' }}>🏡</span>}
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#222', marginBottom: '4px' }}>{l.title}</div>
                      <div style={{ fontSize: '13px', color: '#717171', marginBottom: '10px' }}>📍 {l.location}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#222', marginBottom: '12px' }}>₹{l.price} / night</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate(`/listings/${l._id}`)}
                          style={{ flex: 1, padding: '8px', background: '#fff0f3', color: '#ff385c', border: '1px solid #f5c6d4', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                          View
                        </button>
                        <button onClick={() => handleDelete(l._id)}
                          style={{ flex: 1, padding: '8px', background: '#fff', color: '#717171', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px', border: '1px solid #f5c6d4' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
                <p style={{ color: '#717171', fontSize: '15px' }}>You haven't made any bookings yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.map(b => (
                  <div key={b._id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f5c6d4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#222', marginBottom: '4px' }}>{b.listing?.title || 'Listing'}</div>
                      <div style={{ fontSize: '13px', color: '#717171' }}>📍 {b.listing?.location}</div>
                      <div style={{ fontSize: '13px', color: '#717171', marginTop: '4px' }}>
                        {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {b.guests} guest{b.guests > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#222' }}>₹{b.totalPrice}</div>
                      <span style={{ fontSize: '12px', background: '#fff0f3', color: '#ff385c', borderRadius: '20px', padding: '4px 10px', fontWeight: '600' }}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}