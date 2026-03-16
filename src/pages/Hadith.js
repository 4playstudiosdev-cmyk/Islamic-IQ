/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Search, BookMarked, ChevronRight, Loader, X, List } from 'lucide-react';
import { HADITH_BOOKS, getHadiths, getChapters, getChapterHadiths, searchHadiths } from '../services/hadithApi';

export default function Hadith() {
  const [selectedBook, setSelectedBook]     = useState(null);
  const [hadiths, setHadiths]               = useState([]);
  const [chapters, setChapters]             = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading]               = useState(false);
  const [loadingMore, setLoadingMore]       = useState(false);
  const [page, setPage]                     = useState(1);
  const [lastPage, setLastPage]             = useState(1);
  const [total, setTotal]                   = useState(0);
  const [search, setSearch]                 = useState('');
  const [searching, setSearching]           = useState(false);
  const [expanded, setExpanded]             = useState(null);
  const [viewMode, setViewMode]             = useState('hadiths'); // 'hadiths' | 'chapters'
  const [dispLang, setDispLang]             = useState('both');    // 'english' | 'urdu' | 'both'
  const [error, setError]                   = useState(null);
  const searchTimer                         = useRef(null);
  const loaderRef                           = useRef(null);

  // Load when book changes
  useEffect(() => {
    if (!selectedBook) return;
    setHadiths([]); setChapters([]); setSelectedChapter(null);
    setPage(1); setSearch(''); setSearching(false);
    setExpanded(null); setError(null); setViewMode('hadiths');
    loadHadiths(selectedBook.id, 1);
    loadChapters(selectedBook.id);
  }, [selectedBook]);

  // Load when chapter changes
  useEffect(() => {
    if (!selectedChapter || !selectedBook) return;
    setHadiths([]); setPage(1); setExpanded(null);
    loadChapterHadiths(selectedBook.id, selectedChapter.chapterNumber, 1);
  }, [selectedChapter]);

  async function loadHadiths(bookId, pg) {
    if (pg === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await getHadiths(bookId, pg);
      const data = res.hadiths?.data || res.data || [];
      setHadiths(prev => pg === 1 ? data : [...prev, ...data]);
      setLastPage(res.hadiths?.last_page || 1);
      setTotal(res.hadiths?.total || data.length);
      setPage(pg);
    } catch (e) {
      setError('Failed to load. Please add your API key in hadithApi.js');
    } finally {
      setLoading(false); setLoadingMore(false);
    }
  }

  async function loadChapters(bookId) {
    try {
      const res = await getChapters(bookId);
      setChapters(res.chapters?.data || res.data || []);
    } catch {}
  }

  async function loadChapterHadiths(bookId, chNum, pg) {
    if (pg === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await getChapterHadiths(bookId, chNum, pg);
      const data = res.hadiths?.data || [];
      setHadiths(prev => pg === 1 ? data : [...prev, ...data]);
      setLastPage(res.hadiths?.last_page || 1);
      setTotal(res.hadiths?.total || data.length);
      setPage(pg);
    } catch {
      setError('Failed to load chapter hadiths.');
    } finally {
      setLoading(false); setLoadingMore(false);
    }
  }

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && page < lastPage && !loadingMore && !loading && selectedBook) {
        if (selectedChapter) loadChapterHadiths(selectedBook.id, selectedChapter.chapterNumber, page + 1);
        else if (!searching) loadHadiths(selectedBook.id, page + 1);
      }
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [page, lastPage, loadingMore, loading, searching, selectedBook, selectedChapter]);

  // Search
  const handleSearch = (q) => {
    setSearch(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q.trim()) {
      setSearching(false);
      loadHadiths(selectedBook.id, 1);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true); setLoading(true); setSelectedChapter(null);
      try {
        const res = await searchHadiths(selectedBook.id, q, 1);
        const data = res.hadiths?.data || [];
        setHadiths(data);
        setLastPage(res.hadiths?.last_page || 1);
        setTotal(res.hadiths?.total || data.length);
        setPage(1);
      } catch { setError('Search failed.'); }
      finally { setLoading(false); }
    }, 700);
  };

  const book = selectedBook;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 270, borderRight: '1px solid rgba(46,139,87,0.15)', display: 'flex', flexDirection: 'column', background: '#080f0a', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(46,139,87,0.1)' }}>
          <h1 style={{ fontSize: 17, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <BookMarked size={17} color="#D4AF37" /> Hadith Books
          </h1>
          <p style={{ fontSize: 11, color: '#4a6355' }}>Arabic · Urdu · English</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          {HADITH_BOOKS.map(b => {
            const isActive = book?.id === b.id;
            return (
              <button key={b.id} onClick={() => setSelectedBook(b)} style={{ width: '100%', padding: '13px 13px', marginBottom: 7, background: isActive ? `${b.color}18` : 'var(--dark-card)', border: `1px solid ${isActive ? b.color+'44' : 'rgba(46,139,87,0.1)'}`, borderRadius: 13, cursor: 'pointer', textAlign: 'left', borderLeft: `4px solid ${isActive ? b.color : 'transparent'}`, transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = `${b.color}0d`; e.currentTarget.style.borderLeftColor = b.color; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'var(--dark-card)'; e.currentTarget.style.borderLeftColor = 'transparent'; }}}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? 'white' : '#c0d4c8', marginBottom: 2 }}>{b.name}</div>
                    <div className="arabic" style={{ fontSize: 13, color: b.color, marginBottom: 3 }}>{b.arabic}</div>
                    <div style={{ fontSize: 10, color: '#4a6355' }}>{b.count} Hadiths</div>
                  </div>
                  {isActive && <ChevronRight size={13} color={b.color} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!book ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <BookMarked size={50} color="#2E8B57" style={{ marginBottom: 14 }} />
            <p style={{ fontSize: 14, color: '#4a6355', marginBottom: 6 }}>Select a Hadith book</p>
            <p className="arabic" style={{ fontSize: 17, color: '#D4AF37' }}>خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f3d22, #1B6B3A)', padding: '16px 22px', borderBottom: '1px solid rgba(212,175,55,0.15)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div className="arabic" style={{ fontSize: 18, color: '#f5d060', fontWeight: 700 }}>{book.arabic}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{book.name} · {book.imam}</div>
                  {total > 0 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{total.toLocaleString()} Hadiths</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Language selector */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 3 }}>
                    {[{v:'english',l:'EN'},{v:'urdu',l:'اردو'},{v:'both',l:'Both'}].map(({v,l}) => (
                      <button key={v} onClick={() => setDispLang(v)} style={{ background: dispLang === v ? 'rgba(46,139,87,0.45)' : 'transparent', border: 'none', borderRadius: 6, padding: '5px 10px', color: dispLang === v ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11, fontWeight: dispLang === v ? 600 : 400 }}>{l}</button>
                    ))}
                  </div>
                  {/* View mode */}
                  {chapters.length > 0 && (
                    <button onClick={() => setViewMode(viewMode === 'chapters' ? 'hadiths' : 'chapters')} style={{ background: viewMode === 'chapters' ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', color: viewMode === 'chapters' ? '#D4AF37' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <List size={12}/> Chapters
                    </button>
                  )}
                </div>
              </div>

              {/* Chapter breadcrumb */}
              {selectedChapter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <button onClick={() => { setSelectedChapter(null); loadHadiths(book.id, 1); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, padding: '3px 10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11 }}>← All</button>
                  <span style={{ fontSize: 11, color: '#D4AF37', fontWeight: 600 }}>{selectedChapter.chapterEnglish || selectedChapter.chapter_english}</span>
                </div>
              )}

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={12} color="#4a6355" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder={`Search in ${book.name}...`}
                  style={{ width: '100%', padding: '9px 32px 9px 30px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, color: 'white', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
                {search && <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={13}/></button>}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px' }}>
              {error && (
                <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 14, color: '#e74c3c', fontSize: 12 }}>
                  ⚠️ {error}
                  <br/><span style={{ color: '#7a9585', fontSize: 11 }}>Go to hadithApi.js and replace YOUR_KEY_HERE with your key from hadithapi.com</span>
                </div>
              )}

              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10 }}>
                  <Loader size={24} color="#2E8B57" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: '#4a6355', fontSize: 13 }}>Loading {book.name}...</p>
                </div>
              ) : viewMode === 'chapters' && !selectedChapter ? (
                // ── CHAPTERS LIST ──
                <div>
                  <p style={{ fontSize: 12, color: '#4a6355', marginBottom: 14 }}>{chapters.length} chapters in {book.name}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {chapters.map((ch, i) => (
                      <button key={i} onClick={() => { setSelectedChapter(ch); setViewMode('hadiths'); }}
                        style={{ background: 'var(--dark-card)', border: `1px solid ${book.color}22`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', borderLeft: `3px solid ${book.color}`, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${book.color}10`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--dark-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: book.color, fontWeight: 600, marginBottom: 4 }}>Chapter {ch.chapterNumber || ch.chapter_no}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#c0d4c8', marginBottom: 4, lineHeight: 1.4 }}>{ch.chapterEnglish || ch.chapter_english}</div>
                            <div className="arabic" style={{ fontSize: 13, color: '#D4AF37' }}>{ch.chapterUrdu || ch.chapter_urdu || ch.chapterArabic}</div>
                          </div>
                          <ChevronRight size={13} color="#4a6355" style={{ marginTop: 2, flexShrink: 0 }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // ── HADITH LIST ──
                <>
                  {searching && <p style={{ fontSize: 11, color: '#4a6355', marginBottom: 12 }}>Found {total} results for "{search}"</p>}
                  {hadiths.map((h, i) => {
                    const isExp  = expanded === i;
                    const num    = h.hadithNumber || h.hadith_no || h.id;
                    const engText = h.hadithEnglish || h.hadith_english || h.body || '';
                    const urdText = h.hadithUrdu   || h.hadith_urdu   || '';
                    const arabText= h.hadithArabic  || h.hadith_arabic || '';
                    const grade  = h.status || h.grade || '';
                    const gradeColor = grade?.toLowerCase().includes('sahih') ? '#3aad6e' :
                                       grade?.toLowerCase().includes('hasan') ? '#D4AF37' :
                                       grade?.toLowerCase().includes('daif')  ? '#e74c3c' : '#7a9585';
                    return (
                      <div key={`${book.id}-${num}-${i}`} onClick={() => setExpanded(isExp ? null : i)}
                        style={{ background: isExp ? `${book.color}12` : 'var(--dark-card)', border: `1px solid ${isExp ? book.color+'33' : 'rgba(46,139,87,0.08)'}`, borderRadius: 13, padding: '14px 18px', marginBottom: 9, cursor: 'pointer', borderLeft: `3px solid ${isExp ? book.color : 'transparent'}`, transition: 'all 0.2s', animation: 'fadeInUp 0.3s ease forwards', animationDelay: `${Math.min(i*0.01,0.25)}s`, opacity: 0 }}
                      >
                        {/* Top row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <div style={{ minWidth: 42, height: 24, background: `${book.color}22`, border: `1px solid ${book.color}44`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: book.color, padding: '0 6px' }}>#{num}</div>
                          {grade && <span style={{ fontSize: 10, background: `${gradeColor}18`, color: gradeColor, borderRadius: 5, padding: '2px 7px', fontWeight: 600 }}>{grade}</span>}
                          {h.chapter && <span style={{ fontSize: 10, color: '#4a6355', background: 'rgba(255,255,255,0.04)', borderRadius: 5, padding: '2px 7px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{typeof h.chapter === 'object' ? h.chapter.chapterEnglish : h.chapter}</span>}
                          <ChevronRight size={13} color="#4a6355" style={{ transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                        </div>

                        {/* Arabic text */}
                        {arabText && (
                          <div className="arabic" style={{ fontSize: 18, color: '#f5d060', lineHeight: 2, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(46,139,87,0.08)' }}>
                            {arabText}
                          </div>
                        )}

                        {/* English */}
                        {(dispLang === 'english' || dispLang === 'both') && engText && (
                          <div style={{ fontSize: 13, color: isExp ? '#c0d4c8' : '#7a9585', lineHeight: 1.8, fontStyle: 'italic', marginBottom: (dispLang === 'both' && urdText) ? 8 : 0, display: isExp ? 'block' : '-webkit-box', WebkitLineClamp: isExp ? 'unset' : 3, WebkitBoxOrient: 'vertical', overflow: isExp ? 'visible' : 'hidden' }}>
                            "{engText}"
                          </div>
                        )}

                        {/* Urdu */}
                        {(dispLang === 'urdu' || dispLang === 'both') && urdText && (
                          <div className="arabic" style={{ fontSize: 14, color: isExp ? '#c9b8e8' : '#7a6a8a', lineHeight: 2, marginTop: dispLang === 'both' ? 6 : 0, display: isExp ? 'block' : '-webkit-box', WebkitLineClamp: isExp ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: isExp ? 'visible' : 'hidden' }}>
                            {urdText}
                          </div>
                        )}

                        {/* Expanded actions */}
                        {isExp && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${book.color}22`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(`${book.name} #${num}:\n${engText}${urdText ? '\n\n' + urdText : ''}`); }}
                              style={{ background: `${book.color}18`, border: `1px solid ${book.color}33`, borderRadius: 7, padding: '5px 12px', cursor: 'pointer', color: book.color, fontSize: 11, fontWeight: 600 }}>
                              📋 Copy
                            </button>
                            <button onClick={e => { e.stopPropagation(); if (navigator.share) navigator.share({ text: `${book.name} #${num}: "${engText}"` }); }}
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', color: '#7a9585', fontSize: 11 }}>
                              🔗 Share
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Infinite scroll trigger */}
                  <div ref={loaderRef} style={{ padding: '16px 0', textAlign: 'center' }}>
                    {loadingMore && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Loader size={16} color="#2E8B57" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ color: '#4a6355', fontSize: 12 }}>Loading more...</span>
                      </div>
                    )}
                    {!loadingMore && page >= lastPage && hadiths.length > 0 && (
                      <div style={{ color: '#4a6355', fontSize: 12 }}>✅ All {total.toLocaleString()} hadiths loaded</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}