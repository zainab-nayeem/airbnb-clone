import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function AddListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', location: '', price: '',
    category: 'Beach', guests: 1, amenities: ''
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Beach', 'Mountain', 'City', 'Countryside', 'Lake', 'Desert', 'Cabin', 'Luxury'];

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      setLoading(true);
      setError('');
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach(img => data.append('images', img));
      await API.post('/listings', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff' };
  const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#222', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ background: '#ffecf1', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#222' }}>Add a new listing 🌸</h1>
          <p style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>Fill in the details about your place</p>
        </div>

        {error && (
          <div style={{ background: '#fff0f3', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#ff385c', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #f5c6d4' }}>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Title</label>
            <input type="text" placeholder="Cozy pink villa by the beach" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea placeholder="Describe your place..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} required rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Location</label>
            <input type="text" placeholder="Goa, India" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Price per night (₹)</label>
              <input type="number" placeholder="2500" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max Guests</label>
              <input type="number" min="1" max="20" value={form.guests}
                onChange={e => setForm({ ...form, guests: e.target.value })} required style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={inputStyle}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Amenities (comma separated)</label>
            <input type="text" placeholder="WiFi, Pool, AC, Kitchen" value={form.amenities}
              onChange={e => setForm({ ...form, amenities: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Photos</label>
            <input type="file" accept="image/*" multiple onChange={handleImages}
              style={{ ...inputStyle, padding: '10px' }} />
            {preview.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {preview.map((src, i) => (
                  <img key={i} src={src} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f5c6d4' }} />
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Publishing...' : 'Publish Listing 🌸'}
          </button>
        </form>
      </div>
    </div>
  );
}