import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [bookingMsg, setBookingMsg] = useState('');
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(res => { setListing(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await API.post('/bookings', { listing: id, ...booking });
      setBookingMsg('🌸 Booking confirmed!');
    } catch (err) {
      setBookingMsg(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#717171' }}>Loading...</div>;
  if (!listing) return <div style={{ textAlign: 'center', padding: '80px', color: '#717171' }}>Listing not found.</div>;

  const nights = booking.checkIn && booking.checkOut
    ? Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;

  return (
    <div style={{ background: '#ffecf1', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Image Gallery */}
      <div style={{ position: 'relative', height: '380px', background: '#ffd6e4', overflow: 'hidden' }}>
        {listing.images && listing.images.length > 0 ? (
          <img src={listing.images[imgIndex]} alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '80px' }}>🏡</div>
        )}
        {listing.images && listing.images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            {listing.images.map((_, i) => (
              <div key={i} onClick={() => setImgIndex(i)}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === imgIndex ? '#ff385c' : '#fff', cursor: 'pointer' }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        
        {/* Left */}
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#222', marginBottom: '8px' }}>{listing.title}</h1>
          <p style={{ fontSize: '15px', color: '#717171', marginBottom: '16px' }}>📍 {listing.location}</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <span style={{ background: '#fff0f3', color: '#ff385c', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '600' }}>{listing.category}</span>
            <span style={{ background: '#fff0f3', color: '#ff385c', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '600' }}>👥 Up to {listing.guests} guests</span>
          </div>
          <div style={{ borderTop: '1px solid #f5c6d4', paddingTop: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#222', marginBottom: '12px' }}>About this place</h2>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7' }}>{listing.description}</p>
          </div>
          {listing.amenities && listing.amenities.length > 0 && (
            <div style={{ borderTop: '1px solid #f5c6d4', marginTop: '24px', paddingTop: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#222', marginBottom: '12px' }}>Amenities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {listing.amenities.map((a, i) => (
                  <span key={i} style={{ background: '#fff', border: '1px solid #f5c6d4', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: '#444' }}>✓ {a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #f5c6d4', height: 'fit-content', position: 'sticky', top: '24px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#222', marginBottom: '4px' }}>
            ₹{listing.price} <span style={{ fontSize: '15px', fontWeight: '400', color: '#717171' }}>/ night</span>
          </div>
          <div style={{ fontSize: '13px', color: '#717171', marginBottom: '20px' }}>⭐ 4.9 · Superhost</div>

          {bookingMsg ? (
            <div style={{ background: '#fff0f3', border: '1px solid #f5c6d4', borderRadius: '12px', padding: '16px', textAlign: 'center', fontSize: '14px', color: '#ff385c', fontWeight: '600' }}>{bookingMsg}</div>
          ) : (
            <form onSubmit={handleBook}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#222', display: 'block', marginBottom: '4px' }}>CHECK-IN</label>
                <input type="date" value={booking.checkIn}
                  onChange={e => setBooking({ ...booking, checkIn: e.target.value })} required
                  style={{ width: '100%', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#222', display: 'block', marginBottom: '4px' }}>CHECK-OUT</label>
                <input type="date" value={booking.checkOut}
                  onChange={e => setBooking({ ...booking, checkOut: e.target.value })} required
                  style={{ width: '100%', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#222', display: 'block', marginBottom: '4px' }}>GUESTS</label>
                <input type="number" min="1" max={listing.guests} value={booking.guests}
                  onChange={e => setBooking({ ...booking, guests: e.target.value })} required
                  style={{ width: '100%', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ borderTop: '1px solid #f5c6d4', paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                  <span>₹{listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>₹{listing.price * nights}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', color: '#222' }}>
                  <span>Total</span>
                  <span>₹{listing.price * nights}</span>
                </div>
              </div>
              <button type="submit"
                style={{ width: '100%', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Reserve
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}