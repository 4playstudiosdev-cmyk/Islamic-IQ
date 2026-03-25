import React, { useState } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .zk-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .zk-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; outline:none; padding:11px 14px; font-size:14px; width:100%; transition:all 0.3s; }
  .zk-input:focus { border-color:rgba(201,168,76,0.45); background:rgba(201,168,76,0.06); }
  .zk-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; }
`;

const NISAB_GOLD_GRAMS  = 87.48;  // grams
const NISAB_SILVER_GRAMS= 612.36; // grams
const ZAKAT_RATE        = 0.025;  // 2.5%

const CURRENCY_RATES = { PKR: 278, USD: 1, GBP: 0.79, AED: 3.67, SAR: 3.75 };

export default function Zakat() {
  const [currency, setCurrency] = useState('PKR');
  const [goldPrice, setGoldPrice]   = useState('');
  const [silverPrice, setSilverPrice] = useState('');
  const [goldGrams, setGoldGrams]   = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [cash, setCash]             = useState('');
  const [savings, setSavings]       = useState('');
  const [investments, setInvestments] = useState('');
  const [receivables, setReceivables] = useState('');
  const [livestock, setLivestock]   = useState({ camels:0, cows:0, goats:0 });
  const [businessGoods, setBusinessGoods] = useState('');
  const [debts, setDebts]           = useState('');
  const [calculated, setCalculated] = useState(null);

  const n = (v) => parseFloat(v) || 0;

  const calculate = () => {
    const gp = n(goldPrice);
    const sp = n(silverPrice);

    // Nisab values in currency
    const nisabGold   = NISAB_GOLD_GRAMS * gp;
    const nisabSilver = NISAB_SILVER_GRAMS * sp;
    const nisab       = Math.min(nisabGold, nisabSilver); // use lower (Silver nisab usually)

    // Assets
    const goldValue    = n(goldGrams) * gp;
    const silverValue  = n(silverGrams) * sp;
    const cashValue    = n(cash);
    const savingsValue = n(savings);
    const investValue  = n(investments);
    const receivValue  = n(receivables);
    const businessVal  = n(businessGoods);
    const debtsVal     = n(debts);

    // Livestock (simplified)
    const livestockVal = livestock.camels*100000 + livestock.cows*30000 + livestock.goats*15000;

    const totalAssets = goldValue + silverValue + cashValue + savingsValue + investValue + receivValue + businessVal + livestockVal;
    const netWorth    = Math.max(0, totalAssets - debtsVal);
    const zakatDue    = netWorth >= nisab ? netWorth * ZAKAT_RATE : 0;

    setCalculated({
      totalAssets, netWorth, nisab, nisabGold, nisabSilver,
      zakatDue, eligible: netWorth >= nisab,
      breakdown: { goldValue, silverValue, cashValue, savingsValue, investValue, receivValue, businessVal, livestockVal, debtsVal }
    });
  };

  const fmt = (v) => v ? v.toLocaleString('en-US', { maximumFractionDigits:0 }) : '0';

  return (
    <div className="zk-root" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🕋</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>ISLAMIC FINANCE</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Zakat Calculator</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>2.5% on wealth held for one lunar year (Hawl)</p>
          </div>
          {/* Currency */}
          <div style={{ marginLeft:'auto' }}>
            <select value={currency} onChange={e=>setCurrency(e.target.value)}
              style={{ padding:'9px 14px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, color:'#C9A84C', fontFamily:'inherit', fontSize:13, outline:'none', cursor:'pointer' }}>
              {Object.keys(CURRENCY_RATES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

        {/* Gold & Silver */}
        <div className="zk-card" style={{ padding:'20px', animation:'fadeUp 0.4s ease' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>GOLD & SILVER</div>
          {[
            {label:`Gold price per gram (${currency})`,val:goldPrice,set:setGoldPrice,ph:'e.g. 22000'},
            {label:'Gold you own (grams)',val:goldGrams,set:setGoldGrams,ph:'e.g. 50'},
            {label:`Silver price per gram (${currency})`,val:silverPrice,set:setSilverPrice,ph:'e.g. 280'},
            {label:'Silver you own (grams)',val:silverGrams,set:setSilverGrams,ph:'e.g. 200'},
          ].map(f => (
            <div key={f.label} style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:5 }}>{f.label}</div>
              <input className="zk-input" type="number" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
            </div>
          ))}
        </div>

        {/* Cash & Savings */}
        <div className="zk-card" style={{ padding:'20px', animation:'fadeUp 0.4s 0.07s ease both' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>CASH & SAVINGS</div>
          {[
            {label:`Cash in hand (${currency})`,val:cash,set:setCash,ph:'e.g. 50000'},
            {label:`Bank savings (${currency})`,val:savings,set:setSavings,ph:'e.g. 100000'},
            {label:`Investments (${currency})`,val:investments,set:setInvestments,ph:'e.g. 200000'},
            {label:`Money owed to you (${currency})`,val:receivables,set:setReceivables,ph:'e.g. 25000'},
          ].map(f => (
            <div key={f.label} style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:5 }}>{f.label}</div>
              <input className="zk-input" type="number" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
            </div>
          ))}
        </div>

        {/* Business & Livestock */}
        <div className="zk-card" style={{ padding:'20px', animation:'fadeUp 0.4s 0.14s ease both' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>BUSINESS & LIVESTOCK</div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:5 }}>Business goods value ({currency})</div>
            <input className="zk-input" type="number" value={businessGoods} onChange={e=>setBusinessGoods(e.target.value)} placeholder="e.g. 500000"/>
          </div>
          <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:8 }}>Livestock count</div>
          {[['camels','🐪'],['cows','🐄'],['goats','🐐']].map(([type,emoji]) => (
            <div key={type} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:18 }}>{emoji}</span>
              <div style={{ fontSize:12, color:'rgba(242,237,228,0.6)', flex:1, textTransform:'capitalize' }}>{type}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <button onClick={() => setLivestock(l => ({...l,[type]:Math.max(0,l[type]-1)}))} style={{ width:28,height:28,borderRadius:7,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',color:'#C9A84C',cursor:'pointer',fontSize:14 }}>-</button>
                <span style={{ width:32,textAlign:'center',fontSize:14,fontWeight:600,color:'#C9A84C' }}>{livestock[type]}</span>
                <button onClick={() => setLivestock(l => ({...l,[type]:l[type]+1}))} style={{ width:28,height:28,borderRadius:7,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',color:'#C9A84C',cursor:'pointer',fontSize:14 }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Debts */}
        <div className="zk-card" style={{ padding:'20px', animation:'fadeUp 0.4s 0.21s ease both' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>LIABILITIES</div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:5 }}>Total debts you owe ({currency})</div>
            <input className="zk-input" type="number" value={debts} onChange={e=>setDebts(e.target.value)} placeholder="e.g. 100000"/>
          </div>
          <div style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:12, padding:'14px', marginTop:14 }}>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.5)', lineHeight:1.7 }}>
              <strong style={{ color:'#C9A84C' }}>Nisab:</strong> Minimum wealth to be eligible for Zakat.<br/>
              Currently ~{NISAB_GOLD_GRAMS}g gold or ~{NISAB_SILVER_GRAMS}g silver.
            </div>
          </div>
          {/* Calculate button */}
          <button onClick={calculate}
            style={{ width:'100%', marginTop:16, padding:'14px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:12, color:'#050505', fontFamily:'Cinzel,serif', fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:1 }}>
            Calculate Zakat
          </button>
        </div>
      </div>

      {/* Result */}
      {calculated && (
        <div style={{ background: calculated.eligible?'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05))':'rgba(231,76,60,0.06)', border:`1px solid ${calculated.eligible?'rgba(201,168,76,0.3)':'rgba(231,76,60,0.2)'}`, borderRadius:20, padding:'28px', animation:'fadeUp 0.4s ease' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>{calculated.eligible ? '✅' : '❌'}</div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color: calculated.eligible?'#C9A84C':'#e74c3c', marginBottom:4 }}>
              {calculated.eligible ? 'Zakat is Due' : 'Not Eligible'}
            </div>
            <div style={{ fontSize:13, color:'rgba(242,237,228,0.5)' }}>
              {calculated.eligible ? 'Your wealth exceeds Nisab threshold' : `Your net worth (${fmt(calculated.netWorth)} ${currency}) is below Nisab (${fmt(calculated.nisab)} ${currency})`}
            </div>
          </div>

          {calculated.eligible && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:20 }}>
              {[
                { label:'Total Assets',   val:calculated.totalAssets, color:'#C9A84C' },
                { label:'Less Debts',     val:calculated.breakdown.debtsVal, color:'#e74c3c' },
                { label:'Net Wealth',     val:calculated.netWorth, color:'#E8C97A' },
                { label:'Zakat Due (2.5%)',val:calculated.zakatDue, color:'#2ecc71' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(0,0,0,0.3)', borderRadius:12, padding:'14px', textAlign:'center' }}>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', letterSpacing:1, marginBottom:6 }}>{s.label.toUpperCase()}</div>
                  <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color:s.color }}>{fmt(s.val)}</div>
                  <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)' }}>{currency}</div>
                </div>
              ))}
            </div>
          )}

          {/* Zakat due big display */}
          {calculated.eligible && (
            <div style={{ textAlign:'center', background:'rgba(46,204,113,0.1)', border:'1px solid rgba(46,204,113,0.3)', borderRadius:16, padding:'20px' }}>
              <div style={{ fontSize:12, color:'rgba(46,204,113,0.7)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:6 }}>YOUR ZAKAT THIS YEAR</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:36, fontWeight:900, color:'#2ecc71' }}>
                {currency} {fmt(calculated.zakatDue)}
              </div>
              <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:6 }}>May Allah accept your Zakat and increase your wealth. Ameen 🤲</div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop:16, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.7)', marginBottom:6 }}>وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ</div>
        <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>"Establish prayer and give Zakat." — Quran 2:43</div>
      </div>
    </div>
  );
}