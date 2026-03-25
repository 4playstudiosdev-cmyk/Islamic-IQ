import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  .setup-root { font-family:'Plus Jakarta Sans',sans-serif; background:#050505; color:#F5F0E8; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
  .setup-root::before { content:''; position:fixed; inset:0; background:radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 65%); pointer-events:none; }
  .setup-card { background:linear-gradient(135deg,rgba(20,20,20,0.95),rgba(12,12,12,0.98)); border:1px solid rgba(201,168,76,0.15); border-radius:24px; padding:44px 40px; width:100%; max-width:460px; position:relative; z-index:1; animation:fade-up 0.5s ease; }
  .auth-input { width:100%; padding:13px 16px; background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F5F0E8; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:all 0.3s; }
  .auth-input:focus { border-color:rgba(201,168,76,0.5); }
  .auth-input::placeholder { color:rgba(245,240,232,0.3); }
  .btn-gold-full { width:100%; padding:14px; background:linear-gradient(135deg,#C9A84C,#E8C97A); color:#050505; border:none; border-radius:10px; font-family:'Cinzel',serif; font-size:14px; font-weight:700; letter-spacing:1.5px; cursor:pointer; transition:all 0.3s; }
  .btn-gold-full:hover { transform:translateY(-1px); box-shadow:0 8px 25px rgba(201,168,76,0.35); }
  .btn-gold-full:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .age-btn { flex:1; padding:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.12); border-radius:10px; color:#F5F0E8; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .age-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.5); color:#C9A84C; }
  @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
`;

const AGE_GROUPS = ['Under 13', '13-17', '18-25', '26-35', '36-50', '50+'];

export default function SetupProfile() {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuth();
  const [name, setName]       = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!ageGroup)    { setError('Please select your age group'); return; }
    setLoading(true);
    const { error: err } = await updateProfile({ full_name: name.trim(), age_group: ageGroup });
    if (err) { setError(err.message); setLoading(false); return; }
    navigate('/home');
  };

  return (
    <div className="setup-root">
      <style>{CSS}</style>
      <div className="setup-card">
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:60, height:60, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 14px' }}>☽</div>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:22, fontWeight:700, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:6 }}>
            Welcome to IslamIQ!
          </div>
          <p style={{ fontSize:13, color:'rgba(245,240,232,0.45)', lineHeight:1.6 }}>
            Tell us a little about yourself so we can personalize your experience
          </p>
          {user?.email && (
            <div style={{ marginTop:10, fontSize:12, color:'rgba(201,168,76,0.6)', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:8, padding:'6px 12px', display:'inline-block' }}>
              {user.email}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize:11, color:'rgba(245,240,232,0.4)', letterSpacing:1, display:'block', marginBottom:8 }}>YOUR NAME</label>
            <input className="auth-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" autoFocus/>
          </div>

          {/* Age group */}
          <div>
            <label style={{ fontSize:11, color:'rgba(245,240,232,0.4)', letterSpacing:1, display:'block', marginBottom:10 }}>AGE GROUP</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {AGE_GROUPS.map(ag => (
                <button type="button" key={ag}
                  className={`age-btn ${ageGroup === ag ? 'active' : ''}`}
                  onClick={() => setAgeGroup(ag)}
                >
                  {ag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ fontSize:12, color:'#e74c3c', textAlign:'center', padding:'8px', background:'rgba(231,76,60,0.08)', borderRadius:8 }}>
              {error}
            </div>
          )}

          <button className="btn-gold-full" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'START MY JOURNEY ✦'}
          </button>
        </form>

        {/* Skip */}
        <button onClick={() => navigate('/home')} style={{ width:'100%', marginTop:10, padding:'11px', background:'transparent', border:'none', color:'rgba(245,240,232,0.25)', fontSize:12, cursor:'pointer' }}>
          Skip for now →
        </button>
      </div>
    </div>
  );
}