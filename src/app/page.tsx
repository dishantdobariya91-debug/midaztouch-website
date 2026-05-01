'use client';
import { useState, useEffect, useRef } from "react";

const API_URL = "";

// ── Cinematic Ayurveda images from Unsplash ──
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

export default function MidazTouchWebsite() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", area: "", notes: "" });
  const [formState, setFormState] = useState("idle");
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emData, setEmData] = useState({ name: "", phone: "", pain: 7, desc: "" });
  const sectionsRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      sectionsRef.current.forEach((el, i) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) setActiveSection(i);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const submitAppointment = async () => {
    if (!formData.name || !formData.phone) return alert("Please enter name and phone");
    setFormState("loading");
    try {
      const res = await fetch(API_URL + "/api/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: formData.name, patient_phone: formData.phone,
          appointment_date: formData.date || new Date().toISOString().split("T")[0],
          appointment_type: "consultation", priority: "green",
          notes: `${formData.area} — ${formData.notes}`,
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
        headers: { "Content-Type": "application/json" },
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

  const parallax = (factor) => `translateY(${scrollY * factor}px)`;

  // ── LOADER ──
  if (!loaded) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: `linear-gradient(135deg, #0A0F08 0%, #1a2a12 50%, #0A0F08 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&q=60') center/cover",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse 1.5s ease-in-out infinite", boxShadow: "0 0 60px rgba(45,122,58,0.4)",
          border: "2px solid rgba(201,169,110,0.3)",
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>M</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 13, color: "#8A8878", letterSpacing: 6, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
          Midaz Touch Wellness
        </div>
        <div style={{
          marginTop: 20, width: 200, height: 2, borderRadius: 1, background: "rgba(201,169,110,0.1)", overflow: "hidden",
        }}>
          <div style={{
            width: "60%", height: "100%", background: "linear-gradient(90deg, #2D7A3A, #C9A96E)",
            animation: "loadBar 1.5s ease-in-out infinite",
          }} />
        </div>
        <style>{`
          @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
          @keyframes loadBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        `}</style>
      </div>
    );
  }

  const navLinks = ["About", "Therapies", "Journey", "Stories", "Emergency"];

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#0A0F08", color: "#E8E4DF", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ══════ NAV ══════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 80 ? "rgba(10,15,8,0.92)" : "transparent",
        backdropFilter: scrollY > 80 ? "blur(20px)" : "none",
        borderBottom: scrollY > 80 ? "1px solid rgba(201,169,110,0.08)" : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #2D7A3A, #C9A96E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", fontWeight: 700,
          }}>M</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#F5F0E8", fontWeight: 600 }}>Midaz Touch</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map((l, i) => (
            <a key={l} href={`#s${i}`} style={{
              color: activeSection === i + 1 ? "#C9A96E" : "#8A8878", textDecoration: "none",
              fontSize: 13, fontWeight: 500, letterSpacing: 0.5, transition: "color 0.3s",
            }}>{l}</a>
          ))}
          <a href="#book" style={{
            background: "linear-gradient(135deg, #2D7A3A, #1a5e28)", color: "#fff",
            padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}>Book Now</a>
        </div>
      </nav>

      {/* ══════ HERO — Full bleed Ayurveda image ══════ */}
      <section ref={el => sectionsRef.current[0] = el} style={{
        minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Parallax BG Image */}
        <div style={{
          position: "absolute", inset: "-20%", transform: parallax(-0.15),
          backgroundImage: `url(${IMAGES.hero})`, backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.35) saturate(1.2)",
        }} />
        {/* Grain overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 60%, rgba(45,122,58,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(201,169,110,0.1) 0%, transparent 50%)",
        }} />
        {/* Cinematic vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 40%, rgba(10,15,8,0.8) 100%)" }} />

        <div style={{
          position: "relative", zIndex: 2, textAlign: "center", maxWidth: 850, padding: "0 24px",
          animation: "heroIn 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 22px", borderRadius: 40,
            background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)",
            fontSize: 11, color: "#C9A96E", letterSpacing: 4, textTransform: "uppercase", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A96E", animation: "pulse 2s infinite" }} />
            India's First Fenugreek Therapy Platform
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,7vw,78px)", lineHeight: 1.08,
            color: "#F5F0E8", marginBottom: 24, fontWeight: 700,
          }}>
            Where <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Ancient Healing</em><br />Meets Your Body
          </h1>
          <p style={{ fontSize: 17, color: "#A8A498", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.75 }}>
            Natural fenugreek therapy that restores blood flow, reduces chronic pain, and activates your body's deepest healing intelligence.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#book" style={{
              padding: "16px 38px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
              background: "linear-gradient(135deg, #2D7A3A, #1a5e28)", color: "#fff",
              boxShadow: "0 4px 30px rgba(45,122,58,0.35)", transition: "transform 0.4s",
            }}>Book Consultation</a>
            <a href="#s1" style={{
              padding: "16px 38px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
              background: "transparent", color: "#F5F0E8", border: "1px solid rgba(201,169,110,0.25)",
              transition: "all 0.3s",
            }}>Explore Therapies</a>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 56, marginTop: 72,
            animation: "heroIn 1.4s cubic-bezier(0.16,1,0.3,1) 0.7s both",
          }}>
            {[["10,000+", "Patients Healed"], ["82%", "Recovery Rate"], ["15+", "Years Experience"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: "#C9A96E", fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#8A8878", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes heroIn { from { opacity:0; transform: translateY(50px); } to { opacity:1; transform: none; } }`}</style>
      </section>

      {/* ══════ ABOUT — What is Midaz Touch ══════ */}
      <section id="s0" ref={el => sectionsRef.current[1] = el} style={{
        padding: "120px 40px", position: "relative", overflow: "hidden",
      }}>
        {/* Subtle nature BG */}
        <div style={{
          position: "absolute", inset: 0, transform: parallax(-0.05),
          backgroundImage: `url(${IMAGES.leaf})`, backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.12) saturate(0.8)", opacity: 0.6,
        }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "#C9A96E", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>What is Midaz Touch</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", color: "#F5F0E8", lineHeight: 1.15, marginBottom: 24 }}>
              A Healing <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Ecosystem</em>,<br />Not Just a Clinic
            </h2>
            <p style={{ fontSize: 15, color: "#A8A498", lineHeight: 1.8, marginBottom: 20 }}>
              Midaz Touch is powered by <strong style={{ color: "#F5F0E8" }}>MIDAZ ECOSYSTEM</strong> — an AI-driven clinical intelligence platform built by Saurabh Patel that tracks every patient from first consultation to full recovery.
            </p>
            <p style={{ fontSize: 15, color: "#A8A498", lineHeight: 1.8, marginBottom: 36 }}>
              Our treatment philosophy combines fenugreek therapy's electromagnetic healing with modern data intelligence. Every session measures pain reduction. Every pattern teaches our AI. Every patient benefits from the collective healing wisdom.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[["100+", "Patients/Day"], ["7+", "Therapists"], ["AI", "Intelligence"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#C9A96E" }}>{n}</div>
                  <div style={{ fontSize: 11, color: "#8A8878", marginTop: 4, letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 3D image cards */}
          <div style={{ position: "relative", height: 480, perspective: 900 }}>
            {[
              { img: IMAGES.herbs, title: "Fenugreek Intelligence", desc: "AI maps your condition to exact therapy protocol", top: 0, left: 0, rot: "rotateY(-6deg) rotateX(4deg)", z: 3 },
              { img: IMAGES.therapy, title: "NEUROPAUSE 0.33", desc: "Founder's digital brain — 10,000+ case patterns", top: 100, left: 120, rot: "rotateY(6deg) rotateX(-3deg)", z: 2 },
              { img: IMAGES.mortar, title: "Recovery Tracking", desc: "Pain measured before & after every session", top: 220, left: 40, rot: "rotateY(-4deg) rotateX(5deg)", z: 1 },
            ].map((c, i) => (
              <div key={i} style={{
                position: "absolute", top: c.top, left: c.left, width: 280, zIndex: c.z,
                borderRadius: 18, overflow: "hidden", transform: c.rot,
                background: "linear-gradient(145deg, #111A11, #1a2a1a)",
                border: "1px solid rgba(201,169,110,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s",
                cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "rotateY(0) rotateX(0) scale(1.06) translateZ(20px)"; e.currentTarget.style.zIndex = "10"; e.currentTarget.style.boxShadow = "0 30px 80px rgba(201,169,110,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = c.rot; e.currentTarget.style.zIndex = String(c.z); e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.6)"; }}
              >
                <div style={{ height: 120, backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7) saturate(1.1)" }} />
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: "#F5F0E8", marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "#8A8878", lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ THERAPIES ══════ */}
      <section id="s1" ref={el => sectionsRef.current[2] = el} style={{
        padding: "120px 40px", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.spices})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.08) saturate(1.3)", transform: parallax(-0.08),
        }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, color: "#C9A96E", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Our Therapies</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", color: "#F5F0E8" }}>Ancient Healing, Modern Precision</h2>
        </div>
        <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {[
            { icon: "🌾", name: "Fenugreek Therapy", desc: "Heated fenugreek seed bags on body pressure points. Electromagnetic support restores blood flow, reduces pain, and brings natural mobility back.", tag: "Core", tagColor: "#4ADE80", img: IMAGES.herbs },
            { icon: "🔴", name: "Red Rice Therapy", desc: "For critical chronic pain and deep circulation blockages. Intensive treatment for severe cases where standard therapy needs maximum power.", tag: "Critical", tagColor: "#E85D5D", img: IMAGES.massage },
            { icon: "🌿", name: "Natural Medicine", desc: "Ashwagandha, Shatavari, forest plant formulations. Traditional home remedies supporting your body's recovery through nature's pharmacy.", tag: "Support", tagColor: "#C9A96E", img: IMAGES.mortar },
            { icon: "🏥", name: "Physiotherapy", desc: "Expert physiotherapy integrated with fenugreek therapy. Pain recovery, mobility restoration, traditional Indian body point activation.", tag: "Core", tagColor: "#4ADE80", img: IMAGES.wellness },
            { icon: "🫁", name: "Body Analysis", desc: "Left-side pain = emotional imbalance. Right-side pain = physical weakness. We map your body's story before treatment begins.", tag: "Diagnostic", tagColor: "#60A5FA", img: IMAGES.therapy },
            { icon: "✨", name: "Holistic Recovery", desc: "Numerology, spiritual healing, diet guidance, lifestyle optimization. Healing the whole person — body, mind, and spirit together.", tag: "Holistic", tagColor: "#C9A96E", img: IMAGES.nature },
          ].map((t, i) => (
            <div key={i} style={{
              borderRadius: 18, overflow: "hidden", position: "relative",
              background: "linear-gradient(145deg, rgba(17,26,17,0.95), rgba(22,32,22,0.95))",
              border: "1px solid rgba(201,169,110,0.06)",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.4s, box-shadow 0.4s",
              cursor: "default",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-10px) scale(1.02)"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Image header */}
              <div style={{
                height: 140, backgroundImage: `url(${t.img})`, backgroundSize: "cover", backgroundPosition: "center",
                filter: "brightness(0.5) saturate(1.2)",
                transition: "filter 0.4s",
              }} />
              <div style={{
                position: "absolute", top: 12, right: 12, padding: "4px 12px", borderRadius: 20,
                background: `${t.tagColor}18`, color: t.tagColor, fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                border: `1px solid ${t.tagColor}30`,
              }}>{t.tag}</div>
              <div style={{ padding: "24px 24px 28px" }}>
                <span style={{ fontSize: 28 }}>{t.icon}</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#F5F0E8", margin: "12px 0 10px" }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "#8A8878", lineHeight: 1.7 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS — Journey ══════ */}
      <section id="s2" ref={el => sectionsRef.current[3] = el} style={{ padding: "120px 40px", background: "linear-gradient(180deg, #111A11, #0A0F08)" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, color: "#C9A96E", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Your Healing Journey</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", color: "#F5F0E8" }}>5 Steps to Recovery</h2>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          {/* Glowing line */}
          <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #2D7A3A, #C9A96E, transparent)" }} />
          {[
            ["Book & Register", "Book online or call. We create your complete health profile — conditions, pain score, body analysis."],
            ["Doctor Consultation", "Diagnosis with left/right body analysis. AI suggests optimal therapy based on 10,000+ case patterns."],
            ["Therapy Sessions", "Matched with the best therapist. Fenugreek bags on targeted points. Pain measured before & after."],
            ["Recovery Program", "Silver (7 days), Gold (15 days), or Platinum (30 days). Automated follow-ups track your progress."],
            ["AI Learns From You", "Every session teaches our AI. Better predictions. Better treatments. Better outcomes for everyone."],
          ].map(([title, desc], i) => (
            <div key={i} style={{
              display: "flex", gap: 36, padding: "28px 0", position: "relative",
              opacity: scrollY > 600 + i * 100 ? 1 : 0.2,
              transform: scrollY > 600 + i * 100 ? "none" : "translateX(-20px)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: scrollY > 600 + i * 100 ? "linear-gradient(135deg, #2D7A3A, #1a5e28)" : "#111A11",
                border: "2px solid #2D7A3A", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#C9A96E", fontWeight: 700,
                position: "relative", zIndex: 2, transition: "background 0.4s",
                boxShadow: scrollY > 600 + i * 100 ? "0 0 20px rgba(45,122,58,0.3)" : "none",
              }}>{i + 1}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: "#8A8878", lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section id="s3" ref={el => sectionsRef.current[4] = el} style={{ padding: "120px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.ayurveda})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.08)", transform: parallax(-0.06) }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#C9A96E", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Patient Stories</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", color: "#F5F0E8" }}>Healing That Speaks</h2>
        </div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 24, maxWidth: 1200, margin: "0 auto", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 20 }}>
          {[
            { text: "Chronic knee pain for 3 years — gone in 15 days of fenugreek therapy. I can walk without pain now.", name: "Ramesh Patel", detail: "Knee Pain | Gold | 15 days" },
            { text: "My mother's back pain was unbearable. Saurabh bhai's therapy brought her back to normal life in 3 weeks.", name: "Priya Sharma", detail: "Back Pain | Platinum | 30 days" },
            { text: "Cervical pain 5 years — gone in 12 days. Fenugreek combined with physiotherapy was incredible.", name: "Arvind Mehta", detail: "Neck Pain | Gold | 12 days" },
            { text: "Pain score dropped from 8 to 2 in one week. I was skeptical of natural healing but the results don't lie.", name: "Sneha Joshi", detail: "Arthritis | Silver | 7 days" },
          ].map((t, i) => (
            <div key={i} style={{
              minWidth: 340, scrollSnapAlign: "start", background: "rgba(17,26,17,0.8)",
              backdropFilter: "blur(10px)", border: "1px solid rgba(201,169,110,0.08)",
              borderRadius: 18, padding: 32, transition: "transform 0.4s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <div style={{ color: "#C9A96E", fontSize: 16, letterSpacing: 3, marginBottom: 16 }}>★★★★★</div>
              <div style={{ fontSize: 15, color: "#E8E4DF", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic", fontFamily: "'Playfair Display',serif" }}>"{t.text}"</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F0E8" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "#8A8878", marginTop: 4 }}>{t.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ APPOINTMENT BOOKING ══════ */}
      <section id="book" style={{ padding: "120px 40px", background: "#111A11" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#C9A96E", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Start Your Healing</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,48px)", color: "#F5F0E8" }}>Book Consultation</h2>
          <p style={{ fontSize: 15, color: "#8A8878", marginTop: 12 }}>We'll contact you within 30 minutes</p>
        </div>
        <div style={{ maxWidth: 640, margin: "0 auto", perspective: 1000 }}>
          {formState === "success" ? (
            <div style={{ background: "rgba(17,26,17,0.9)", border: "1px solid rgba(45,122,58,0.3)", borderRadius: 24, padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 20, animation: "pulse 1.5s infinite" }}>✅</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: "#F5F0E8", marginBottom: 12 }}>Appointment Booked!</div>
              <p style={{ fontSize: 15, color: "#8A8878", lineHeight: 1.7 }}>Our team will call you within 30 minutes.<br />For immediate help: <strong style={{ color: "#C9A96E" }}>+91 7383127969</strong></p>
              <button onClick={() => { setFormState("idle"); setFormData({ name: "", phone: "", date: "", area: "", notes: "" }); }}
                style={{ marginTop: 24, padding: "12px 28px", borderRadius: 10, background: "transparent", color: "#C9A96E", border: "1px solid rgba(201,169,110,0.3)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                Book Another
              </button>
            </div>
          ) : (
            <div style={{
              background: "linear-gradient(145deg, rgba(17,26,17,0.95), rgba(22,32,22,0.95))",
              border: "1px solid rgba(201,169,110,0.12)", borderRadius: 24, padding: 44,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {[
                  { label: "Full Name *", key: "name", type: "text", placeholder: "Your name", full: false },
                  { label: "Phone *", key: "phone", type: "tel", placeholder: "+91 XXXXXXXXXX", full: false },
                  { label: "Preferred Date", key: "date", type: "date", placeholder: "", full: false },
                  { label: "Pain Area", key: "area", type: "select", placeholder: "", full: false },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.full ? "span 2" : "span 1" }}>
                    <label style={{ fontSize: 12, color: "#8A8878", display: "block", marginBottom: 6, letterSpacing: 0.5 }}>{f.label}</label>
                    {f.type === "select" ? (
                      <select value={formData[f.key]} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                        style={{ width: "100%", padding: "13px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.12)", color: "#F5F0E8", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
                        <option value="">Select area</option>
                        {["Knee Pain","Back Pain","Neck / Cervical","Shoulder","Joint Pain","Full Body","Other"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={formData[f.key]} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        style={{ width: "100%", padding: "13px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.12)", color: "#F5F0E8", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
                    )}
                  </div>
                ))}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, color: "#8A8878", display: "block", marginBottom: 6 }}>Describe your condition</label>
                  <textarea value={formData.notes} onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
                    placeholder="Tell us about your pain..."
                    style={{ width: "100%", padding: "13px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.12)", color: "#F5F0E8", fontSize: 14, fontFamily: "'DM Sans',sans-serif", minHeight: 90, resize: "vertical", outline: "none" }} />
                </div>
              </div>
              <button onClick={submitAppointment} disabled={formState === "loading"}
                style={{
                  width: "100%", marginTop: 22, padding: 16, borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #2D7A3A, #1a5e28)", color: "#fff",
                  fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  transition: "transform 0.3s, box-shadow 0.3s", opacity: formState === "loading" ? 0.6 : 1,
                }}>
                {formState === "loading" ? "Booking..." : "Book My Consultation"}
              </button>
              {formState === "error" && <p style={{ color: "#E85D5D", fontSize: 13, marginTop: 12, textAlign: "center" }}>Booking failed. Call +91 7383127969</p>}
            </div>
          )}
        </div>
      </section>

      {/* ══════ EMERGENCY ══════ */}
      <section id="s4" ref={el => sectionsRef.current[5] = el} style={{ padding: "100px 40px", background: "linear-gradient(135deg, rgba(232,93,93,0.04), rgba(10,15,8,1))" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#E85D5D", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Emergency Support</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", color: "#F5F0E8", marginBottom: 16 }}>In Pain Right Now?</h2>
          <p style={{ fontSize: 15, color: "#8A8878", marginBottom: 28 }}>Call us immediately or submit an emergency request</p>
          <a href="tel:+917383127969" style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: "#fff", textDecoration: "none", display: "block", marginBottom: 28 }}>+91 7383 127 969</a>
          <button onClick={() => setEmergencyOpen(true)} style={{
            padding: "14px 32px", borderRadius: 12, background: "#E85D5D", color: "#fff",
            border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}>🚨 Submit Emergency Request</button>
        </div>
      </section>

      {/* ══════ EMERGENCY MODAL ══════ */}
      {emergencyOpen && (
        <div onClick={() => setEmergencyOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#111A11", border: "1px solid rgba(232,93,93,0.2)", borderRadius: 20, padding: 40, maxWidth: 460, width: "100%",
          }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8", marginBottom: 24 }}>Emergency Request</h3>
            {[
              { label: "Name", key: "name", placeholder: "Your name" },
              { label: "Phone", key: "phone", placeholder: "Phone number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "#8A8878", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input value={emData[f.key]} onChange={e => setEmData(d => ({ ...d, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(232,93,93,0.2)", color: "#F5F0E8", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#8A8878" }}>Pain Level: <span style={{ color: "#E85D5D", fontSize: 22, fontWeight: 700 }}>{emData.pain}</span>/10</label>
              <input type="range" min={1} max={10} value={emData.pain} onChange={e => setEmData(d => ({ ...d, pain: +e.target.value }))}
                style={{ width: "100%", marginTop: 8, accentColor: "#E85D5D" }} />
            </div>
            <textarea value={emData.desc} onChange={e => setEmData(d => ({ ...d, desc: e.target.value }))} placeholder="Describe pain..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(232,93,93,0.2)", color: "#F5F0E8", fontSize: 14, fontFamily: "'DM Sans',sans-serif", minHeight: 80, resize: "vertical", outline: "none", marginBottom: 16 }} />
            <button onClick={submitEmergency} style={{ width: "100%", padding: 14, borderRadius: 12, background: "#E85D5D", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Submit Emergency</button>
          </div>
        </div>
      )}

      {/* ══════ FOOTER ══════ */}
      <footer style={{ padding: "80px 40px 40px", borderTop: "1px solid rgba(201,169,110,0.06)", background: "#0D1210" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#F5F0E8", marginBottom: 12 }}>Midaz Touch Wellness</div>
            <p style={{ fontSize: 14, color: "#8A8878", lineHeight: 1.7 }}>India's first AI-powered Fenugreek Therapy Platform. Restoring health naturally, one patient at a time.</p>
            <p style={{ fontSize: 13, color: "#8A8878", marginTop: 16 }}>201, Ananta Elysium, Near Pramukh Swami Temple, Nikol, Ahmedabad 382350</p>
            <a href="tel:+917383127969" style={{ color: "#C9A96E", textDecoration: "none", fontSize: 14, display: "block", marginTop: 8 }}>+91 7383 127 969</a>
          </div>
          {[
            { title: "Therapies", links: ["Fenugreek", "Red Rice", "Physiotherapy", "Natural Medicine"] },
            { title: "Programs", links: ["Silver — 7 Days", "Gold — 15 Days", "Platinum — 30 Days", "VIP Executive"] },
            { title: "Quick Links", links: ["About Us", "How It Works", "Patient Stories", "Emergency"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color: "#C9A96E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ fontSize: 14, color: "#8A8878", marginBottom: 10, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 60, paddingTop: 24, borderTop: "1px solid rgba(201,169,110,0.05)", fontSize: 13, color: "#5A5A4E" }}>
          Midaz Touch Wellness Center © 2026 — Powered by MIDAZ ECOSYSTEM™ AI Clinical Intelligence
        </div>
      </footer>
    </div>
  );
}
