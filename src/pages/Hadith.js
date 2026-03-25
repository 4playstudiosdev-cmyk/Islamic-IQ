/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, ChevronRight, X, BookOpen, List } from 'lucide-react';
import { HADITH_BOOKS, getHadiths, getChapters, getChapterHadiths, searchHadiths } from '../services/hadithApi';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .h-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  .h-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; cursor:pointer; }
  .h-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.4); }
  .h-card.active { border-color:rgba(201,168,76,0.4); background:rgba(201,168,76,0.06); }
  .h-hadith { background:#0F0F0D; border:1px solid rgba(201,168,76,0.08); border-radius:14px; margin-bottom:10px; overflow:hidden; transition:all 0.3s; }
  .h-hadith:hover { border-color:rgba(201,168,76,0.2); }
  .h-hadith.expanded { border-color:rgba(201,168,76,0.3); }
  .h-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .h-input:focus { border-color:rgba(201,168,76,0.4); }
  .h-input::placeholder { color:rgba(242,237,228,0.25); }
  .h-btn { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.15); border-radius:8px; color:#C9A84C; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
  .h-btn:hover { background:rgba(201,168,76,0.15); }
  .h-btn.active { background:rgba(201,168,76,0.2); border-color:rgba(201,168,76,0.4); }
  .gold { color:#C9A84C; }
  .gold2 { color:#E8C97A; }
  .muted { color:rgba(242,237,228,0.4); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer { to{background-position:200% center} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
`;

export default function Hadith() {
  const [book, setBook]           = useState(null);
  const [hadiths, setHadiths]     = useState([]);
  const [chapters, setChapters]   = useState([]);
  const [chapter, setChapter]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [loadMore, setLoadMore]   = useState(false);
  const [page, setPage]           = useState(1);
  const [lastPage, setLastPage]   = useState(1);
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState(null);
  const [viewMode, setViewMode]   = useState('hadiths');
  const [dispLang, setDispLang]   = useState('both');
  const [error, setError]         = useState(null);
  const timer                     = useRef(null);

  useEffect(() => {
    if (!book) return;
    setHadiths([]); setChapters([]); setChapter(null);
    setPage(1); setSearch(''); setExpanded(null);
    setError(null); setViewMode('hadiths');
    load(book.id, 1);
    loadChaps(book.id);
  }, [book]);

  useEffect(() => {
    if (!chapter || !book) return;
    setHadiths([]); setPage(1); setExpanded(null);
    loadChap(book.id, chapter.chapterNumber, 1);
  }, [chapter]);

  const load = async (bookId, pg) => {
    pg === 1 ? setLoading(true) : setLoadMore(true);
    setError(null);
    try {
      const res  = await getHadiths(bookId, pg);
      const data = res.hadiths?.data || res.data || [];
      setHadiths(prev => pg === 1 ? data : [...prev, ...data]);
      setLastPage(res.hadiths?.last_page || 1);
      setTotal(res.hadiths?.total || data.length);
      setPage(pg);
    } catch (e) { setError(e.message || 'Failed to load hadiths'); }
    finally { setLoading(false); setLoadMore(false); }
  };

  const loadChaps = async (bookId) => {
    try {
      const res = await getChapters(bookId);
      setChapters(res.chapters?.data || res.data || []);
    } catch {}
  };

  const loadChap = async (bookId, chNum, pg) => {
    pg === 1 ? setLoading(true) : setLoadMore(true);
    try {
      const res  = await getChapterHadiths(bookId, chNum, pg);
      const data = res.hadiths?.data || res.data || [];
      setHadiths(prev => pg === 1 ? data : [...prev, ...data]);
      setLastPage(res.hadiths?.last_page || 1);
      setPage(pg);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); setLoadMore(false); }
  };

  const onSearch = (q) => {
    setSearch(q);
    clearTimeout(timer.current);
    if (!q.trim()) { load(book.id, 1); return; }
    timer.current = setTimeout(async () => {
      setLoading(true); setError(null);
      try {
        const res  = await searchHadiths(book.id, q, 1);
        const data = res.hadiths?.data || res.data || [];
        setHadiths(data);
        setLastPage(res.hadiths?.last_page || 1);
        setTotal(data.length);
        setPage(1);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }, 600);
  };

  // ── BOOK SELECTION VIEW ──────────────────────────────────────
  if (!book) return (
    <div className="h-root" style={{ padding:'28px 32px' }}>
      <style>{CSS}</style>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:20, padding:'28px 32px', marginBottom:28, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:'radial-gradient(ellipse,rgba(201,168,76,0.06),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:52, height:52, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📚</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>ISLAMIC LIBRARY</div>
            <h1 style={{ fontSize:24, fontWeight:800 }} className="gold-shimmer">Hadith Books</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>Arabic · Urdu · English</p>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {HADITH_BOOKS.map((b, i) => (
          <div key={b.id} className="h-card" onClick={() => setBook(b)}
            style={{ padding:'22px 20px', animation:`fadeUp 0.4s ${i*0.07}s ease both` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:44, height:44, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📖</div>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:6, padding:'3px 8px', fontFamily:'Cinzel,serif', letterSpacing:1 }}>
                {parseInt(b.count).toLocaleString()} Hadiths
              </div>
            </div>
            <div style={{ fontFamily:'Scheherazade New,serif', fontSize:20, color:'#C9A84C', marginBottom:6, direction:'rtl' }}>{b.arabic}</div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:13, fontWeight:600, color:'#E8C97A', marginBottom:3 }}>{b.name}</div>
            <div style={{ fontSize:11, color:'rgba(242,237,228,0.35)' }}>{b.imam}</div>
            <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:4, color:'rgba(201,168,76,0.5)', fontSize:11 }}>
              <span>Read now</span><ChevronRight size={12}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── HADITH READER VIEW ───────────────────────────────────────
  return (
    <div className="h-root" style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <style>{CSS}</style>

      {/* Top bar */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', borderBottom:'1px solid rgba(201,168,76,0.1)', padding:'14px 24px', display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
        <button onClick={() => setBook(null)} className="h-btn" style={{ padding:'8px 14px', fontSize:12, display:'flex', alignItems:'center', gap:6 }}>
          ← Books
        </button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'Scheherazade New,serif', fontSize:16, color:'#C9A84C', direction:'rtl' }}>{book.arabic}</div>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:11, color:'rgba(242,237,228,0.4)', letterSpacing:1 }}>{book.name} · {total.toLocaleString()} Hadiths</div>
        </div>

        {/* Lang buttons */}
        <div style={{ display:'flex', gap:4 }}>
          {[['EN','english'],['UR','urdu'],['Both','both']].map(([l,v]) => (
            <button key={v} className={`h-btn ${dispLang===v?'active':''}`} onClick={() => setDispLang(v)}
              style={{ padding:'6px 10px', fontSize:11, fontWeight:600 }}>{l}</button>
          ))}
        </div>

        {/* View mode */}
        <div style={{ display:'flex', gap:4 }}>
          <button className={`h-btn ${viewMode==='hadiths'?'active':''}`} onClick={() => { setViewMode('hadiths'); setChapter(null); load(book.id,1); }} style={{ padding:'6px 10px', fontSize:11 }}>
            <BookOpen size={13}/>
          </button>
          <button className={`h-btn ${viewMode==='chapters'?'active':''}`} onClick={() => setViewMode('chapters')} style={{ padding:'6px 10px', fontSize:11 }}>
            <List size={13}/>
          </button>
        </div>

        {/* Search */}
        <div style={{ position:'relative', width:200 }}>
          <Search size={12} color="rgba(201,168,76,0.5)" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
          <input className="h-input" value={search} onChange={e => onSearch(e.target.value)}
            placeholder={`Search in ${book.name}...`}
            style={{ width:'100%', padding:'8px 10px 8px 30px', fontSize:12 }}/>
          {search && <button onClick={() => onSearch('')} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(242,237,228,0.3)' }}><X size={12}/></button>}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px' }}>

        {/* Chapters list */}
        {viewMode === 'chapters' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10, marginBottom:16 }}>
            {chapters.map(c => (
              <div key={c.id} className="h-card" onClick={() => { setChapter(c); setViewMode('hadiths'); }}
                style={{ padding:'14px 16px' }}>
                <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', marginBottom:4 }}>Chapter {c.chapterNumber}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(242,237,228,0.8)', lineHeight:1.5 }}>{c.chapterEnglish}</div>
                {c.chapterUrdu && <div className="arabic" style={{ fontSize:12, color:'rgba(201,168,76,0.6)', marginTop:4 }}>{c.chapterUrdu}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:12, padding:'16px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>⚠️</span>
            <div>
              <div style={{ fontSize:13, color:'#e74c3c', fontWeight:600 }}>Failed to load</div>
              <div style={{ fontSize:11, color:'rgba(231,76,60,0.7)', marginTop:2 }}>{error}</div>
            </div>
            <button onClick={() => load(book.id,1)} className="h-btn" style={{ marginLeft:'auto', padding:'6px 12px', fontSize:11 }}>Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60, gap:12 }}>
            <Loader size={24} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/>
            <span style={{ color:'rgba(242,237,228,0.4)', fontSize:13 }}>Loading {book.name}...</span>
          </div>
        )}

        {/* Hadiths list */}
        {!loading && hadiths.map((h, i) => {
          const isExp = expanded === h.id;
          return (
            <div key={h.id} className={`h-hadith ${isExp?'expanded':''}`}
              style={{ animation:`fadeUp 0.3s ${Math.min(i*0.02,0.4)}s ease both` }}>
              {/* Header row */}
              <div onClick={() => setExpanded(isExp ? null : h.id)}
                style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                <div style={{ width:36, height:36, flexShrink:0, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:11, fontWeight:700, color:'#C9A84C' }}>
                  {h.hadithNumber}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  {(dispLang === 'english' || dispLang === 'both') && h.hadithEnglish && (
                    <div style={{ fontSize:12, color:'rgba(242,237,228,0.65)', lineHeight:1.6, overflow:'hidden', display:'-webkit-box', WebkitLineClamp: isExp ? 'unset' : 2, WebkitBoxOrient:'vertical' }}>
                      {h.hadithEnglish}
                    </div>
                  )}
                </div>
                <ChevronRight size={14} color="rgba(201,168,76,0.4)" style={{ flexShrink:0, transform: isExp ? 'rotate(90deg)' : 'none', transition:'transform 0.2s' }}/>
              </div>

              {/* Expanded content */}
              {isExp && (
                <div style={{ padding:'0 18px 18px', borderTop:'1px solid rgba(201,168,76,0.08)' }}>
                  {/* Arabic */}
                  {h.hadithArabic && (
                    <div style={{ background:'rgba(201,168,76,0.04)', borderRadius:10, padding:'14px 16px', marginBottom:12, marginTop:12 }}>
                      <div style={{ fontSize:10, color:'rgba(201,168,76,0.4)', letterSpacing:1, marginBottom:8 }}>ARABIC</div>
                      <div className="arabic" style={{ fontSize:18, color:'#E8C97A', lineHeight:2.2, direction:'rtl' }}>{h.hadithArabic}</div>
                    </div>
                  )}
                  {/* English */}
                  {(dispLang === 'english' || dispLang === 'both') && h.hadithEnglish && (
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:10, color:'rgba(201,168,76,0.4)', letterSpacing:1, marginBottom:6 }}>ENGLISH</div>
                      <div style={{ fontSize:13, color:'rgba(242,237,228,0.7)', lineHeight:1.8, fontStyle:'italic' }}>{h.hadithEnglish}</div>
                    </div>
                  )}
                  {/* Urdu */}
                  {(dispLang === 'urdu' || dispLang === 'both') && h.hadithUrdu && (
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:10, color:'rgba(201,168,76,0.4)', letterSpacing:1, marginBottom:6 }}>URDU</div>
                      <div className="arabic" style={{ fontSize:14, color:'rgba(242,237,228,0.6)', lineHeight:2, direction:'rtl' }}>{h.hadithUrdu}</div>
                    </div>
                  )}
                  {/* Grade */}
                  {h.status && (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:6, padding:'4px 10px', marginTop:4 }}>
                      <span style={{ fontSize:10, color:'rgba(201,168,76,0.6)', letterSpacing:1 }}>GRADE</span>
                      <span style={{ fontSize:11, color:'#C9A84C', fontWeight:600 }}>{h.status}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Load more */}
        {!loading && hadiths.length > 0 && page < lastPage && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <button className="h-btn" onClick={() => chapter ? loadChap(book.id, chapter.chapterNumber, page+1) : load(book.id, page+1)}
              disabled={loadMore} style={{ padding:'11px 28px', fontSize:13, fontWeight:600 }}>
              {loadMore ? <><Loader size={14} style={{ animation:'spin 1s linear infinite', marginRight:6 }}/> Loading...</> : 'Load More'}
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && hadiths.length === 0 && (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📚</div>
            <div style={{ color:'rgba(242,237,228,0.4)', fontSize:13 }}>No hadiths found</div>
          </div>
        )}
      </div>
    </div>
  );
}