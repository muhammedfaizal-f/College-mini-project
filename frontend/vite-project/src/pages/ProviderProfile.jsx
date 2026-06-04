// src/pages/ProviderProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { providerAPI, bookingAPI, reviewAPI } from '../api/services';
import './ProviderProfile.css';

export default function ProviderProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [provider, setProvider] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [imgError, setImgError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  // Fetch provider data
  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      // Get provider profile
      const providerRes = await providerAPI.getMyProfile();
      setProvider(providerRes.data.provider);
      setForm(providerRes.data.provider);

      // Get dashboard stats
      const dashboardRes = await providerAPI.getDashboard();
      setDashboard(dashboardRes.data.stats);

      // Get recent bookings
      const bookingsRes = await bookingAPI.getProviderList({ limit: 10 });
      
      // Get reviews
      const reviewsRes = await reviewAPI.getProviderReviews(providerRes.data.provider._id, { limit: 10 });
      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updateData = {
        bio: form.bio,
        category: form.category,
        skills: form.skills,
        experience: form.experience,
        hourlyRate: form.hourlyRate,
        location: form.location,
        isAvailable: form.isAvailable,
        availableDays: form.availableDays,
        workingHours: form.workingHours,
        responseTime: form.responseTime,
        profilePhoto: form.profilePhoto,
      };
      const res = await providerAPI.updateMyProfile(updateData);
      setProvider(res.data.provider);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await providerAPI.toggleAvailability();
      setProvider(prev => ({ ...prev, isAvailable: res.data.isAvailable }));
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const initials = user?.name?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'P';

  if (loading && !provider) {
    return (
      <div className="provider-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="provider-root">
      {/* NAVBAR */}
      <nav className="provider-nav">
        <div className="provider-logo" onClick={() => navigate("/")}>
          Serve<span>Now</span>
        </div>
        <div className="nav-divider" />
        <button className="provider-back" onClick={() => navigate("/")}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Home
        </button>
        <span className="provider-nav-title">/ Provider Dashboard</span>
        <div className="provider-nav-right">
          <button className="provider-logout" onClick={() => { logout(); navigate("/login"); }}>
            <svg viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="provider-hero">
        <div className="hero-blur hb1" />
        <div className="hero-blur hb2" />
        
        <div className="provider-hero-inner">
          {/* Avatar */}
          <div className="provider-avatar-wrap">
            <div className="provider-avatar-ring">
              <div className="provider-avatar-inner">
                {provider?.profilePhoto && !imgError ? (
                  <img src={provider.profilePhoto} alt={user?.name} onError={() => setImgError(true)} />
                ) : (
                  <span className="provider-avatar-initials">{initials}</span>
                )}
              </div>
            </div>
            <div className={`provider-status ${provider?.isAvailable ? 'online' : 'offline'}`} />
          </div>

          {/* Info */}
          <div className="provider-hero-info">
            <h1 className="provider-name">{user?.name}</h1>
            <div className="provider-badge-row">
              <span className="provider-category-badge">{provider?.category}</span>
              <span className="provider-rating-badge">⭐ {provider?.averageRating || 0} ({provider?.totalReviews || 0} reviews)</span>
            </div>
            <p className="provider-bio">{provider?.bio || "No bio added yet"}</p>
            <div className="provider-tags">
              <span className="provider-tag">💼 {provider?.totalJobsDone || 0} jobs done</span>
              <span className="provider-tag">⏱ {provider?.responseTime || "~15 mins"} response</span>
              <span className="provider-tag">📅 {provider?.experience || 0} years exp</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="provider-hero-actions">
            <button 
              className={`availability-btn ${provider?.isAvailable ? 'available' : 'unavailable'}`}
              onClick={toggleAvailability}
            >
              {provider?.isAvailable ? '✅ Available' : '⛔ Unavailable'}
            </button>
            <button className="edit-profile-btn" onClick={() => setEditMode(!editMode)}>
              ✏️ {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="provider-stats-grid">
          <div className="provider-stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">₹{dashboard?.totalEarnings?.toLocaleString() || 0}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
          <div className="provider-stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{dashboard?.pendingBookings || 0}</div>
            <div className="stat-label">Pending Bookings</div>
          </div>
          <div className="provider-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{dashboard?.completedBookings || 0}</div>
            <div className="stat-label">Completed Jobs</div>
          </div>
          <div className="provider-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{dashboard?.totalBookings || 0}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="provider-tabs">
        {['overview', 'bookings', 'reviews', 'settings'].map(tab => (
          <button 
            key={tab} 
            className={`provider-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'bookings' && '📅 Bookings'}
            {tab === 'reviews' && '⭐ Reviews'}
            {tab === 'settings' && '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="provider-content">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="overview-container">
            {/* Skills & Pricing */}
            <div className="info-grid">
              <div className="info-card">
                <h3>🛠️ Skills & Services</h3>
                <div className="skills-list">
                  {provider?.skills?.length > 0 ? provider.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  )) : <p className="no-data">No skills added yet</p>}
                </div>
              </div>
              <div className="info-card">
                <h3>💰 Pricing</h3>
                <div className="pricing-info">
                  <span className="hourly-rate">₹{provider?.hourlyRate || 0}/hour</span>
                </div>
              </div>
              <div className="info-card">
                <h3>📍 Location</h3>
                <div className="location-info">
                  <p>{provider?.location?.address || 'No address'}</p>
                  <p>{provider?.location?.city}, {provider?.location?.state} - {provider?.location?.pincode}</p>
                </div>
              </div>
              <div className="info-card">
                <h3>⏰ Availability</h3>
                <div className="availability-info">
                  <p>Days: {provider?.availableDays?.join(', ') || 'Not set'}</p>
                  <p>Hours: {provider?.workingHours?.start} - {provider?.workingHours?.end}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="bookings-container">
            <h3>Recent Bookings</h3>
            {dashboard?.recentBookings?.length > 0 ? (
              <div className="bookings-list">
                {dashboard.recentBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-info">
                      <div className="booking-service">{booking.service?.title}</div>
                      <div className="booking-user">Customer: {booking.user?.name}</div>
                      <div className="booking-date">Date: {new Date(booking.bookingDate).toLocaleDateString()}</div>
                    </div>
                    <div className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No bookings yet</p>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="reviews-container">
            <div className="reviews-summary">
              <div className="avg-rating">
                <span className="rating-number">{provider?.averageRating || 0}</span>
                <span className="rating-stars">⭐</span>
                <span className="rating-count">({provider?.totalReviews || 0} reviews)</span>
              </div>
            </div>
            <div className="reviews-list">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-name">{review.user?.name}</div>
                    <div className="review-rating">⭐ {review.rating}</div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              )) : (
                <p className="no-data">No reviews yet</p>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="settings-container">
            <div className="settings-form">
              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  value={form.bio || ''} 
                  onChange={e => setForm({...form, bio: e.target.value})}
                  disabled={!editMode}
                  placeholder="Tell customers about yourself..."
                  rows={4}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={form.category || ''} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    disabled={!editMode}
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Painting">Painting</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="Pet Care">Pet Care</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Hourly Rate (₹)</label>
                  <input 
                    type="number" 
                    value={form.hourlyRate || 0} 
                    onChange={e => setForm({...form, hourlyRate: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={form.skills?.join(', ') || ''} 
                  onChange={e => setForm({...form, skills: e.target.value.split(',').map(s => s.trim())})}
                  disabled={!editMode}
                  placeholder="e.g., Pipe Repair, Leak Fix, Installation"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input 
                    type="number" 
                    value={form.experience || 0} 
                    onChange={e => setForm({...form, experience: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                
                <div className="form-group">
                  <label>Response Time</label>
                  <input 
                    type="text" 
                    value={form.responseTime || ''} 
                    onChange={e => setForm({...form, responseTime: e.target.value})}
                    disabled={!editMode}
                    placeholder="e.g., ~10 mins"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  value={form.location?.address || ''} 
                  onChange={e => setForm({...form, location: {...form.location, address: e.target.value}})}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={form.location?.city || ''} 
                    onChange={e => setForm({...form, location: {...form.location, city: e.target.value}})}
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    value={form.location?.pincode || ''} 
                    onChange={e => setForm({...form, location: {...form.location, pincode: e.target.value}})}
                    disabled={!editMode}
                  />
                </div>
              </div>
              
              {editMode && (
                <button className="save-btn" onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}