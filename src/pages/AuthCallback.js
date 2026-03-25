import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/setup-profile');
      else navigate('/login');
    });
  }, [navigate]);

  return (
    <div style={{ background:'#050505', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>☽</div>
        <div style={{ color:'#C9A84C', fontFamily:'Cinzel,serif', letterSpacing:2 }}>Signing you in...</div>
      </div>
    </div>
  );
}