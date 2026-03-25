import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  .ce * { margin:0;padding:0;box-sizing:border-box; }
  .ce { font-family:'Plus Jakarta Sans',sans-serif;background:#030303;color:#F2EDE4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px; }
  .ce::before { content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(201,168,76,0.07) 0%,transparent 65%);pointer-events:none; }
  .card { background:linear-gradient(135deg,rgba(18,18,16,0.97),rgba(10,10,8,0.98));border:1px solid rgba(201,168,76,0.15);border-radius:22px;padding:44px 40px;width:100%;max-width:420px;position:relative;z-index:1;text-align:center;box-shadow:0 40px 80px rgba(0,0,0,0.7); }
  .btn { width:100%;padding:13px;background:linear-gradient(135deg,#C9A84C,#E8C97A);color:#050505;border:none;border-radius:10px;font-family:'Cinzel',serif;font-size:13px;font-weight:700;letter-spacing:1.5px;cursor:pointer;transition:all 0.3s;margin-top:8px; }
  .btn:hover { transform:translateY(-1px);box-shadow:0 8px 24px rgba(201,168,76,0.32); }
  .btn-out { width:100%;padding:12px;background:transparent;border:1px solid rgba(242,237,228,0.07);border-radius:10px;color:rgba(242,237,228,0.35);font-size:12px;cursor:pointer;margin-top:8px;transition:all 0.3s; }
`;

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="ce">
      <style>{CSS}</style>
      <div className="card">
        <div style={{fontSize:52,marginBottom:16}}>📧</div>
        <div style={{fontFamily:'Cinzel,serif',fontSize:20,fontWeight:700,color:'#C9A84C',marginBottom:10,letterSpacing:1}}>
          Confirm Your Email
        </div>
        <p style={{fontSize:13,color:'rgba(242,237,228,0.5)',lineHeight:1.8,marginBottom:6}}>
          We sent a confirmation link to:
        </p>
        <p style={{fontSize:14,color:'#C9A84C',fontWeight:600,marginBottom:16}}>
          {user?.email}
        </p>
        <p style={{fontSize:12,color:'rgba(242,237,228,0.35)',lineHeight:1.7,marginBottom:28}}>
          Please check your inbox and click the confirmation link to activate your account. Also check your spam folder!
        </p>

        {/* Refresh button */}
        <button className="btn" onClick={() => window.location.reload()}>
          I've Confirmed — Open App
        </button>

        <button className="btn-out" onClick={async () => { await signOut(); navigate('/login'); }}>
          Use a different account
        </button>

        <div style={{marginTop:20,fontSize:11,color:'rgba(242,237,228,0.2)',lineHeight:1.6}}>
          Didn't receive the email?{' '}
          <span style={{color:'rgba(201,168,76,0.5)',cursor:'pointer'}} onClick={() => navigate('/signup')}>
            Try signing up again
          </span>
        </div>
      </div>
    </div>
  );
}