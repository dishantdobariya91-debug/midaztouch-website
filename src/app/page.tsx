'use client';
import { useState, useEffect, useRef } from "react";

// ── CHANGE THIS to your ngrok or backend URL ──
const API_URL = "https://indescribable-kaya-tidally.ngrok-free.dev";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80",
  herbs: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
  therapy: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  nature: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=80",
  massage: "https://images.unsplash.com/photo-1519823551278-64ac92734314?w=800&q=80",
  ayurveda: "https://images.unsplash.com/photo-1611068661807-8e1e0998951f?w=1920&q=80",
  wellness: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
  leaf: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80",
  mortar: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80",
};

// ── COLORS: White 60% / Green 40% ──
const C = {
  white: "#FFFFFF", bg: "#FAFBF9", bgAlt: "#F2F5F0", surface: "#FFFFFF",
  green: "#1B6B2A", greenLight: "#2D8C3E", greenPale: "#E8F5E9", greenDark: "#0F4D1A",
  gold: "#B8944A", goldLight: "#D4B06A", goldPale: "#FBF5E9",
  text: "#1A1A1A", textMid: "#4A4A42", textLight: "#7A7A6E",
  border: "#E4E8E0", borderGreen: "#C8DCC8",
  red: "#D64545",
};

export default function MidazTouchWebsite() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", area: "", notes: "" });
  const [formState, setFormState] = useState("idle");
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emData, setEmData] = useState({ name: "", phone: "", pain: 7, desc: "" });
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => { setTimeout(() => setLoaded(true), 1500); }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      sectionsRef.current.forEach((el, i) => {
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.5 && r.bottom > 0) setActiveSection(i);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitAppointment = async () => {
    if (!formData.name || !formData.phone) return alert("Please enter name and phone");
    setFormState("loading");
    try {
      const res = await fetch(API_URL + "/api/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({
          patient_name: formData.name, patient_phone: formData.phone,
          appointment_date: formData.date || new Date().toISOString().split("T")[0],
          appointment_type: "consultation", priority: "green",
          notes: `${formData.area} - ${formData.notes}`,
        }),
      });
      setFormState(res.ok ? "success" : "error");
    } catch { setFormState("error"); }
  };

  const submitEmergency = async () => {
    if (!emData.name || !emData.phone) return alert("Enter name and phone");
    try {
      await fetch(API_URL + "/api/emergency/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({
          patient_name: emData.name, patient_phone: emData.phone,
          pain_level: emData.pain, pain_description: emData.desc,
          priority: emData.pain >= 7 ? "red" : "yellow",
        }),
      });
      setEmergencyOpen(false);
      alert("Emergency submitted! We will call you immediately.");
    } catch { alert("Please call +91 7383127969 directly"); }
  };

  const px = (f: number) => `translateY(${scrollY * f}px)`;

  // ── LOADER ──
  if (!loaded) return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s ease-in-out infinite", boxShadow: `0 12px 40px ${C.green}30` }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, color: C.white }}>M</span>
      </div>
      <div style={{ marginTop: 24, fontSize: 13, color: C.textLight, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Midaz Touch Wellness</div>
      <div style={{ marginTop: 16, width: 180, height: 3, borderRadius: 2, background: C.bgAlt, overflow: "hidden" }}>
        <div style={{ width: "60%", height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, animation: "loadBar 1.2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}} @keyframes loadBar{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`}</style>
    </div>
  );

  const navLinks = ["About", "Therapies", "Journey", "Stories", "Emergency"];

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes heroIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 60 ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrollY > 60 ? "blur(16px)" : "none",
        borderBottom: scrollY > 60 ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 20, color: C.white, fontWeight: 700 }}>M</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: scrollY > 60 ? C.green : C.white, fontWeight: 600, transition: "color 0.4s" }}>Midaz Touch</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map((l, i) => (
            <a key={l} href={`#s${i}`} style={{ color: scrollY > 60 ? (activeSection === i + 1 ? C.green : C.textLight) : "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: 0.5, transition: "color 0.3s" }}>{l}</a>
          ))}
          <a href="#book" style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: C.white, padding: "9px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", boxShadow: `0 4px 15px ${C.green}30` }}>Book Now</a>
        </div>
      </nav>

      {/* ═══ HERO — Only dark section (green bg with image) ═══ */}
      <section ref={el => { sectionsRef.current[0] = el; }} style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "-15%", transform: px(-0.12), backgroundImage: `url(${IMAGES.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.3) saturate(1.2)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.greenDark}90 0%, ${C.green}40 50%, transparent 100%)` }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 820, padding: "0 24px", animation: "heroIn 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 30, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 11, color: C.goldLight, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldLight, animation: "pulse 2s infinite" }} />
            India's First Fenugreek Therapy Platform
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,6.5vw,72px)", lineHeight: 1.1, color: C.white, marginBottom: 22, fontWeight: 700 }}>
            Where <em style={{ color: C.goldLight, fontStyle: "italic" }}>Ancient Healing</em><br />Meets Your Body
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.75 }}>
            Natural fenugreek therapy that restores blood flow, reduces chronic pain, and activates your body's deepest healing.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#book" style={{ padding: "15px 36px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", background: C.white, color: C.green, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>Book Consultation</a>
            <a href="#s1" style={{ padding: "15px 36px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.3)" }}>Explore Therapies</a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, animation: "heroIn 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s both" }}>
            {[["10,000+", "Patients Healed"], ["82%", "Recovery Rate"], ["15+", "Years Experience"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: C.white, fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT — WHITE BG ═══ */}
      <section id="s0" ref={el => { sectionsRef.current[1] = el; }} style={{ padding: "110px 40px", background: C.white }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>What is Midaz Touch</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", color: C.text, lineHeight: 1.2, marginBottom: 22 }}>
              A Healing <em style={{ color: C.green, fontStyle: "italic" }}>Ecosystem</em>,<br />Not Just a Clinic
            </h2>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.85, marginBottom: 18 }}>
              Midaz Touch is powered by <strong style={{ color: C.text }}>MIDAZ ECOSYSTEM</strong> — an AI clinical intelligence platform that tracks every patient from first consultation to full recovery.
            </p>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.85, marginBottom: 32 }}>
              Founded by Saurabh Patel, our philosophy combines fenugreek therapy's electromagnetic healing with modern data intelligence. Every session measures. Every pattern teaches. Every patient benefits.
            </p>
            <div style={{ display: "flex", gap: 28 }}>
              {[["100+", "Patients/Day"], ["7+", "Therapists"], ["AI", "Powered"]].map(([n, l]) => (
                <div key={l} style={{ padding: "14px 20px", borderRadius: 12, background: C.greenPale, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: C.green, fontWeight: 700 }}>{n}</div>
                  <div style={{ fontSize: 11, color: C.textLight, marginTop: 2, letterSpacing: 0.5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 3D Cards */}
          <div style={{ position: "relative", height: 440, perspective: 800 }}>
            {[
              { img: IMAGES.herbs, title: "Fenugreek Intelligence", desc: "AI maps your condition to exact protocol", top: 0, left: 0, rot: "rotateY(-5deg) rotateX(3deg)", z: 3 },
              { img: IMAGES.therapy, title: "NEUROPAUSE 0.33", desc: "Founder's brain — 10,000+ case patterns", top: 90, left: 110, rot: "rotateY(5deg) rotateX(-2deg)", z: 2 },
              { img: IMAGES.mortar, title: "Recovery Tracking", desc: "Pain measured every single session", top: 200, left: 30, rot: "rotateY(-3deg) rotateX(4deg)", z: 1 },
            ].map((c, i) => (
              <div key={i} style={{
                position: "absolute", top: c.top, left: c.left, width: 270, zIndex: c.z,
                borderRadius: 16, overflow: "hidden", transform: c.rot,
                background: C.white, border: `1px solid ${C.border}`,
                boxShadow: "0 16px 50px rgba(0,0,0,0.1)",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s", cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "rotateY(0) rotateX(0) scale(1.05) translateZ(15px)"; e.currentTarget.style.zIndex = "10"; e.currentTarget.style.boxShadow = `0 24px 60px ${C.green}18`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = c.rot; e.currentTarget.style.zIndex = String(c.z); e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.1)"; }}
              >
                <div style={{ height: 110, backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: C.text, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THERAPIES — LIGHT GREEN BG ═══ */}
      <section id="s1" ref={el => { sectionsRef.current[2] = el; }} style={{ padding: "110px 40px", background: C.bgAlt }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>Our Therapies</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", color: C.text }}>Ancient Healing, Modern Precision</h2>
          <p style={{ fontSize: 15, color: C.textLight, marginTop: 12, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>Each therapy is selected by our AI based on your condition and body analysis.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, maxWidth: 1140, margin: "0 auto" }}>
          {[
            { icon: "🌾", name: "Fenugreek Therapy", desc: "Heated fenugreek seed bags on body pressure points. Electromagnetic support restores blood flow and natural mobility.", tag: "Core", tagBg: C.greenPale, tagColor: C.green, img: IMAGES.herbs },
            { icon: "🔴", name: "Red Rice Therapy", desc: "For critical chronic pain and deep circulation blockages. Maximum intensity for severe conditions.", tag: "Critical", tagBg: "#FDE8E8", tagColor: C.red, img: IMAGES.massage },
            { icon: "🌿", name: "Natural Medicine", desc: "Ashwagandha, Shatavari, forest plant formulations. Nature's pharmacy supporting your recovery.", tag: "Support", tagBg: C.goldPale, tagColor: C.gold, img: IMAGES.mortar },
            { icon: "🏥", name: "Physiotherapy", desc: "Expert physiotherapy integrated with fenugreek therapy. Mobility restoration and body point activation.", tag: "Core", tagBg: C.greenPale, tagColor: C.green, img: IMAGES.wellness },
            { icon: "🫁", name: "Body Analysis", desc: "Left-side pain = emotional imbalance. Right-side = physical weakness. We map your body's story first.", tag: "Diagnostic", tagBg: "#E8F0FE", tagColor: "#2563EB", img: IMAGES.therapy },
            { icon: "✨", name: "Holistic Recovery", desc: "Spiritual healing, diet guidance, lifestyle optimization. Healing body, mind, and spirit together.", tag: "Holistic", tagBg: C.goldPale, tagColor: C.gold, img: IMAGES.nature },
          ].map((t, i) => (
            <div key={i} style={{
              borderRadius: 16, overflow: "hidden", background: C.white, border: `1px solid ${C.border}`,
              transition: "transform 0.4s, box-shadow 0.4s, border-color 0.4s", cursor: "default",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${C.green}12`; e.currentTarget.style.borderColor = C.borderGreen; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
            >
              <div style={{ height: 130, backgroundImage: `url(${t.img})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 16, background: t.tagBg, color: t.tagColor, fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{t.tag}</div>
              </div>
              <div style={{ padding: "22px 22px 26px" }}>
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: C.text, margin: "10px 0 8px", fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.7 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS — WHITE BG ═══ */}
      <section id="s2" ref={el => { sectionsRef.current[3] = el; }} style={{ padding: "110px 40px", background: C.white }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>Your Healing Journey</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", color: C.text }}>5 Steps to Recovery</h2>
        </div>
        <div style={{ maxWidth: 750, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: 24, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${C.green}, ${C.gold}, ${C.border})` }} />
          {[
            ["Book & Register", "Book online or call. We create your complete health profile — conditions, pain score, body analysis."],
            ["Doctor Consultation", "Diagnosis with left/right body analysis. AI suggests optimal therapy from 10,000+ case patterns."],
            ["Therapy Sessions", "Matched with best therapist. Fenugreek bags on targeted points. Pain measured before & after."],
            ["Recovery Program", "Silver (7 days), Gold (15 days), or Platinum (30 days). Automated follow-ups track progress."],
            ["AI Learns From You", "Every session teaches our AI. Better predictions. Better treatments for everyone."],
          ].map(([title, desc], i) => (
            <div key={i} style={{
              display: "flex", gap: 32, padding: "24px 0", position: "relative",
              opacity: scrollY > 500 + i * 100 ? 1 : 0.3,
              transform: scrollY > 500 + i * 100 ? "none" : "translateX(-15px)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
                background: scrollY > 500 + i * 100 ? `linear-gradient(135deg, ${C.green}, ${C.greenDark})` : C.white,
                border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display',serif", fontSize: 18,
                color: scrollY > 500 + i * 100 ? C.white : C.green, fontWeight: 700,
                position: "relative", zIndex: 2, transition: "all 0.4s",
                boxShadow: scrollY > 500 + i * 100 ? `0 4px 16px ${C.green}30` : "none",
              }}>{i + 1}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: C.text, marginBottom: 6, fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 14, color: C.textLight, lineHeight: 1.75 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS — LIGHT BG ═══ */}
      <section id="s3" ref={el => { sectionsRef.current[4] = el; }} style={{ padding: "110px 40px", background: C.bgAlt }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>Patient Stories</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", color: C.text }}>Healing That Speaks</h2>
        </div>
        <div style={{ display: "flex", gap: 22, maxWidth: 1140, margin: "0 auto", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 16 }}>
          {[
            { text: "Chronic knee pain for 3 years — gone in 15 days of fenugreek therapy. I can walk without pain now.", name: "Ramesh Patel", detail: "Knee Pain | Gold | 15 days" },
            { text: "My mother's back pain was unbearable. Saurabh bhai's therapy brought her back to normal life in 3 weeks.", name: "Priya Sharma", detail: "Back Pain | Platinum | 30 days" },
            { text: "Cervical pain 5 years — gone in 12 days. Fenugreek combined with physiotherapy was incredible.", name: "Arvind Mehta", detail: "Neck Pain | Gold | 12 days" },
            { text: "Pain score dropped from 8 to 2 in one week. Natural healing works — the results don't lie.", name: "Sneha Joshi", detail: "Arthritis | Silver | 7 days" },
          ].map((t, i) => (
            <div key={i} style={{
              minWidth: 320, scrollSnapAlign: "start", background: C.white,
              border: `1px solid ${C.border}`, borderRadius: 16, padding: 28,
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.06)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ color: C.gold, fontSize: 15, letterSpacing: 3, marginBottom: 14 }}>★★★★★</div>
              <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.8, marginBottom: 20, fontStyle: "italic", fontFamily: "'Playfair Display',serif" }}>"{t.text}"</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.name}</div>
              <div style={{ fontSize: 12, color: C.textLight, marginTop: 3 }}>{t.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ APPOINTMENT — WHITE BG ═══ */}
      <section id="book" style={{ padding: "110px 40px", background: C.white }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 12, color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>Start Your Healing</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", color: C.text }}>Book Consultation</h2>
          <p style={{ fontSize: 15, color: C.textLight, marginTop: 10 }}>We'll contact you within 30 minutes</p>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {formState === "success" ? (
            <div style={{ background: C.greenPale, border: `1px solid ${C.borderGreen}`, borderRadius: 20, padding: 56, textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 18, animation: "pulse 1.5s infinite" }}>✅</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: C.text, marginBottom: 10 }}>Appointment Booked!</div>
              <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.7 }}>Our team will call within 30 minutes.<br />Immediate help: <strong style={{ color: C.green }}>+91 7383127969</strong></p>
              <button onClick={() => { setFormState("idle"); setFormData({ name: "", phone: "", date: "", area: "", notes: "" }); }} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 8, background: "transparent", color: C.green, border: `1px solid ${C.borderGreen}`, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Book Another</button>
            </div>
          ) : (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Full Name *", key: "name", type: "text", ph: "Your full name" },
                  { label: "Phone *", key: "phone", type: "tel", ph: "+91 XXXXXXXXXX" },
                  { label: "Preferred Date", key: "date", type: "date", ph: "" },
                  { label: "Pain Area", key: "area", type: "select", ph: "" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, color: C.textLight, display: "block", marginBottom: 6 }}>{f.label}</label>
                    {f.type === "select" ? (
                      <select value={(formData as any)[f.key]} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
                        <option value="">Select area</option>
                        {["Knee Pain","Back Pain","Neck / Cervical","Shoulder","Joint Pain","Full Body","Other"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={(formData as any)[f.key]} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))} placeholder={f.ph}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
                    )}
                  </div>
                ))}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, color: C.textLight, display: "block", marginBottom: 6 }}>Describe your condition</label>
                  <textarea value={formData.notes} onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))} placeholder="Tell us about your pain..."
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", minHeight: 80, resize: "vertical", outline: "none" }} />
                </div>
              </div>
              <button onClick={submitAppointment} disabled={formState === "loading"}
                style={{ width: "100%", marginTop: 20, padding: 15, borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: C.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 4px 20px ${C.green}25`, opacity: formState === "loading" ? 0.6 : 1 }}>
                {formState === "loading" ? "Booking..." : "Book My Consultation"}
              </button>
              {formState === "error" && <p style={{ color: C.red, fontSize: 13, marginTop: 10, textAlign: "center" }}>Booking failed. Call +91 7383127969</p>}
            </div>
          )}
        </div>
      </section>

      {/* ═══ EMERGENCY — GREEN SECTION ═══ */}
      <section id="s4" ref={el => { sectionsRef.current[5] = el; }} style={{ padding: "90px 40px", background: `linear-gradient(135deg, ${C.greenDark}, ${C.green})` }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.goldLight, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>Emergency Support</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3.5vw,40px)", color: C.white, marginBottom: 14 }}>In Pain Right Now?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 24 }}>Call us immediately or submit an emergency request</p>
          <a href="tel:+917383127969" style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: C.white, textDecoration: "none", display: "block", marginBottom: 24 }}>+91 7383 127 969</a>
          <button onClick={() => setEmergencyOpen(true)} style={{ padding: "13px 30px", borderRadius: 10, background: C.white, color: C.red, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            🚨 Submit Emergency Request
          </button>
        </div>
      </section>

      {/* ═══ EMERGENCY MODAL ═══ */}
      {emergencyOpen && (
        <div onClick={() => setEmergencyOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 36, maxWidth: 440, width: "100%" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: C.text, marginBottom: 22 }}>Emergency Request</h3>
            {[{ label: "Name", key: "name", ph: "Your name" }, { label: "Phone", key: "phone", ph: "Phone number" }].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: C.textLight, display: "block", marginBottom: 5 }}>{f.label}</label>
                <input value={(emData as any)[f.key]} onChange={e => setEmData(d => ({ ...d, [f.key]: e.target.value }))} placeholder={f.ph}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.textLight }}>Pain Level: <span style={{ color: C.red, fontSize: 20, fontWeight: 700 }}>{emData.pain}</span>/10</label>
              <input type="range" min={1} max={10} value={emData.pain} onChange={e => setEmData(d => ({ ...d, pain: +e.target.value }))} style={{ width: "100%", marginTop: 6, accentColor: C.red }} />
            </div>
            <textarea value={emData.desc} onChange={e => setEmData(d => ({ ...d, desc: e.target.value }))} placeholder="Describe pain..."
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", minHeight: 70, resize: "vertical", outline: "none", marginBottom: 14 }} />
            <button onClick={submitEmergency} style={{ width: "100%", padding: 13, borderRadius: 10, background: C.red, color: C.white, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Submit Emergency</button>
          </div>
        </div>
      )}

      {/* ═══ FOOTER — WHITE ═══ */}
      <footer style={{ padding: "72px 40px 36px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44, maxWidth: 1140, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: C.green, marginBottom: 10, fontWeight: 700 }}>Midaz Touch Wellness</div>
            <p style={{ fontSize: 13, color: C.textLight, lineHeight: 1.7 }}>India's first AI-powered Fenugreek Therapy Platform. Natural healing, one patient at a time.</p>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 14 }}>201, Ananta Elysium, Near Pramukh Swami Temple, Nikol, Ahmedabad 382350</p>
            <a href="tel:+917383127969" style={{ color: C.green, textDecoration: "none", fontSize: 14, fontWeight: 600, display: "block", marginTop: 6 }}>+91 7383 127 969</a>
          </div>
          {[
            { title: "Therapies", links: ["Fenugreek", "Red Rice", "Physiotherapy", "Natural Medicine"] },
            { title: "Programs", links: ["Silver — 7 Days", "Gold — 15 Days", "Platinum — 30 Days", "VIP Executive"] },
            { title: "Quick Links", links: ["About Us", "How It Works", "Patient Stories", "Emergency"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ fontSize: 13, color: C.textLight, marginBottom: 9, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 20, borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textLight }}>
          Midaz Touch Wellness Center &copy; 2026 — Powered by MIDAZ ECOSYSTEM AI Clinical Intelligence
        </div>
      </footer>
    </div>
  );
}
