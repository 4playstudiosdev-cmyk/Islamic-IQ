import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  .ar * { margin:0;padding:0;box-sizing:border-box; }
  .ar { font-family:'Plus Jakarta Sans',sans-serif;background:#030303;color:#F2EDE4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;position:relative; }
  .ar::before { content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 65% 40%,rgba(201,168,76,0.07) 0%,transparent 60%);pointer-events:none; }
  .ac { background:linear-gradient(135deg,rgba(18,18,16,0.97),rgba(10,10,8,0.98));border:1px solid rgba(201,168,76,0.14);border-radius:22px;padding:40px 38px;width:100%;max-width:400px;position:relative;z-index:1;box-shadow:0 40px 80px rgba(0,0,0,0.7);animation:fadeUp 0.5s ease; }
  .ai { width:100%;padding:13px 15px;background:rgba(255,255,255,0.035);border:1px solid rgba(201,168,76,0.13);border-radius:10px;color:#F2EDE4;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.3s; }
  .ai:focus { border-color:rgba(201,168,76,0.45); }
  .ai::placeholder { color:rgba(242,237,228,0.28); }
  .bg { width:100%;padding:14px;background:linear-gradient(135deg,#C9A84C,#E8C97A);color:#050505;border:none;border-radius:10px;font-family:'Cinzel',serif;font-size:13px;font-weight:700;letter-spacing:1.5px;cursor:pointer;transition:all 0.3s; }
  .bg:hover { transform:translateY(-1px);box-shadow:0 8px 24px rgba(201,168,76,0.32); }
  .bg:disabled { opacity:0.55;cursor:not-allowed;transform:none; }
  .gg { width:100%;padding:13px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.09);border-radius:10px;color:#F2EDE4;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:10px; }
  .gg:hover { border-color:rgba(201,168,76,0.28); }
  .dv { display:flex;align-items:center;gap:10px;margin:14px 0; }
  .dv::before,.dv::after { content:'';flex:1;height:1px;background:rgba(242,237,228,0.07); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
`;

export default function Signup() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const handleGoogle = async () => {
    setGLoading(true); setError('');
    try { await signInWithGoogle(); }
    catch (e) { setError(e.message); setGLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await signUpWithEmail(email, password);
      if (data?.user?.identities?.length === 0) {
        setError('This email is already registered. Please sign in.');
        setLoading(false);
      } else if (data?.session) {
        navigate('/setup-profile');
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (e) {
      setError(e.message || 'Signup failed');
      setLoading(false);
    }
  };

  if (success) return (
    <div className="ar">
      <style>{CSS}</style>
      <div className="ac" style={{textAlign:'center'}}>
        <div style={{fontSize:52,marginBottom:16}}>📧</div>
        <div style={{fontFamily:'Cinzel,serif',fontSize:20,fontWeight:700,color:'#C9A84C',marginBottom:10}}>Check Your Email!</div>
        <p style={{fontSize:13,color:'rgba(242,237,228,0.5)',lineHeight:1.8,marginBottom:8}}>We sent a confirmation link to</p>
        <p style={{fontSize:14,color:'#C9A84C',fontWeight:600,marginBottom:16}}>{email}</p>
        <p style={{fontSize:12,color:'rgba(242,237,228,0.35)',lineHeight:1.7,marginBottom:24}}>Click the link in your email to verify your account. Check spam too!</p>
        <button className="bg" onClick={() => navigate('/login')}>Go to Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="ar">
      <style>{CSS}</style>
      <div className="ac">
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:50,height:50,background:'linear-gradient(135deg,#C9A84C,#E8C97A)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,margin:'0 auto 12px'}}>☽</div>
          <div style={{fontFamily:'Cinzel,serif',fontSize:20,fontWeight:700,background:'linear-gradient(135deg,#C9A84C,#E8C97A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>IslamIQ</div>
          <div style={{fontSize:11,color:'rgba(242,237,228,0.35)',letterSpacing:1.5}}>CREATE ACCOUNT</div>
        </div>

        <button className="gg" onClick={handleGoogle} disabled={gLoading}>
          <svg width="17" height="17" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"/><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" fill="#EA4335"/></svg>
          {gLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div className="dv"><span style={{fontSize:11,color:'rgba(242,237,228,0.22)'}}>or create with email</span></div>

        <form onSubmit={handleSignup} style={{display:'flex',flexDirection:'column',gap:11}}>
          {[
            {label:'EMAIL',    val:email,    set:setEmail,    type:'email',    ph:'your@email.com'},
            {label:'PASSWORD', val:password, set:setPassword, type:'password', ph:'Min 6 characters'},
          ].map(f => (
            <div key={f.label}>
              <label style={{fontSize:10,color:'rgba(242,237,228,0.38)',letterSpacing:1.2,display:'block',marginBottom:6}}>{f.label}</label>
              <input className="ai" type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
            </div>
          ))}
          {error && <div style={{fontSize:12,color:'#e74c3c',textAlign:'center',padding:'8px',background:'rgba(231,76,60,0.07)',borderRadius:8,border:'1px solid rgba(231,76,60,0.15)'}}>{error}</div>}
          <button className="bg" type="submit" disabled={loading} style={{marginTop:4}}>{loading?'Creating...':'CREATE ACCOUNT'}</button>
        </form>

        <button onClick={() => navigate('/home')} style={{width:'100%',padding:'11px',background:'transparent',border:'1px solid rgba(242,237,228,0.05)',borderRadius:10,color:'rgba(242,237,228,0.3)',fontSize:12,cursor:'pointer',marginTop:10}}>
          Continue as Guest →
        </button>

        <div style={{textAlign:'center',marginTop:18,fontSize:12,color:'rgba(242,237,228,0.28)'}}>
          Have account?{' '}<Link to="/login" style={{color:'#C9A84C',textDecoration:'none',fontWeight:600}}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}