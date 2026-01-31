import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Play, Pause, ArrowUpRight, Plus, Activity, Zap, Disc, Check, Minus, Filter, ChevronLeft, Hexagon, X, ArrowRight, Lock, Globe, Copy } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import { Helmet } from 'react-helmet';

// --- CONFIGURAÇÃO RÁPIDA ---
const CONFIG = {
  adminEmail: "sylvester2601@gmail.com", 
  stripeLinkAccess: "https://buy.stripe.com/teu_link_aqui", 
  gaMeasurementId: "G-XXXXXXXXXX" 
};

// --- COMPONENTES VISUAIS ---

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      const isClickable = target.tagName === 'BUTTON' || 
                          target.tagName === 'A' || 
                          target.tagName === 'INPUT' ||
                          target.tagName === 'TEXTAREA' ||
                          target.tagName === 'LABEL' ||
                          target.closest('button') || 
                          target.closest('.beat-grid-row') || 
                          target.closest('.genre-card');
      setIsHovering(isClickable);
    };

    if (!isMobile) {
        window.addEventListener("mousemove", mouseMove);
    }
    
    return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener("mousemove", mouseMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const variants = {
    default: { x: mousePosition.x - 5, y: mousePosition.y - 5, height: 10, width: 10, backgroundColor: "#fff", mixBlendMode: "difference" },
    hover: { x: mousePosition.x - 25, y: mousePosition.y - 25, height: 50, width: 50, backgroundColor: "#fff", mixBlendMode: "difference" }
  };

  return (
    <motion.div className="custom-cursor" variants={variants} animate={isHovering ? "hover" : "default"} transition={{ type: "spring", stiffness: 500, damping: 28 }} />
  );
};

const MaskText = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} style={{ overflow: 'hidden' }} className={className}>
      <motion.div initial={{ y: "100%" }} animate={isInView ? { y: "0%" } : { y: "100%" }} transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1], delay: delay }}>
        {children}
      </motion.div>
    </div>
  );
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, delay: delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

// --- COMPONENTE MARQUEE (ADICIONADO) ---
const Marquee = () => {
  return (
    <div style={{ overflow: 'hidden', background: '#fff', color: '#000', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
      <motion.div 
        animate={{ x: [0, -1000] }} 
        transition={{ ease: "linear", duration: 20, repeat: Infinity }} 
        style={{ display: 'flex', whiteSpace: 'nowrap', gap: '4rem', fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.1em' }}
      >
        <span>/// EXECUTIVE PRODUCTION</span>
        <span>/// MIXING & MASTERING INCLUDED</span>
        <span>/// UNLIMITED REVISIONS</span>
        <span>/// PORTUGAL BASED • GLOBAL SOUND</span>
        <span>/// EXECUTIVE PRODUCTION</span>
        <span>/// MIXING & MASTERING INCLUDED</span>
        <span>/// UNLIMITED REVISIONS</span>
        <span>/// PORTUGAL BASED • GLOBAL SOUND</span>
      </motion.div>
    </div>
  );
};

const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVars = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

// --- FORMULÁRIO (MODAL) ---
// --- FORMULÁRIO (MODAL) OTIMIZADO PARA VISÃO EXECUTIVA ---
const ContactModal = ({ isOpen, onClose, selectedPlan }) => {
  const [isCommitted, setIsCommitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Verifica se é o plano barato
  const isAccessPlan = selectedPlan === "ACCESS";

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const formData = new FormData(e.target);
    
    // Adicionar dados extra apenas se não for o plano Access
    if (!isAccessPlan) {
        const isAnnual = formData.get('annual_upgrade') === 'on';
        formData.append("CONTRACT_TYPE", isAnnual ? "ANNUAL (15% OFF)" : "MONTHLY STANDARD");
    }

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${CONFIG.adminEmail}`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert(isAccessPlan 
                ? "SELECTION RECEIVED.\nI will contact you within 24h with the beats and the payment link." 
                : "APPLICATION SENT SUCCESSFULLY.\nI will review your project and contact you within 24 hours.");
            onClose();
        } else {
            throw new Error("Network response was not ok.");
        }
    } catch (error) {
        alert("SYSTEM ERROR: Could not verify connection. Please DM me on Instagram or email directly.");
        console.error("Form error:", error);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div className="modal-content" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        
        <div className="modal-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
             <div style={{width: 8, height: 8, background: '#0f0', borderRadius: '50%', boxShadow: '0 0 10px #0f0'}}></div>
             <span className="modal-subtitle">SYSTEM_READY // INITIATE PROTOCOL</span>
          </div>
          <h2 className="modal-title">{isAccessPlan ? "BEAT SELECTION" : "SECURE YOUR SLOT"}</h2>
          <p className="modal-plan">SELECTED TIER: <span className="highlight">{selectedPlan}</span></p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Configurações FormSubmit (Ocultas) */}
          <input type="hidden" name="_subject" value={`Nova Submissão - ${selectedPlan}`} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="selected_tier" value={selectedPlan} />

          {/* --- FORMULÁRIO SIMPLES (ACCESS TIER) --- */}
          {isAccessPlan ? (
            <>
                <div className="form-group">
                    <label>YOUR EMAIL</label>
                    <input name="email" type="email" placeholder="CONTACT@YOU.COM" required />
                </div>
                <div className="form-group">
                    <label>YOUTUBE LINKS (SELECT 2 BEATS)</label>
                    <textarea 
                        name="beat_links" 
                        placeholder="Paste the links of the 2 beats from my channel you want to acquire." 
                        rows="4" 
                        required
                    ></textarea>
                </div>
                <div className="checkbox-group" style={{marginTop: '0.5rem'}}>
                    <input type="checkbox" id="terms_access" required />
                    <label htmlFor="terms_access">I understand I will receive the files after payment verification.</label>
                </div>
            </>
          ) : (
            /* --- FORMULÁRIO COMPLETO (ARTIST/MOGUL TIER) - ATUALIZADO --- */
            <>
                <div className="form-section-label">[01] IDENTITY VERIFICATION</div>
                <div className="form-row">
                    <div className="form-group"><label>FULL NAME</label><input name="name" type="text"  required /></div>
                    <div className="form-group"><label>ARTIST NAME</label><input name="artist_name" type="text"  required /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>EMAIL ADDRESS</label><input name="email" type="email"  required /></div>
                    <div className="form-group"><label>INSTAGRAM</label><input name="instagram" type="text"  /></div>
                </div>

                <div className="form-section-label" style={{marginTop: '1rem'}}>[02] PROJECT SCOPE</div>
                
                {/* CAMPO ALTERADO: FASE DO PROJETO (Em vez de status do ficheiro) */}
                <div className="form-group">
                    <label>CURRENT STAGE</label>
                    <select name="project_stage" required style={{width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '0.8rem', outline: 'none'}}>
                        <option value="" disabled selected>WHERE ARE YOU AT?</option>
                        <option value="IDEA_PHASE">Idea Phase (I need beats from scratch)</option>
                        <option value="WRITING_PHASE">Writing Phase (I have lyrics/flows)</option>
                        <option value="DEMO_PHASE">Demo Phase (I have rough recordings)</option>
                        <option value="COMPLETION_PHASE">Completion Phase (Ready for Mix/Master)</option>
                    </select>
                </div>

                {/* CAMPO ALTERADO: DIREÇÃO CRIATIVA (Em vez de referências obrigatórias) */}
                <div className="form-group">
                    <label>CREATIVE DIRECTION</label>
                    <textarea name="creative_direction" placeholder="Describe the energy, the emotion, or the story. What do you want the listener to feel? (You can paste links if you want, but focus on the vision)." rows="3" required></textarea>
                </div>

                <div className="form-group">
                    <label>RELEASE STRATEGY</label>
                    <div className="radio-group" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', cursor: 'pointer'}}>
                            <input type="radio" name="release_strategy" value="SINGLE" required /> Single Release
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', cursor: 'pointer'}}>
                            <input type="radio" name="release_strategy" value="EP_ALBUM" /> EP / Project
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', cursor: 'pointer'}}>
                            <input type="radio" name="release_strategy" value="MONTHLY" /> Monthly Drops
                        </label>
                    </div>
                </div>

                <div className="form-section-label" style={{marginTop: '1rem'}}>[03] COMMITMENT PROTOCOL</div>
                <div className="commitment-checkbox-wrapper">
                    <input type="checkbox" id="commitment" name="is_committed" onChange={(e) => setIsCommitted(e.target.checked)} />
                    <label htmlFor="commitment">Would you be willing to commit to a year of dropping a song every single month?</label>
                </div>

                <AnimatePresence>
                    {isCommitted && (
                    <motion.div className="upsell-container" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="upsell-box">
                        <div className="upsell-header"><Lock size={14} /> SYSTEM_OFFER_UNLOCKED</div>
                        <div className="upsell-content">
                            
                            <div className="upsell-option">
                                <input type="checkbox" id="annual" name="annual_upgrade" />
                                <label htmlFor="annual"><strong>ENABLE ANNUAL CONTRACT (15% OFF)</strong><br/><span style={{opacity: 0.7, fontSize: '0.65rem'}}>Secure your production slot for 12 months.</span></label>
                            </div>
                        </div>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>

                <div className="checkbox-group" style={{marginTop: '1.5rem'}}>
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">I understand this is an application. Payment processed after approval.</label>
                </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={isSending}>
            {isSending ? "TRANSMITTING..." : (isAccessPlan ? "REQUEST BEATS" : "SUBMIT APPLICATION")} <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
// --- MANTIVE OS TEUS TEXTOS ORIGINAIS ---
const WorkflowSection = () => {
  const steps = [
    { num: "01", title: "// BRIEF", desc: "Send me the vision. Don't just pick a random beat. Send me a reference track or a voice memo. I analyze the vibe you want to capture." },
    { num: "02", title: "// FOUNDATION", desc: "I build your sound. I create a custom instrumental tailored specifically to that vision. No recycled leases. A sound that fits you." },
    { num: "03", title: "// ARCHITECTURE", desc: "Send me your rough recording. I provide feedback, rearrange sections for better impact, and help turn a recording into a record." },
    { num: "04", title: "// FINAL RENDER", desc: "Radio-ready delivery. Industry-standard Mixing & Mastering included. We don't stop until it sounds like it belongs on a major playlist." },
  ];
  return (
    <section className="workflow-section">
      <div className="workflow-header">
        <Reveal><h2 className="section-heading"><Activity size={14} className="icon"/> PRODUCTION_CYCLE</h2></Reveal>
        <Reveal><span className="entry-count">[ HOW IT WORKS ]</span></Reveal>
      </div>
      <div className="workflow-grid">
        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.1} className="workflow-card">
            <div className="step-number">{step.num}</div><div className="step-line"></div>
            <h3 className="step-title">{step.title}</h3><p className="step-desc">{step.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer, i }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-header"><span className="faq-index">0{i + 1} //</span><h3 className="faq-question">{question}</h3><button className="faq-toggle">{isOpen ? <Minus size={16} /> : <Plus size={16} />}</button></div>
      <AnimatePresence>{isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="faq-body"><p className="faq-answer">{answer}</p></motion.div>)}</AnimatePresence>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('SELECTION'); 
  const [activeFilter, setActiveFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false); // Estado para o botão de copy
  const audioRef = useRef(new Audio());
  
  useEffect(() => {
    // Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaMeasurementId}`;
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', CONFIG.gaMeasurementId);

    // Smooth Scroll
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Audio Cleanup
    const audio = audioRef.current;
    const handleEnded = () => { setIsPlaying(false); setCurrentBeat(null); };
    audio.addEventListener('ended', handleEnded);
    return () => { audio.removeEventListener('ended', handleEnded); lenis.destroy(); };
  }, []);

  const handlePlay = (beat, e) => {
    if (e) e.stopPropagation();
    if (!beat.audio) return;
    if (currentBeat === beat.id) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
      else { audioRef.current.play(); setIsPlaying(true); }
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      audioRef.current.src = beat.audio;
      audioRef.current.play().then(() => { setCurrentBeat(beat.id); setIsPlaying(true); }).catch(() => setIsPlaying(false));
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan.name); 
    setIsModalOpen(true);
  };

  // Função para copiar o email
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONFIG.adminEmail);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };

  const selectGenre = (genre) => { setActiveFilter(genre); setViewMode('GRID'); setTimeout(() => { document.getElementById('inventory-list-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100); };
  const backToSelection = () => { setViewMode('SELECTION'); setActiveFilter(null); };
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // --- DADOS COMPLETOS (50 BEATS) - MANTIVE OS TEUS ---
  const allBeats = [
    // AFROBEAT
    { id: 1, title: "GOLD_DUST", bpm: 93, key: "Am", tag: "AFRO", price: 49, audio: "/beats/afrobeat1.mp3" },
    { id: 2, title: "TRIBAL_CODE", bpm: 120, key: "C#m", tag: "AFRO", price: 49, audio: "/beats/afrobeat2.mp3" },
    { id: 3, title: "ESSENCE_TYPE", bpm: 97, key: "G#m", tag: "AFRO", price: 49, audio: "/beats/afrobeat3.mp3" },
    { id: 4, title: "RED_EARTH", bpm: 110, key: "BM", tag: "AFRO", price: 49, audio: "/beats/afrobeat4.mp3" },
    { id: 5, title: "SOLAR_FLARE", bpm: 139, key: "Cm", tag: "AFRO", price: 49, audio: "/beats/afrobeat5.mp3" },
    // BOOMBAP
    { id: 6, title: "CONCRETE_GARDEN", bpm: 77.5, key: "D#m", tag: "BOOMBAP", price: 49, audio: "/beats/boombapbeat1.mp3" },
    { id: 7, title: "EAST_SIDE_STORY", bpm: 80, key: "Dm", tag: "BOOMBAP", price: 49, audio: "/beats/boombapbeat2.mp3" },
    { id: 8, title: "SUBWAY_GHOST", bpm: 80, key: "F#M", tag: "BOOMBAP", price: 49, audio: "/beats/boombapbeat3.mp3" },
    { id: 9, title: "VINTAGE_BLOOD", bpm: 90, key: "C#m", tag: "BOOMBAP", price: 49, audio: "/beats/boombapbeat4.mp3" },
    { id: 10, title: "GRIMY_STREETS", bpm: 75, key: "Cm", tag: "BOOMBAP", price: 49, audio: "/beats/boombapbeat5.mp3" },
    // BRAZILIAN FUNK
    { id: 11, title: "FAVELA_NOIR", bpm: 130, key: "Gm", tag: "FUNK", price: 49, audio: "/beats/brazilianfunk1.mp3" },
    { id: 12, title: "FUNK_ESPACIAL", bpm: 140, key: "AbM", tag: "FUNK", price: 49, audio: "/beats/brazilianfunk2.mp3" },
    { id: 13, title: "BAILE_X", bpm: 120, key: "A#m", tag: "FUNK", price: 49, audio: "/beats/brazilianfunk3.mp3" },
    { id: 14, title: "RIO_VOLTAGE", bpm: 123, key: "Gm", tag: "FUNK", price: 49, audio: "/beats/brazilianfunk4.mp3" },
    { id: 15, title: "SAO_PAULO_DRIFT", bpm: 140, key: "EbM", tag: "FUNK", price: 49, audio: "/beats/brazilianfunk5.mp3" },
    // DRILL
    { id: 16, title: "NORTH_FACE", bpm: 135, key: "Dm", tag: "DRILL", price: 49, audio: "/beats/drillbeat1.mp3" },
    { id: 17, title: "WINTER_SOLDIER", bpm: 140, key: "D#m", tag: "DRILL", price: 49, audio: "/beats/drillbeat2.mp3" },
    { id: 18, title: "FAMILY_TIES", bpm: 140, key: "C#m", tag: "DRILL", price: 49, audio: "/beats/drillbeat3.mp3" },
    { id: 19, title: "SWITCH_BLADE", bpm: 140, key: "CM", tag: "DRILL", price: 49, audio: "/beats/drillbeat4.mp3" },
    { id: 20, title: "BLACK_MASK", bpm: 140, key: "Em", tag: "DRILL", price: 49, audio: "/beats/drillbeat5.mp3" },
    // ELECTRONIC
    { id: 21, title: "PINK_LEMONADE", bpm: 132, key: "Bm", tag: "ELECTRO", price: 49, audio: "/beats/electronicbeat1.mp3" },
    { id: 22, title: "HOUSE_PARTY", bpm: 120, key: "Em", tag: "ELECTRO", price: 49, audio: "/beats/electronicbeat2.mp3" },
    { id: 23, title: "SAMBA_WAVE", bpm: 124, key: "Cm", tag: "ELECTRO", price: 49, audio: "/beats/electronicbeat3.mp3" },
    { id: 24, title: "LOFI_DREAMS", bpm: 130, key: "Fm", tag: "ELECTRO", price: 49, audio: "/beats/electronicbeat4.mp3" },
    { id: 25, title: "HIGH_VOLTAGE", bpm: 130, key: "Em", tag: "ELECTRO", price: 49, audio: "/beats/electronicbeat5.mp3" },
    // EXPERIMENTAL
    { id: 26, title: "VOID_WALKER", bpm: 120, key: "A#m", tag: "EXPERIMENTAL", price: 49, audio: "/beats/experimentalbeat1.mp3" },
    { id: 27, title: "HYPER_VENOM", bpm: 136, key: "DM", tag: "EXPERIMENTAL", price: 49, audio: "/beats/experimentalbeat2.mp3" },
    { id: 28, title: "INDUSTRIAL_BOUNCE", bpm: 128, key: "Cm", tag: "EXPERIMENTAL", price: 49, audio: "/beats/experimentalbeat3.mp3" },
    { id: 29, title: "LUCID_DREAM", bpm: 84, key: "G#m", tag: "EXPERIMENTAL", price: 49, audio: "/beats/experimentalbeat4.mp3" },
    { id: 30, title: "CHAOS_THEORY", bpm: 87, key: "D#m", tag: "EXPERIMENTAL", price: 49, audio: "/beats/experimentalbeat5.mp3" },
    // JERK
    { id: 31, title: "PRINCESS_CUTS", bpm: 80, key: "A#m", tag: "JERK", price: 49, audio: "/beats/jerkbeat1.mp3" },
    { id: 32, title: "MOTION_BLUR", bpm: 109, key: "Dm", tag: "JERK", price: 49, audio: "/beats/jerkbeat2.mp3" },
    { id: 33, title: "BOUNCE_RATE", bpm: 74, key: "C#m", tag: "JERK", price: 49, audio: "/beats/jerkbeat3.mp3" },
    { id: 34, title: "COLD_WAR", bpm: 82, key: "EM", tag: "JERK", price: 49, audio: "/beats/jerkbeat4.mp3" },
    { id: 35, title: "INFINITE_REACH", bpm: 84, key: "Cm", tag: "JERK", price: 49, audio: "/beats/jerkbeat5.mp3" },
    // REGGAETON
    { id: 36, title: "CARIBBEAN_ICE", bpm: 85, key: "D#m", tag: "REGGAETON", price: 49, audio: "/beats/reggaetonbeat1.mp3" },
    { id: 37, title: "MIDNIGHT_SUN", bpm: 93, key: "G#m", tag: "REGGAETON", price: 49, audio: "/beats/reggaetonbeat2.mp3" },
    { id: 38, title: "LATIN_HEAT", bpm: 96, key: "Dm", tag: "REGGAETON", price: 49, audio: "/beats/reggaetonbeat3.mp3" },
    { id: 39, title: "ISLAND_ECHO", bpm: 96, key: "Fm", tag: "REGGAETON", price: 49, audio: "/beats/reggaetonbeat4.mp3" },
    { id: 40, title: "DEMBOW_RHYTHM", bpm: 100, key: "Am", tag: "REGGAETON", price: 49, audio: "/beats/reggaetonbeat5.mp3" },
    // RNB
    { id: 41, title: "LATE_NIGHT", bpm: 83, key: "G#m", tag: "RNB", price: 49, audio: "/beats/rnbbeat1.mp3" },
    { id: 42, title: "SOUL_SEARCH", bpm: 97, key: "C#m", tag: "RNB", price: 49, audio: "/beats/rnbbeat2.mp3" },
    { id: 43, title: "AFTER_HOURS", bpm: 88, key: "A#m", tag: "RNB", price: 49, audio: "/beats/rnbbeat3.mp3" },
    { id: 44, title: "LOVE_SCARS", bpm: 90, key: "Gm", tag: "RNB", price: 49, audio: "/beats/rnbbeat4.mp3" },
    { id: 45, title: "SLOW_MOTION", bpm: 82, key: "G#m", tag: "RNB", price: 49, audio: "/beats/rnbbeat5.mp3" },
    // TRAP
    { id: 46, title: "RICH_SOUL", bpm: 123, key: "Em", tag: "TRAP", price: 49, audio: "/beats/trapbeat1.mp3" },
    { id: 47, title: "HEAVY_WEIGHT", bpm: 123, key: "EbM", tag: "TRAP", price: 49, audio: "/beats/trapbeat2.mp3" },
    { id: 48, title: "DARK_MATTER", bpm: 89, key: "Cm", tag: "TRAP", price: 49, audio: "/beats/trapbeat3.mp3" },
    { id: 49, title: "TRAP_LORD", bpm: 126, key: "D#m", tag: "TRAP", price: 49, audio: "/beats/trapbeat4.mp3" },
    { id: 50, title: "PHANTOM_RIDE", bpm: 95, key: "Bm", tag: "TRAP", price: 49, audio: "/beats/trapbeat5.mp3" },
  ];

  const genres = ['AFRO', 'BOOMBAP', 'FUNK', 'DRILL', 'ELECTRO', 'EXPERIMENTAL', 'JERK', 'REGGAETON', 'RNB', 'TRAP'];
  const filteredBeats = activeFilter ? allBeats.filter(beat => beat.tag === activeFilter) : [];

  // --- MANTIVE OS TEUS TEXTOS ORIGINAIS ---
  const plans = [
    { 
        name: "ACCESS", 
        price: "29", 
        ram: "2 LEASES", 
        cpu: "MP3 + WAV", 
        highlight: false, 
        desc: "2 Beat Leases / Month (From my youtube channel). Keep your flow sharp. Ideal for mixtapes and promotional content.",
        directBuy: false, 
        link: CONFIG.stripeLinkAccess 
    },
    { 
        name: "ARTIST", 
        price: "99", 
        ram: "CUSTOM + MIX/MASTER", 
        cpu: "UNLIMITED LICENSE", 
        highlight: true, 
        desc: "FULL PRODUCTION SUITE. Custom Beat Generation + Vocal Mixing + Mastering. The complete pipeline to take you from voice demo to streaming platforms.",
        directBuy: false 
    },
    { 
        name: "MOGUL", 
        price: "399", 
        ram: "FULL OWNERSHIP", 
        cpu: "0% SPLIT (BUYOUT)", 
        highlight: false, 
        desc: "TOTAL CONTROL. You are building a catalogue. You understand intellectual property. Secure 100% ownership and keep all your backend royalties.",
        directBuy: false 
    }
  ];

  // --- MANTIVE OS TEUS TEXTOS ORIGINAIS (COM A FAQ NOVA) ---
  const faqs = [
    { 
      q: "WHY NOT JUST DOWNLOAD A 'TYPE BEAT' FROM YOUTUBE?", 
      a: "Because a YouTube beat wasn't made for you, it was made for the algorithm. Here, you give me the direction, the vibe, the references, and I engineer a custom beat that fits your needs. " 
    },
    { 
      q: "WHAT IF I'M NOT HAPPY WITH THE MIX/BEAT?", 
      a: "We fix it. The service includes unlimited revisions. We tweak the arrangement, levels, and effects until it hits exactly how you envisioned. We don't stop until it's radio-ready." 
    },
    { 
      q: "WHAT HAPPENS AFTER I PAY?", 
      a: "Protocol initiates immediately. You submit your references/vocals. I start the engineering process. Within 3 business days, you receive the first draft. No chasing, no ghosting. Just execution." 
    },
    { 
      q: "I HAVE ZERO MONTHLY LISTENERS. IS THIS FOR ME?", 
      a: "This is EXACTLY for you. You don't grow a fanbase by releasing amateur demos recorded in your bedroom. You grow by releasing professional-quality music consistently. I provide the quality; you provide the consistency." 
    },
    // --- FAQ NOVA PEDIDA ---
    {
      q: "CAN I CUSTOMIZE A PLAN?",
      a: "Yes. If you have a specific request, contact me directly. We can adjust the protocol to fit your project's needs."
    }
  ];

  return (
    <div className="app-container">
      <Helmet>
        <title>SLVSTR® | Executive Production</title>
        <meta name="description" content="Your personal executive producer. Custom beats, mixing, and mastering service." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Helmet>

      <CustomCursor />
      <AnimatePresence>
        {isModalOpen && (<ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedPlan={selectedPlan} />)}
      </AnimatePresence>

      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo-container">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="logo-icon"><div className="logo-dot"></div></motion.div>
            <span className="logo-text">SLVSTR®</span>
          </div>
          <nav className="nav-menu">
            {['SOUND_PALETTE', 'PRODUCTION_CYCLE', 'SELECT_PROTOCOL', 'COMMON_QUESTIONS'].map((item, i) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-item"><span className="nav-link"><span className="arrow">→</span>[0{i+1}] {item}</span></a>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="system-status" style={{ marginBottom: '1rem' }}><Activity size={14} className="icon"/><span>UPTIME: 10 YEARS</span></div>
          <div className="system-status"><div className="icon" style={{width: 8, height: 8, borderRadius: '50%', background: '#0f0', boxShadow: '0 0 10px #0f0'}}></div><span>SYSTEM OPTIMAL</span></div>
          <div className="progress-bar-container"><motion.div className="progress-bar" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}/></div>
        </div>
      </aside>

      <main className="main-content">
        <div className="grid-overlay" />
        
        <header className="hero-section">
          <div className="hero-inner">
            <Reveal><div className="status-badge-container"><div className="status-badge">/// PRIVATE_ACCESS</div><span className="separator-line"></span><span className="status-text">ACCEPTING NEW ARTIST APPLICATIONS</span></div></Reveal>
            <div style={{ position: 'relative', zIndex: 30 }}><h1 className="hero-title"><span className="solid-text">STOP SEARCHING.</span><span className="outline-text">START RELEASING.</span></h1></div>
            <Reveal delay={0.2}><div className="hero-footer"><p className="hero-desc">// STOP LEASING RANDOM BEATS.<br/><strong>You need a cohesive sound. </strong>  You explain your vision, I build the instrumental, and deliver a Mix & Master that competes with the majors.<strong> <br/>One fee. Zero headaches.</strong></p><button className="cta-btn" onClick={() => document.getElementById('infrastructure').scrollIntoView({ behavior: 'smooth' })}><span>APPLY FOR PRODUCTION</span> <ArrowUpRight size={14} /></button></div></Reveal>
          </div>
        </header>

        <Marquee />

        <section id="inventory" className="catalog-section">
          <div className="inventory-header-container"><div className="inventory-title-block"><h2 className="section-heading"><Disc size={14} className="spin-icon"/> SOUND_PALETTE</h2><span className="entry-count">[ ARCHITECTING SOUND SINCE 2016 ]</span></div></div>
          <AnimatePresence mode="wait">
            {viewMode === 'SELECTION' && (
                <motion.div key="selection" variants={containerVars} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="genre-selection-container">
                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2rem', letterSpacing: '0.1em' }}>// DEFINE YOUR AESTHETIC</p>
                    <div className="genre-grid">{genres.map(genre => (<motion.button key={genre} variants={itemVars} className="genre-card" onClick={() => selectGenre(genre)} whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }} whileTap={{ scale: 0.98 }}><Hexagon size={24} className="genre-icon" /><span className="genre-name">{genre}</span></motion.button>))}</div>
                </motion.div>
            )}
            {viewMode === 'GRID' && (
                <motion.div id="inventory-list-anchor" key="grid" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}>
                    <div className="grid-controls"><button className="back-btn" onClick={backToSelection}><ChevronLeft size={16} /> BACK_TO_ROOT</button><span className="current-filter">/// SECTOR: {activeFilter}</span></div>
                    <div className="beat-grid-header"><span>ID</span><span>TITLE</span><span>BPM / KEY</span><span>GENRE</span><span>PRICE</span><span>ACTION</span></div>
                    <div className="beats-grid-list">
                        {filteredBeats.map((beat) => (
                            <motion.div key={beat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`beat-grid-row ${currentBeat === beat.id ? 'playing' : ''}`} onClick={(e) => handlePlay(beat, e)}>
                                <div className="col-id">{currentBeat === beat.id && isPlaying ? <div className="equalizer">...</div> : <span className="id-num">{(beat.id).toString().padStart(2, '0')}</span>}</div>
                                <div className="col-title">{beat.title}</div>
                                <div className="col-meta">{beat.bpm} <span className="dim">BPM</span> // {beat.key}</div>
                                <div className="col-tag"><span className="grid-tag">{beat.tag}</span></div>
                                <div className="col-price">€{beat.price}</div>
                                <div className="col-action"><button className="grid-play-btn">{currentBeat === beat.id && isPlaying ? <Pause size={12} /> : <Play size={12} />}</button></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section id="workflow"><WorkflowSection /></section>

        <section id="infrastructure" className="pricing-section">
          <div className="pricing-container">
            <Reveal><div className="pricing-header"><h2 className="big-heading"><MaskText>Select</MaskText><MaskText delay={0.1}>Protocol</MaskText></h2><p className="sub-heading">CHOOSE YOUR TIER</p></div></Reveal>
            <div className="pricing-grid">
              {plans.map((plan, i) => (
                <Reveal key={i} delay={i * 0.2}>
                  <div className={`plan-card ${plan.highlight ? 'highlight' : ''}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '680px' }}>
                    {plan.highlight && <div className="highlight-bar"></div>}
                    <div className="plan-top">
                      <div className="plan-meta"><h4>TIER_0{i+1}</h4>{plan.highlight && <Zap size={16} className="icon"/>}</div>
                      <h3 className="plan-title" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)', fontWeight: '900', letterSpacing: '-1px', textTransform: 'uppercase' }}>{plan.name}</h3>
                      <div className="plan-price">€{plan.price}<span>/MO</span></div>
                    </div>
                    <div className="plan-details" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ color: plan.highlight ? '#fff' : '#666', fontSize: '0.85rem', lineHeight: '1.6', flexGrow: 1, marginBottom: '2rem' }}>{plan.desc}</p>
                      <div style={{ marginTop: 'auto' }}>
                        <div className="detail-row"><span className="label">OUTPUT:</span><span>{plan.ram}</span></div>
                        <div className="detail-row"><span className="label">RIGHTS:</span><span>{plan.cpu}</span></div>
                        <button 
                          className={`deploy-btn ${plan.highlight ? 'primary' : 'outline'}`} 
                          style={{ width: '100%', marginTop: '1.5rem' }} 
                          onClick={() => handlePlanSelection(plan)}
                        >
                          {plan.name === 'ACCESS' ? 'SELECT BEATS' : (plan.directBuy ? 'BUY ACCESS NOW' : 'INITIALIZE PARTNERSHIP')}
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="knowledge" className="faq-section">
           <div className="faq-container">
             <Reveal><div className="faq-section-header"><h2 className="section-heading">// COMMON_QUESTIONS</h2><span className="entry-count">MISSION CONTROL</span></div></Reveal>
             <div className="faq-list">{faqs.map((faq, i) => (<Reveal key={i} delay={i * 0.1}><FAQItem question={faq.q} answer={faq.a} i={i} /></Reveal>))}</div>
           </div>
        </section>

        <footer className="footer">
          <div className="grid-overlay opacity-low" />
          <Reveal><h2 className="footer-logo">SLVSTR</h2><p style={{fontSize: '0.7rem', color: '#444', letterSpacing: '2px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto'}}>YOUR DEDICATED AUDIO DEPARTMENT. <br/>PORTUGAL BASED. GLOBAL SOUND.</p></Reveal>
          <div className="footer-links">
            <a href="https://instagram.com/slvstrbeats" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@slvstr3586" target="_blank" rel="noopener noreferrer">Youtube</a>
            <button 
                onClick={handleCopyEmail}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    font: 'inherit',
                    cursor: 'pointer',
                    padding: 0,
                    letterSpacing: 'inherit',
                    textTransform: 'uppercase'
                }}
            >
                {isEmailCopied ? "COPIED!" : "CONTACT"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}