import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const categories = ['All', 'Beach', 'Mountain', 'Cabins', 'City', 'Lakeside', 'Luxury', 'Cottages'];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [category]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.location = search;
      const res = await API.get('/listings', { params });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffecf1' }}>
      
      {/* Search Bar */}
      <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #f5c6d4', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="🔍 Search by location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchListings()}
          style={{ flex: 1, border: '1px solid #f5c6d4', borderRadius: '40px', padding: '10px 20px', fontSize: '14px', outline: 'none' }}
        />
        <button
          onClick={fetchListings}
          style={{ background: '#ff385c', color: '#fff', border: 'none', borderRadius: '40px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
        >
          Search
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ background: '#fff', padding: '0 24px', display: 'flex', gap: '0', overflowX: 'auto', borderBottom: '1px solid #f5c6d4' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: category === cat ? '#ff385c' : '#717171', borderBottom: category === cat ? '2px solid #ff385c' : '2px solid transparent', whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p style={{ color: '#717171' }}>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p style={{ color: '#717171' }}>No listings found. Be the first to add one!</p>
        ) : (
          listings.map(listing => (
            <div
              key={listing._id}
              onClick={() => navigate(`/listings/${listing._id}`)}
              style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #f5c6d4', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: '200px', background: '#ffd6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {listing.images && listing.images[0] ? (
                  <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '48px' }}>🏡</span>
                )}
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{listing.title}</div>
                  <div style={{ fontSize: '13px', color: '#222' }}>⭐ 4.9</div>
                </div>
                <div style={{ fontSize: '13px', color: '#717171', marginTop: '2px' }}>📍 {listing.location}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginTop: '8px' }}>
                  ₹{listing.price} <span style={{ fontWeight: '400', color: '#717171', fontSize: '13px' }}>/ night</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}