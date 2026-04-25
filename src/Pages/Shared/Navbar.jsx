import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingCart, FaSearch, FaChevronDown, FaUserCircle,
  FaSignOutAlt, FaThLarge, FaBars, FaTimes,
  FaHome, FaPills, FaChevronRight, FaPercent
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import UseAuth from '../../hook/UseAuth';
import UseAxiosSecure from '../../hook/UseAxiosSecure';

const LogoIcon = () => (
  <div style={{
    width: 38, height: 38, borderRadius: 11,
    background: 'linear-gradient(135deg, #00e5a0 0%, #00a86b 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 0 18px rgba(0,229,160,0.25)'
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9
        2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1v3h3c.55 0 1 .45 1
        1s-.45 1-1 1h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55
        0-1-.45-1-1s.45-1 1-1h3V7c0-.55.45-1 1-1z"/>
    </svg>
  </div>
);

const Navbar = () => {
  const { logoutUser, user } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled,   setIsScrolled]   = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');

  const dropdownRef = useRef(null);
  const searchRef   = useRef(null);

  const { data: cart = [] } = useQuery({
    queryKey: ['carts', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/carts?userEmail=${user.email}`);
      return res.data;
    },
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shopPage?search=${searchQuery.trim()}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home',              path: '/',         icon: <FaHome size={13} /> },
    { name: 'All Medicine',      path: '/shopPage', icon: <FaPills size={13} /> },
    { name: 'Discount Products', path: '/shopPage', icon: <FaPercent size={13} /> },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
        background: isScrolled ? 'rgba(8,13,26,0.88)' : '#08131e',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid rgba(0,229,160,0.08)',
        transition: 'all 0.4s ease',
        boxShadow: isScrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* Accent bottom line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,229,160,0.4), transparent)',
        }} />

        <div style={{
          maxWidth: 1440, margin: '0 auto',
          padding: '0 16px',   /* safe padding on all screen sizes */
          height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8,
        }}>

          {/* ── LOGO ── */}
          <motion.div
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          >
            <LogoIcon />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17,
                color: '#f0f4ff', letterSpacing: '-0.4px',
              }}>
                MediCore
              </div>
              <div className="hidden sm:block" style={{
                fontSize: 9, fontWeight: 600, color: '#00e5a0',
                letterSpacing: '2.5px', textTransform: 'uppercase',
              }}>
                Pharmacy Suite
              </div>
            </div>
          </motion.div>

          {/* ── DESKTOP CENTER — nav links ONLY, NO search bar ── */}
          <div
            className="hidden lg:flex items-center justify-center flex-1"
            style={{ gap: 4 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: 4,
            }}>
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <motion.div
                      whileTap={{ scale: 0.96 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 10,
                        fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                        color: isActive ? '#00e5a0' : 'rgba(240,244,255,0.55)',
                        background: isActive ? 'rgba(0,229,160,0.08)' : 'transparent',
                        border: `1px ${isActive ? 'rgba(0,229,160,0.18)' : 'transparent'}`,
                        transition: 'all 0.2s', cursor: 'pointer',
                      }}
                    >
                      <span style={{ opacity: isActive ? 1 : 0.6 }}>{link.icon}</span>
                      {link.name}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

            {/* Search icon — ALL screen sizes, opens overlay */}
            <IconButton onClick={() => setSearchOpen(true)} title="Search">
              <FaSearch size={14} />
            </IconButton>

            {/* Cart */}
            <Link to="/myCart" style={{ textDecoration: 'none' }}>
              <IconButton style={{ position: 'relative' }} title="Cart">
                <FaShoppingCart size={15} />
                <AnimatePresence>
                  {cart?.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: -5, right: -5,
                        background: '#00e5a0', color: '#08131e',
                        fontSize: 9, fontWeight: 900,
                        width: 18, height: 18, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #08131e',
                      }}
                    >
                      {cart.length > 9 ? '9+' : cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </IconButton>
            </Link>

            {/* Auth */}
            {!user ? (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'linear-gradient(135deg, #00e5a0, #00a86b)',
                    color: '#050d1a', fontWeight: 800,
                    fontSize: 12, padding: '10px 20px',
                    borderRadius: 12, border: 'none',
                    cursor: 'pointer', letterSpacing: '0.5px',
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 20px rgba(0,229,160,0.25)',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  Login
                </motion.button>
              </Link>
            ) : (
              <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 50, padding: '4px 12px 4px 4px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,229,160,0.3)' }}>
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=00e5a0&color=050d1a`}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span className="hidden sm:block" style={{
                    fontSize: 13, fontWeight: 600, color: '#f0f4ff',
                    maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.displayName?.split(' ')[0]}
                  </span>
                  <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FaChevronDown size={10} color="rgba(240,244,255,0.4)" />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                        background: '#0d1828', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 18, padding: 8, width: 240,
                        boxShadow: '0 24px 60px rgba(0,0,0,0.6)', zIndex: 200,
                      }}
                    >
                      <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 6 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#00e5a0', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 3 }}>Authenticated</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName}</div>
                        <div style={{ fontSize: 11, color: 'rgba(240,244,255,0.4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                      </div>

                      {[
                        { to: '/dashboard',     icon: <FaThLarge size={13} />,    label: 'Dashboard Console' },
                        { to: '/updateProfile', icon: <FaUserCircle size={13} />, label: 'Profile Settings' },
                      ].map((item) => (
                        <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>
                          <div style={ddItemStyle(false)}>
                            <span style={{ opacity: 0.7 }}>{item.icon}</span>
                            {item.label}
                            <FaChevronRight size={9} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                          </div>
                        </Link>
                      ))}

                      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 0' }} />
                      <button
                        onClick={() => { logoutUser(); setDropdownOpen(false); }}
                        style={{ ...ddItemStyle(true), width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <FaSignOutAlt size={13} /> End Session
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger — mobile/tablet only */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex lg:hidden"
              style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(240,244,255,0.7)', flexShrink: 0,
              }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><FaTimes size={15} /></motion.div>
                  : <motion.div key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><FaBars size={15} /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          SEARCH OVERLAY — works on ALL screen sizes
          Desktop: click 🔍 icon → this opens
          Mobile: click 🔍 icon → this opens
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Dim backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 996, background: 'rgba(0,0,0,0.55)' }}
            />

            {/* Search bar panel */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'fixed', top: 68, left: 0, right: 0, zIndex: 997,
                background: '#0a1424',
                borderBottom: '1px solid rgba(0,229,160,0.12)',
                padding: '16px 20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <form onSubmit={handleSearch} style={{
                display: 'flex', gap: 10,
                maxWidth: 680, margin: '0 auto',  /* centered on wide screens */
              }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <FaSearch size={14} style={{
                    position: 'absolute', left: 16, top: '50%',
                    transform: 'translateY(-50%)', color: 'rgba(0,229,160,0.5)',
                  }} />
                  <input
                    ref={searchRef}
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicines, brands, generics..."
                    style={{
                      width: '100%', height: 50,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(0,229,160,0.35)',
                      borderRadius: 14, paddingLeft: 48, paddingRight: 16,
                      color: '#f0f4ff', fontSize: 15,
                      fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  style={{
                    padding: '0 24px', height: 50, borderRadius: 14,
                    background: 'linear-gradient(135deg, #00e5a0, #00a86b)',
                    color: '#050d1a', fontWeight: 800, fontSize: 13,
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  Search
                </motion.button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{
                    width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(240,244,255,0.5)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FaTimes size={14} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          MOBILE SLIDE DRAWER
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(300px, 85vw)',
                zIndex: 999, background: '#0a1424',
                borderLeft: '1px solid rgba(0,229,160,0.1)', overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <LogoIcon />
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#f0f4ff' }}>MediCore</div>
                    <div style={{ fontSize: 9, color: '#00e5a0', letterSpacing: '2px', textTransform: 'uppercase' }}>Pharmacy Suite</div>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(240,244,255,0.6)' }}>
                  <FaTimes size={13} />
                </motion.button>
              </div>

              {/* Drawer search */}
              <div style={{ padding: '16px 20px' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                  <FaSearch size={13} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,244,255,0.3)' }} />
                  <input
                    type="text" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicines..."
                    style={{ width: '100%', height: 42, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, paddingLeft: 40, paddingRight: 14, color: '#f0f4ff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                  />
                </form>
              </div>

              {/* Nav links */}
              <div style={{ padding: '0 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(240,244,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 8px 10px' }}>Navigation</div>
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <NavLink to={link.path} style={{ textDecoration: 'none' }}>
                      {({ isActive }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 12, marginBottom: 4, background: isActive ? 'rgba(0,229,160,0.08)' : 'transparent', color: isActive ? '#00e5a0' : 'rgba(240,244,255,0.6)', fontWeight: 600, fontSize: 14, border: `1px solid ${isActive ? 'rgba(0,229,160,0.15)' : 'transparent'}`, transition: 'all 0.15s' }}>
                          <span style={{ opacity: isActive ? 1 : 0.6 }}>{link.icon}</span>
                          {link.name}
                          <FaChevronRight size={10} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                        </div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* User section */}
              {user && (
                <div style={{ padding: '16px 12px' }}>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(240,244,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 8px 10px' }}>Account</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,229,160,0.3)', flexShrink: 0 }}>
                      <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=00e5a0&color=050d1a`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName}</div>
                      <div style={{ fontSize: 11, color: 'rgba(240,244,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                    </div>
                  </div>
                  {[
                    { to: '/dashboard',     icon: <FaThLarge size={12} />,    label: 'Dashboard' },
                    { to: '/updateProfile', icon: <FaUserCircle size={12} />, label: 'Profile Settings' },
                  ].map((item) => (
                    <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, color: 'rgba(240,244,255,0.6)', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                        <span style={{ opacity: 0.6 }}>{item.icon}</span>{item.label}
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => { logoutUser(); setMobileOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, width: '100%', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.15)', color: '#ff4d6d', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}
                  >
                    <FaSignOutAlt size={12} /> End Session
                  </button>
                </div>
              )}

              {!user && (
                <div style={{ padding: '16px 20px' }}>
                  <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                    <button style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #00e5a0, #00a86b)', color: '#050d1a', fontWeight: 800, fontSize: 14, borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Login →
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: 68 }} />
    </>
  );
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

const IconButton = ({ children, className = '', style = {}, ...props }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    className={className}
    style={{
      width: 40, height: 40, borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'rgba(240,244,255,0.6)',
      transition: 'all 0.2s', flexShrink: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </motion.button>
);

const ddItemStyle = (danger) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 14px', borderRadius: 11, marginBottom: 2,
  color: danger ? '#ff4d6d' : 'rgba(240,244,255,0.6)',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
  transition: 'all 0.15s', textDecoration: 'none',
});

export default Navbar;