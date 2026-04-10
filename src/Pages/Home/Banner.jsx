import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router';

/* ─── Icon Components (no extra icon library needed) ─── */
const IconSearch = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
  </svg>
);
const IconShield = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
  </svg>
);
const IconTruck = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-4 0H.5A1.5 1.5 0 0 1 0 10.5v-7z" />
  </svg>
);
const IconUser = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z" />
  </svg>
);
const IconClock = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
  </svg>
);
const IconCheck = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm3.78-9.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5z" />
  </svg>
);
const IconCart = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5z" />
  </svg>
);
const IconStar = ({ size = 12, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
    <path d="M6 0l1.4 2.8 3.1.4-2.2 2.2.5 3.1L6 7l-2.8 1.5.5-3.1L1.5 3.2l3.1-.4z" />
  </svg>
);
const IconInfo = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
  </svg>
);
const IconScan = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
  </svg>
);

/* ─── Animated Pharmacy Cross (SVG) ─── */
const PharmacyCross = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="crossGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <rect x="15" y="4" width="10" height="32" rx="5" fill="url(#crossGrad)" />
    <rect x="4" y="15" width="32" height="10" rx="5" fill="url(#crossGrad)" />
  </svg>
);

/* ─── Floating Particle ─── */
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -420], opacity: [0, 0.7, 0.3, 0] }}
    transition={{
      duration: style.duration,
      delay: style.delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

/* ─── Orbit Dot ─── */
const OrbitDot = ({ children, style, animVariant }) => {
  const variants = {
    tl: { y: [0, -5, 0], x: [0, -4, 0] },
    tr: { y: [0, -5, 0], x: [0, 4, 0] },
    bl: { y: [0, 5, 0], x: [0, -4, 0] },
    br: { y: [0, 5, 0], x: [0, 4, 0] },
  };
  return (
    <motion.div
      className="absolute flex items-center justify-center bg-white rounded-full border-2 shadow-md z-10"
      style={{ width: 30, height: 30, borderColor: '#a7f3d0', ...style }}
      animate={animVariant ? variants[animVariant] : {}}
      transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

/* ─── Count-Up Hook ─── */
const useCountUp = (target, duration = 1200, suffix = '') => {
  const [value, setValue] = useState('0');
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const inc = Math.ceil(target / steps);
    const interval = duration / steps;
    const timer = setInterval(() => {
      start = Math.min(start + inc * 2, target);
      if (start >= 1_000_000) setValue(Math.round(start / 1_000_000) + 'M+' + suffix);
      else if (start >= 1000) setValue(Math.round(start / 1000) + 'K+' + suffix);
      else setValue(String(start) + suffix);
      if (start >= target) clearInterval(timer);
    }, interval / 2);
    return () => clearInterval(timer);
  }, [target, duration, suffix]);
  return value;
};

/* ════════════════════════════════════════════
   MAIN BANNER COMPONENT
════════════════════════════════════════════ */
const Banner = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const particlesRef = useRef(null);

  const productCount = useCountUp(50000);
  const customerCount = useCountUp(2000000);

  /* Particles data */
  const particles = Array.from({ length: 24 }, (_, i) => ({
    width: 4 + Math.random() * 8,
    height: 4 + Math.random() * 8,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 20}%`,
    background: ['#10b98130', '#0891b225', '#6ee7b740', '#a5f3fc30', '#fde68a25'][i % 5],
    duration: 6 + Math.random() * 9,
    delay: Math.random() * 7,
  }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) navigate(`/shopPage?search=${searchText.trim()}`);
    else navigate('/shopPage');
  };

  /* Animation variants */
  const fadeDown = { hidden: { opacity: 0, y: -14 }, visible: { opacity: 1, y: 0 } };
  const slideLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
  const slideRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
  const slideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  const spring = { type: 'spring', stiffness: 120, damping: 18 };

  /* Category pills */
  const categories = [
    { label: 'Medicines', emoji: '💊' },
    { label: 'Skincare', emoji: '🧴' },
    { label: 'Vitamins', emoji: '🌿' },
    { label: 'Devices', emoji: '🩺' },
    { label: 'Baby Care', emoji: '🍼' },
    { label: 'Dental', emoji: '🦷' },
  ];

  /* Mini utility cards */
  const miniCards = [
    { icon: <IconShield size={20} color="#059669" />, title: 'Track order', sub: 'Real-time GPS', badge: 'Live', badgeColor: 'bg-emerald-50 text-emerald-800', dot: true },
    { icon: <IconCart size={20} color="#0891b2" />, title: 'Refill reminder', sub: 'Auto-schedule', badge: 'Smart AI', badgeColor: 'bg-blue-50 text-blue-800', dot: false },
    { icon: <IconScan size={20} color="#d97706" />, title: 'Scan Rx', sub: 'Upload photo', badge: 'Instant', badgeColor: 'bg-amber-50 text-amber-800', dot: false },
    { icon: <IconInfo size={20} color="#8b5cf6" />, title: 'Health tips', sub: 'Daily advice', badge: 'Daily', badgeColor: 'bg-purple-50 text-purple-800', dot: false },
  ];

  /* Features */
  const features = [
    { icon: <IconShield size={16} color="#059669" />, bg: 'bg-emerald-50', title: '100% genuine products', sub: 'Sourced direct from manufacturers' },
    { icon: <IconTruck size={16} color="#0891b2" />, bg: 'bg-blue-50', title: '30-min express delivery', sub: 'Live GPS tracking on every order' },
    { icon: <IconUser size={16} color="#d97706" />, bg: 'bg-amber-50', title: 'Free doctor consultation', sub: 'Chat with licensed physicians 24/7' },
  ];

  /* Trust bar items */
  const trustItems = [
    { icon: <IconShield size={13} color="#059669" />, label: 'SSL Secured' },
    { icon: <IconCheck size={13} color="#059669" />, label: 'Licensed Pharmacy' },
    { icon: <IconCheck size={13} color="#059669" />, label: 'DGDA Approved' },
    { icon: <IconCart size={13} color="#059669" />, label: 'Free delivery over ৳500' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-white to-sky-50 min-h-screen overflow-hidden pt-24 md:pt-28">

      {/* ── Animated background mesh ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Grid lines */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.04) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Orbs */}
        {[
          { w: 500, h: 500, t: '-120px', r: '-80px', bg: 'radial-gradient(circle,rgba(187,247,208,0.4),rgba(110,231,183,0.08),transparent 70%)', dur: 9, dx: -30, dy: 25 },
          { w: 360, h: 360, b: '-100px', r: '200px', bg: 'radial-gradient(circle,rgba(165,243,252,0.3),transparent 70%)', dur: 11, dx: 20, dy: -30 },
          { w: 280, h: 280, t: '30%', l: '-60px', bg: 'radial-gradient(circle,rgba(209,250,229,0.4),transparent 70%)', dur: 7, dx: 25, dy: 20 },
          { w: 200, h: 200, t: '10%', l: '35%', bg: 'radial-gradient(circle,rgba(253,230,138,0.18),transparent 70%)', dur: 8, dx: -20, dy: 15 },
        ].map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: o.w, height: o.h, top: o.t, right: o.r, bottom: o.b, left: o.l, background: o.bg }}
            animate={{ x: [0, o.dx, 0], y: [0, o.dy, 0], scale: [1, 1.09, 1] }}
            transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-8">

        {/* ── Top bar ── */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={fadeDown}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 px-4 py-2 rounded-full text-xs font-semibold text-emerald-800 shadow-sm shadow-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            No.1 Online Pharmacy · Bangladesh
          </div>
          {/* Rating badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-amber-200 px-4 py-2 rounded-full text-xs font-semibold text-amber-800 shadow-sm shadow-amber-100">
            <span className="flex gap-0.5">{[...Array(5)].map((_, i) => <IconStar key={i} />)}</span>
            <span className="font-bold text-slate-800 text-sm">4.9</span>
            <span className="text-slate-400">· 50K+ reviews</span>
          </div>
        </motion.div>

        {/* ── Main 2-col grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ══ LEFT PANEL ══ */}
          <motion.div
            className="flex flex-col gap-5"
            variants={slideLeft}
            initial="hidden"
            animate="visible"
            transition={spring}
          >
            {/* Brand tag */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wide w-fit"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <IconStar size={10} color="#059669" />
              Trusted by 2M+ patients
            </motion.div>

            {/* Headline */}
            <div className="space-y-0 leading-none">
              {[
                { text: 'Your Health,', className: 'text-5xl md:text-6xl font-black text-slate-900 tracking-tight' },
                { text: 'Our Priority.', className: 'text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent' },
                { text: 'Delivered Fast.', className: 'text-5xl md:text-6xl font-black tracking-tight', sub: true },
              ].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 * i + 0.3, type: 'spring', stiffness: 120 }}
                >
                  {line.sub ? (
                    <span className="text-5xl md:text-6xl font-black tracking-tight">
                      <span className="text-slate-900">Delivered </span>
                      <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">Fast.</span>
                    </span>
                  ) : (
                    <span className={line.className}>{line.text}</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Subtext */}
            <motion.p
              className="text-slate-500 text-base leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Genuine medicines, vitamins & healthcare products at your doorstep in 30 minutes.
              Licensed pharmacists. 100% authentic. Always.
            </motion.p>

            {/* Search bar */}
            <motion.form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 shadow-lg shadow-slate-100/60 focus-within:border-emerald-500 focus-within:shadow-emerald-100/70 transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, type: 'spring' }}
            >
              <IconSearch size={16} color="#9ca3af" />
              <input
                type="text"
                name="search"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search medicines, vitamins, devices..."
                className="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none font-medium"
              />
              <motion.button
                type="submit"
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition-all duration-200"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                <IconSearch size={13} color="white" />
                Search Now
              </motion.button>
            </motion.form>

            {/* Category pills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.label}
                  onClick={() => navigate(`/shopPage?category=${cat.label.toLowerCase()}`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border-2 border-slate-100 rounded-full text-xs font-semibold text-slate-600 cursor-pointer hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(16,185,129,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.06 }}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
            >
              {[
                { value: productCount, label: 'Products' },
                { value: customerCount, label: 'Customers' },
                { value: '24/7', label: 'Support' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="relative bg-white border-2 border-slate-100 rounded-2xl p-3 text-center overflow-hidden cursor-default group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="text-xl font-black text-emerald-600 leading-none">{s.value}</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15 }}
            >
              <motion.button
                onClick={() => navigate('/shopPage')}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-emerald-200 transition-all duration-200"
                whileHover={{ y: -2, boxShadow: '0 12px 28px rgba(5,150,105,0.38)' }}
                whileTap={{ scale: 0.97 }}
              >
                Shop Now →
              </motion.button>
             
            </motion.div>
          </motion.div>

          {/* ══ RIGHT PANEL ══ */}
          <motion.div
            className="hidden lg:flex flex-col gap-3"
            variants={slideRight}
            initial="hidden"
            animate="visible"
            transition={{ ...spring, delay: 0.2 }}
          >
            {/* ── Visual animation card ── */}
            <div className="relative bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-xl shadow-slate-100/80 overflow-hidden">
              {/* Card glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-70" />
              <div className="absolute -bottom-8 -left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-sky-100 to-transparent opacity-60" />

              {/* Orbit animation stage */}
              <div className="relative flex items-center justify-center h-48 mb-5">

                {/* Outer orbit ring */}
                <motion.div
                  className="absolute w-40 h-40 rounded-full border-2 border-dashed border-emerald-200"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                >
                  <OrbitDot style={{ top: '-15px', left: '50%', transform: 'translateX(-50%)' }}>
                    <IconShield size={14} color="#059669" />
                  </OrbitDot>
                  <OrbitDot style={{ bottom: '-15px', left: '50%', transform: 'translateX(-50%)' }}>
                    <IconTruck size={14} color="#0891b2" />
                  </OrbitDot>
                  <OrbitDot style={{ left: '-15px', top: '50%', transform: 'translateY(-50%)' }}>
                    <IconUser size={14} color="#d97706" />
                  </OrbitDot>
                  <OrbitDot style={{ right: '-15px', top: '50%', transform: 'translateY(-50%)' }}>
                    <IconClock size={14} color="#dc2626" />
                  </OrbitDot>
                </motion.div>

                {/* Inner orbit ring (counter-rotate) */}
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-dashed border-sky-200"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  {[
                    { style: { top: '-12px', left: '50%', transform: 'translateX(-50%)' }, icon: <IconCheck size={12} color="#059669" />, anim: 'tl' },
                    { style: { bottom: '-12px', left: '50%', transform: 'translateX(-50%)' }, icon: <IconCart size={12} color="#0891b2" />, anim: 'br' },
                    { style: { left: '-12px', top: '50%', transform: 'translateY(-50%)' }, icon: <IconScan size={12} color="#f59e0b" />, anim: 'bl' },
                    { style: { right: '-12px', top: '50%', transform: 'translateY(-50%)' }, icon: <IconInfo size={12} color="#8b5cf6" />, anim: 'tr' },
                  ].map((od, i) => (
                    <OrbitDot
                      key={i}
                      style={{ width: 24, height: 24, borderColor: '#bae6fd', ...od.style }}
                      animVariant={od.anim}
                    >
                      {od.icon}
                    </OrbitDot>
                  ))}
                </motion.div>

                {/* Center heartbeat circle */}
                <motion.div
                  className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-emerald-200 shadow-lg z-20"
                  animate={{
                    scale: [1, 1.08, 0.96, 1],
                    boxShadow: [
                      '0 0 0 6px rgba(209,250,229,0.6), 0 0 0 14px rgba(209,250,229,0.2)',
                      '0 0 0 12px rgba(209,250,229,0.4), 0 0 0 22px rgba(209,250,229,0.1)',
                      '0 0 0 4px rgba(209,250,229,0.7), 0 0 0 10px rgba(209,250,229,0.25)',
                      '0 0 0 6px rgba(209,250,229,0.6), 0 0 0 14px rgba(209,250,229,0.2)',
                    ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <PharmacyCross />
                </motion.div>
              </div>

              {/* Feature list */}
              <div className="space-y-2 relative z-10">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-50 hover:translate-x-1 transition-all duration-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center flex-shrink-0`}>
                      {f.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800">{f.title}</div>
                      <div className="text-[10px] text-slate-400">{f.sub}</div>
                    </div>
                    <span className="text-slate-300 text-sm">›</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Mini utility cards ── */}
            <div className="grid grid-cols-2 gap-3">
              {miniCards.map((mc, i) => (
                <motion.div
                  key={mc.title}
                  className="relative bg-white border-2 border-slate-100 rounded-2xl p-3.5 cursor-pointer overflow-hidden group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-250"
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
                  <div className="mb-1.5">{mc.icon}</div>
                  <div className="text-xs font-bold text-slate-800">{mc.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{mc.sub}</div>
                  <div className={`inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${mc.badgeColor}`}>
                    {mc.dot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    )}
                    {mc.badge}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Notification strip ── */}
            <motion.div
              className="flex items-center gap-3 bg-white border-2 border-emerald-100 rounded-2xl px-4 py-3 shadow-md shadow-emerald-50"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.2, type: 'spring', stiffness: 120 }}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconCheck size={18} color="#059669" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-800">Order delivered — Paracetamol 500mg</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Order #MED-2847 · Delivered in 28 mins</div>
              </div>
              <div className="text-[9px] text-slate-400 whitespace-nowrap">Just now</div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Trust bar ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 pt-5 border-t border-slate-100"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.3 }}
        >
          {trustItems.map((t, i) => (
            <React.Fragment key={t.label}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                {t.icon}
                {t.label}
              </div>
              {i < trustItems.length - 1 && (
                <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Banner;