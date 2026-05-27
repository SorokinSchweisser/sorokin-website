"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "./components/Logo";

/* ── Google Reviews API types ── */
interface LiveReview {
  name: string;
  initials: string;
  date: string;
  text: string;
  photo: string | null;
  rating: number;
}
interface ReviewsApiResponse {
  configured: boolean;
  reviews?: LiveReview[];
  rating?: number | null;
  total?: number;
  error?: string;
  message?: string;
}

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Data ── */
const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    title: "Professionelle Schweißarbeiten",
    desc: "Professionelle Schweißarbeiten für Stahl, Edelstahl und Aluminium, direkt vor Ort ausgeführt: in Ihrer Werkstatt, auf der Baustelle oder im Betrieb.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    title: "Reparatur beschädigter Metallteile",
    desc: "Was andere aufgeben, repariere ich direkt bei Ihnen vor Ort: gebrochene Bauteile, Risse und Brüche. Ohne Transportaufwand, schnell erledigt und dauerhaft haltbar.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: "Ersatzteilanfertigung nach Vorlage",
    desc: "Fehlt das Original? Ich fertige Ersatzteile nach Vorlage, Zeichnung oder Muster und stelle selbst vergriffene Teile wieder her.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Einzelanfertigungen & Kleinserien",
    desc: "Vom Einzelstück bis zur kleinen Serie setze ich Ihre Ideen in Metall um, präzise gefertigt und termingerecht geliefert.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Mobiler Vor-Ort-Service",
    desc: "Mit kompletter Ausrüstung komme ich direkt zu Ihnen in die Werkstatt, auf die Baustelle oder ins Unternehmen. Transport ist nicht erforderlich.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Versand & Lieferung möglich",
    desc: "Sie können Teile einsenden und fertig repariert zurückerhalten. Bundesweiter Versand ist auf Anfrage möglich.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="1.75" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 3v18M20 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7v10M14 7v10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 17h16" />
      </svg>
    ),
    title: "Geländer, Tore & Stahlkonstruktionen",
    desc: "Geländer, Tore und Zäune fertige ich nach Maß und montiere sie direkt vor Ort. Treppengeländer, Hoftore oder Absperrungen: langlebig verschweißt, passgenau und sofort einsatzbereit.",
  },
];

const uspItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Zertifiziert nach DIN EN ISO 9606-1",
    desc: "Geprüfte Schweißerqualifikation",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Langjährige Berufserfahrung",
    desc: "Erfahrung, die man sieht und spürt",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Flexibel & kurzfristig verfügbar",
    desc: "Flexibler Einsatz im Sauerland & bundesweit",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Faire Preise & saubere Arbeit",
    desc: "Transparente Kalkulation, keine Überraschungen",
  },
];

const galleryImages = [
  "/WhatsApp%20Image%202026-05-21%20at%2015.50.11.jpeg",
  "/PHOTO-2026-05-21-22-38-23.jpg",
  "/PHOTO-2026-05-21-22-38-31.jpg",
  "/PHOTO-2026-05-21-22-38-32.jpg",
  "/PHOTO-2026-05-21-22-38-33.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%202.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%203.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%204.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%205.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%206.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%207.jpg",
  "/PHOTO-2026-05-21-22-38-33%20Kopie%208.jpg",
  "/PHOTO-2026-05-21-22-38-34.jpg",
  "/PHOTO-2026-05-21-22-38-34%20Kopie.jpg",
  "/PHOTO-2026-05-21-22-38-34%20Kopie%202.jpg",
  "/PHOTO-2026-05-21-22-38-34%20Kopie%203.jpg",
  "/PHOTO-2026-05-21-22-46-33.jpg",
  "/PHOTO-2026-05-21-22-46-33%20Kopie.jpg",
  "/PHOTO-2026-05-21-22-46-33%20Kopie%202.jpg",
  "/PHOTO-2026-05-21-22-46-33%20Kopie%203.jpg",
  "/PHOTO-2026-05-21-22-46-34.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie%202.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie%203.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie%204.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie%205.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie%206.jpg",
  "/PHOTO-2026-05-21-22-46-34%20Kopie%207.jpg",
];

const reviews: Array<{ name: string; initials: string; date: string; text: string; photo?: string }> = [
  { name: "Klaus-Dieter Hoffmann", initials: "KH", date: "vor 2 Wochen", text: "Absolut top! Konstantin kam innerhalb von 2 Stunden zu uns, hat die gebrochene Achskonstruktion am Anhänger perfekt repariert. Keine Schlacke, keine Nacharbeit. Klare Weiterempfehlung!" },
  { name: "Sandra Brinkmann", initials: "SB", date: "vor 1 Monat", text: "Unser altes Schmiedeeisengitter war komplett verrostet und gerissen. Herr Sorokin hat es wie neu gemacht – man sieht keine Schweißnaht mehr. Professionell und fair im Preis." },
  { name: "Thomas Lüttger", initials: "TL", date: "vor 3 Wochen", text: "Industrieschweißarbeiten an unserer Produktionsanlage. Termingerecht, sauber, DIN-konform. Wir arbeiten jetzt dauerhaft mit Sorokin zusammen." },
  { name: "Monika Schneider", initials: "MS", date: "vor 5 Wochen", text: "Pforte und Zaunfeld repariert. Herr Sorokin ist super nett, hat alles erklärt und das Ergebnis übertrifft meine Erwartungen. Kommt direkt vorbei – perfekter Service!" },
  { name: "Dirk Kessler", initials: "DK", date: "vor 1 Monat", text: "WIG-Schweißen an Edelstahlgeländern – absolut makellose Nähte. Man sieht, dass hier jemand sein Handwerk wirklich liebt. 10 von 10 Punkten." },
  { name: "Ute Bergmann", initials: "UB", date: "vor 6 Wochen", text: "Superflexibel und mobil – Herr Sorokin kam direkt auf unser Grundstück. Schweißarbeiten an einem Gartenpavilion, alles perfekt erledigt. Preis-Leistung unschlagbar!" },
  { name: "Andreas Völker", initials: "AV", date: "vor 2 Monaten", text: "Reparatur an einem Baumaschinenrahmen. Andere Firmen haben abgesagt, Herr Sorokin hat es gemacht – und zwar erstklassig. Hält bis heute problemlos. Herzlichen Dank!" },
];

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="#f97316" className="w-4 h-4">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ══════════════════════════════════════════════ MAIN COMPONENT */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", telefon: "", email: "", beschreibung: "" });
  const [sent, setSent] = useState(false);
  const [modal, setModal] = useState<"impressum" | "datenschutz" | null>(null);
  const [liveData, setLiveData] = useState<ReviewsApiResponse | null>(null);

  useReveal();

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: ReviewsApiResponse) => setLiveData(data))
      .catch(() => { /* silently fall back to static reviews */ });
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const subject = encodeURIComponent(`Anfrage von ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nTelefon: ${formData.telefon}\nE-Mail: ${formData.email}\n\nAuftragsbeschreibung:\n${formData.beschreibung}`
    );
    window.location.href = `mailto:schweisserservice24@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const displayReviews = liveData?.reviews ?? reviews;
  const displayRating = liveData?.rating ?? 5.0;
  const displayTotal = liveData?.total ?? reviews.length;

  const navLinks = [
    { href: "#leistungen", label: "Leistungen" },
    { href: "#galerie", label: "Galerie" },
    { href: "#bewertungen", label: "Bewertungen" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  return (
    <div style={{ background: "#fff", color: "#111827" }}>

      {/* ══ NAVBAR ══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "nav-scrolled" : ""}`}
        style={{ background: scrolled ? undefined : "transparent" }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-18" style={{ height: 72 }}>

            <a href="#" className="flex-shrink-0 transition-opacity hover:opacity-80">
              <Logo size="sm" variant={scrolled ? "dark" : "light"} />
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-semibold tracking-wide transition-colors relative group ${
                    scrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white"
                  }`}
                >
                  {l.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: "#f97316" }}
                  />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:015114459165"
                className={`btn-orange hidden sm:inline-flex px-5 py-2.5 rounded-full text-sm font-bold`}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                01511 4459165
              </a>

              <button
                className={`md:hidden p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menü öffnen"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu md:hidden">
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-blue-600 py-1 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="tel:015114459165"
                className="btn-orange px-5 py-3 rounded-full text-sm font-bold mt-2 justify-center"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                01511 4459165
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* Background image */}
        <div className="absolute inset-0 hero-img">
          <Image
            src="/1c7885fd-0c4f-40ad-bf3a-bc579185acc9.jpg"
            alt="SOROKIN Schweißservice – professionelle Schweißarbeiten"
            fill
            style={{ objectFit: "cover", objectPosition: "center center" }}
            priority
            quality={90}
            sizes="100vw"
          />
        </div>

        {/* Solid overlay – 65% dark, hides all printed truck text */}
        <div className="absolute inset-0" style={{ background: "rgba(6, 12, 24, 0.65)" }} />

        {/* Content */}
        <div
          className="relative z-10 w-full max-w-7xl mx-auto"
          style={{ padding: "9rem 3rem 9rem", textAlign: "center" }}
        >
          {/* ISO badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#93c5fd",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            <svg viewBox="0 0 20 20" fill="#f97316" style={{ width: 14, height: 14, flexShrink: 0 }}>
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            DIN EN ISO 9606-1 Zertifiziert
          </div>

          {/* Headline – every line its own block */}
          <h1 style={{ margin: "0 0 28px 0", padding: 0 }}>
            <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.15, color: "#ffffff", letterSpacing: "-0.01em" }}>
              Schweißen &amp;
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.15, color: "#ffffff", letterSpacing: "-0.01em" }}>
              Metallreparatur
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.15, color: "#E8650A", letterSpacing: "-0.01em" }}>
              Präzise.
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.15, color: "#ffffff", letterSpacing: "-0.01em" }}>
              Zuverlässig.
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.15, color: "#3B82F6", letterSpacing: "-0.01em" }}>
              Professionell.
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "1.05rem",
              color: "#a8b8cc",
              lineHeight: 1.65,
              marginBottom: 44,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Mobiler Schweißservice direkt bei Ihnen vor Ort,
            ob auf der Baustelle, im Betrieb oder in der Werkstatt.
          </p>

          {/* CTA button */}
          <a
            href="#kontakt"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "15px 38px",
              borderRadius: 999,
              background: "#E8650A",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.03em",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(232,101,10,0.5)",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#cf5808";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 28px rgba(232,101,10,0.6)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#E8650A";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 20px rgba(232,101,10,0.5)";
            }}
          >
            Jetzt Anfrage stellen
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 17, height: 17 }}>
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </section>

      {/* ══ USP BAR ══ */}
      <section style={{ background: "#f8f8f8", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {uspItems.map((item, i) => (
              <div key={i} className={`usp-item flex flex-col items-center text-center gap-3 reveal delay-${i + 1}`}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(29,111,168,0.08)", border: "1px solid rgba(29,111,168,0.14)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-sm leading-snug" style={{ color: "#111827" }}>{item.title}</div>
                  <div className="text-xs mt-1" style={{ color: "#6b7280" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ISO CERTIFICATION BAND ══ */}
      <section className="py-14" style={{ background: "#fff" }}>
        <div className="max-w-lg mx-auto px-6 flex justify-center reveal">
          <div
            className="flex flex-col sm:flex-row items-center gap-5 w-full px-10 py-7 rounded-2xl text-center sm:text-left"
            style={{ background: "#fff", border: "2px solid #1d6fa8", boxShadow: "0 4px 24px rgba(29,111,168,0.10)" }}
          >
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(29,111,168,0.08)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d6fa8" strokeWidth="2" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>
                Zertifiziert nach
              </div>
              <div className="font-black text-2xl leading-tight" style={{ color: "#1d6fa8" }}>
                DIN EN ISO 9606-1
              </div>
              <div className="text-sm mt-1" style={{ color: "#4b5563" }}>
                Geprüfte Schweißerqualifikation für Ergebnisse, die dauerhaft halten.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LEISTUNGEN ══ */}
      <section id="leistungen" className="py-24 md:py-32" style={{ background: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <div className="flex justify-center mb-5">
              <div className="section-line" />
            </div>
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>
              Leistungen
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111827" }}
            >
              Was ich für Sie mache
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "#6b7280" }}>
              Präzise Schweißarbeiten für jeden Bedarf: von der schnellen Reparatur bis zur Kleinserie.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              i === 0 ? (
                /* ── Featured first card – full width ── */
                <div
                  key={s.title}
                  className="service-card col-span-full p-8 md:p-10 reveal delay-1"
                  style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                >
                  <div className="grid lg:grid-cols-2 gap-8 items-start">

                    {/* Left column */}
                    <div>
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                        style={{ background: "rgba(29,111,168,0.07)", border: "1px solid rgba(29,111,168,0.12)" }}
                      >
                        {s.icon}
                      </div>
                      <h3 className="font-black text-2xl mb-1 leading-tight" style={{ color: "#111827" }}>
                        {s.title}
                      </h3>
                      <p className="text-base font-semibold mb-5" style={{ color: "#1d6fa8" }}>
                        für Stahl, Edelstahl &amp; Aluminium
                      </p>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: "#4b5563" }}>
                        {s.desc}
                      </p>
                      {/* Material chips */}
                      <div className="flex flex-wrap gap-2">
                        {["Stahl", "Edelstahl", "Aluminium"].map((m) => (
                          <span
                            key={m}
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: "rgba(29,111,168,0.08)", color: "#1d6fa8", border: "1px solid rgba(29,111,168,0.18)" }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right column */}
                    <div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>
                        Mit <strong style={{ color: "#111827" }}>WIG-Schweißen (141)</strong> entstehen
                        präzise, saubere Schweißnähte, die besonders für Edelstahl und Aluminium geeignet sind.{" "}
                        <strong style={{ color: "#111827" }}>MIG/MAG-Schweißen (131/135)</strong> ist
                        die ideale Methode für stabile Stahlkonstruktionen, Reparaturen und robuste Metallarbeiten.
                      </p>
                      <p className="text-sm leading-relaxed mb-7" style={{ color: "#6b7280" }}>
                        Ob Geländer, Reparaturen, Sonderanfertigungen oder Metallkonstruktionen:
                        Ich liefere zuverlässige Ergebnisse direkt vor Ort und bin auch als
                        Subunternehmer für Betriebe und Handwerksfirmen einsetzbar.
                      </p>
                      {/* Process tags */}
                      <div className="flex flex-wrap gap-2">
                        {["WIG · 141", "MIG / MAG · 131/135", "Mobil vor Ort"].map((p) => (
                          <span
                            key={p}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: "rgba(232,101,10,0.08)", color: "#E8650A", border: "1px solid rgba(232,101,10,0.2)" }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Regular cards ── */
                <div
                  key={s.title}
                  className={`service-card p-8 reveal delay-${i + 1}`}
                  style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(29,111,168,0.07)", border: "1px solid rgba(29,111,168,0.12)" }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3 leading-snug" style={{ color: "#111827" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                    {s.desc}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ══ ÜBER UNS ══ */}
      <section id="ueber-uns" className="py-24 md:py-32" style={{ background: "#f5f5f7" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">

            {/* Left – Portrait */}
            <div className="reveal-left flex justify-center">
              <div className="relative">
                {/* Warm orange glow */}
                <div
                  className="absolute -inset-5 rounded-3xl"
                  style={{ background: "linear-gradient(135deg, rgba(232,101,10,0.18) 0%, rgba(29,111,168,0.10) 100%)", filter: "blur(24px)" }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden group"
                  style={{ width: 420, height: 540, border: "2px solid rgba(232,101,10,0.3)", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
                >
                  <Image
                    src="/WhatsApp%20Image%202026-05-21%20at%2015.50.11%20Kopie%202.jpeg"
                    alt="Konstantin Sorokin – Mobiler Schweißfachmann"
                    fill
                    className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    style={{ background: "linear-gradient(to top, rgba(5,10,20,0.95) 0%, rgba(5,10,20,0.3) 60%, transparent 100%)" }}
                  >
                    <div className="font-black text-white text-xl tracking-tight">Konstantin Sorokin</div>
                    <div className="text-sm font-semibold mt-1" style={{ color: "#E8650A" }}>
                      Mobiler Schweißfachmann
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {["WIG", "MAG", "E-Schweißen"].map((v) => (
                        <span
                          key={v}
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ background: "rgba(232,101,10,0.25)", color: "#fbbf24", border: "1px solid rgba(232,101,10,0.4)" }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right – Text */}
            <div className="reveal-right">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#E8650A" }}>
                Über mich
              </p>
              <div className="section-line mb-6" />
              <h2 className="font-black mb-7 leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#111827" }}>
                <span style={{ display: "block" }}>Ein Handwerker.</span>
                <span style={{ display: "block", color: "#1d6fa8" }}>Eine Leidenschaft.</span>
                <span style={{ display: "block" }}>Perfekte Schweißnähte.</span>
              </h2>

              <p className="text-base leading-relaxed mb-5" style={{ color: "#374151" }}>
                Konstantin Sorokin kommt mit kompletter Ausrüstung direkt zu Ihnen: in die Werkstatt,
                auf die Baustelle oder in den Betrieb. Für Sie entsteht dabei kein Transportaufwand.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#6b7280" }}>
                Mit langjähriger Berufserfahrung in WIG-, MAG- und E-Schweißen löst er zuverlässig,
                was andere aufgeben: von der schnellen Reparatur bis zur komplexen Industriearbeit.
                Er arbeitet präzise, termintreu und zuverlässig, auch als Subunternehmer
                für Betriebe und Handwerksfirmen.
              </p>

              {/* Feature list */}
              <div className="space-y-3 mb-9">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 20 20" fill="#E8650A" className="w-4 h-4">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    ),
                    text: "Mobiler Einsatz direkt bei Ihnen vor Ort",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 20 20" fill="#E8650A" className="w-4 h-4">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    ),
                    text: "Kurzfristig verfügbar mit schnellen Reaktionszeiten",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 20 20" fill="#E8650A" className="w-4 h-4">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ),
                    text: "Präzise Schweißnähte und Qualität, die dauerhaft hält",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 20 20" fill="#E8650A" className="w-4 h-4">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    ),
                    text: "Auch als Subunternehmer für Betriebe einsetzbar",
                  },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(232,101,10,0.08)", border: "1px solid rgba(232,101,10,0.18)" }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#374151" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Stat badges */}
              <div className="flex flex-wrap gap-4">
                {[
                  { n: "WIG · MAG · E", l: "Schweißverfahren" },
                  { n: "Mobil", l: "Vor-Ort-Service" },
                  { n: "100 %", l: "Qualitätsanspruch" },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="px-5 py-4 rounded-xl"
                    style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
                  >
                    <div className="font-black text-lg leading-tight" style={{ color: "#1d6fa8" }}>{s.n}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ GALERIE ══ */}
      <section id="galerie" className="py-24 md:py-32" style={{ background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="flex justify-center mb-5">
              <div className="section-line" />
            </div>
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>
              Galerie
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111827" }}
            >
              Einblicke in meine Arbeit
            </h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: "#6b7280" }}>
              Echte Aufträge, echte Ergebnisse. Überzeugen Sie sich selbst von handwerklicher Präzision.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 reveal">
            {galleryImages.map((src) => (
              <div key={src} className="gallery-item" style={{ height: 180 }}>
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt="Schweißarbeit – SOROKIN Metallservice"
                    fill
                    style={{ objectFit: "cover" }}
                    quality={70}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BEWERTUNGEN ══ */}
      <section id="bewertungen" className="py-24 md:py-32" style={{ background: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="flex justify-center mb-5">
              <div className="section-line" />
            </div>
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>
              Google Bewertungen
            </p>
            <h2
              className="font-black leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111827" }}
            >
              Was Kunden sagen
            </h2>
            {/* Score */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl font-black" style={{ color: "#f97316" }}>{displayRating.toFixed(1)}</span>
              <div className="text-left">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <div className="text-sm" style={{ color: "#6b7280" }}>{displayTotal} Bewertungen · Google</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayReviews.map((r, i) => (
              <div
                key={r.name}
                className={`review-card reveal delay-${(i % 4) + 1}`}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  borderRadius: 16,
                  padding: "20px 22px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {/* Header: avatar + name/date + Google logo */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar – photo or initials */}
                    <div className="relative flex-shrink-0">
                      {r.photo ? (
                        <img
                          src={r.photo}
                          alt={r.name}
                          width={44}
                          height={44}
                          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1d6fa8 0%, #2563eb 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {r.initials}
                        </div>
                      )}
                      {/* Google badge overlay */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: -2,
                          right: -2,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg viewBox="0 0 24 24" style={{ width: 10, height: 10 }}>
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      </div>
                    </div>
                    {/* Name + date */}
                    <div>
                      <div className="font-semibold text-sm leading-tight" style={{ color: "#111827" }}>{r.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{r.date}</div>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>

                {/* Review text */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#374151" }}>
                  {r.text}
                </p>
              </div>
            ))}

            {/* Google summary card */}
            <div
              className="review-card reveal delay-4 flex flex-col items-center justify-center text-center"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: "28px 22px",
              }}
            >
              <svg viewBox="0 0 48 48" style={{ width: 36, height: 36, marginBottom: 12 }}>
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 16.5 19.3 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z" />
                <path fill="#FBBC05" d="M24 46c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.7 37.7 27 38.5 24 38.5c-6 0-11.1-4-12.9-9.5l-7.1 5.5C7.7 42.1 15.3 46 24 46z" />
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.5-2.6 4.6-4.8 6l6.5 5.3C41.4 36 44.5 30.4 44.5 24c0-1.3-.2-2.7-.5-4z" />
              </svg>
              <div className="font-black text-4xl mb-1" style={{ color: "#f97316", lineHeight: 1 }}>{displayRating.toFixed(1)}</div>
              <div className="flex gap-0.5 justify-center my-2">
                {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
              </div>
              <div className="font-semibold text-sm mt-1" style={{ color: "#111827" }}>Google Bewertung</div>
              <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>{displayTotal} verifizierte Bewertungen</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ KONTAKT ══ */}
      <section id="kontakt" className="py-24 md:py-32" style={{ background: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <div className="flex justify-center mb-5">
              <div className="section-line" />
            </div>
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>
              Kontakt
            </p>
            <h2
              className="font-black leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111827" }}
            >
              Kontakt aufnehmen
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#6b7280" }}>
              Kontaktieren Sie mich per Anruf, WhatsApp oder Nachricht.
              Ich melde mich schnell zurück.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left – contact info */}
            <div className="reveal-left space-y-5">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: "Telefon",
                  value: "01511 4459165",
                  href: "tel:015114459165",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "E-Mail",
                  value: "schweisserservice24@gmail.com",
                  href: "mailto:schweisserservice24@gmail.com",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  ),
                  label: "Einsatzgebiet",
                  value: "Menden, Sauerland und Umgebung. Mobiler Einsatz auch überregional.",
                  href: "",
                },
              ].map((item) => (
                item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 p-5 rounded-2xl group transition-all duration-250 hover:shadow-md"
                  style={{ background: "#fff", border: "1px solid #e5e7eb" }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(29,111,168,0.08)", color: "#1d6fa8" }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>
                      {item.label}
                    </div>
                    <div className="font-semibold text-sm break-all" style={{ color: "#111827" }}>
                      {item.value}
                    </div>
                  </div>
                </a>
                ) : (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: "#fff", border: "1px solid #e5e7eb" }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(29,111,168,0.08)", color: "#1d6fa8" }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>
                      {item.label}
                    </div>
                    <div className="font-semibold text-sm" style={{ color: "#111827" }}>
                      {item.value}
                    </div>
                  </div>
                </div>
                )
              ))}

              {/* WhatsApp CTA – Premium */}
              <div>
                {/* Trust header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div
                    className="animate-pulse"
                    style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#6b7280" }}>
                    Direkter Kontakt · Konstantin Sorokin
                  </span>
                </div>

                <a
                  href="https://wa.me/4915114459165"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "16px 22px",
                    borderRadius: 14,
                    background: "#25D366",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.975rem",
                    letterSpacing: "0.01em",
                    textDecoration: "none",
                    boxShadow: "0 6px 22px rgba(37,211,102,0.30), 0 1px 4px rgba(0,0,0,0.08)",
                    transition: "background 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "#1da851";
                    el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = "0 12px 34px rgba(37,211,102,0.40), 0 1px 4px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "#25D366";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 6px 22px rgba(37,211,102,0.30), 0 1px 4px rgba(0,0,0,0.08)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, flexShrink: 0 }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Auf WhatsApp schreiben
                  </div>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, opacity: 0.7, flexShrink: 0 }}>
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>

                {/* Trust micro-row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 10, gap: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>
                    <svg viewBox="0 0 20 20" fill="#22c55e" style={{ width: 11, height: 11, flexShrink: 0 }}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Ø Antwort &lt; 2 Stunden
                  </span>
                  <span style={{ width: 1, height: 10, background: "#e5e7eb", margin: "0 10px" }} />
                  <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>Persönliche Rückmeldung</span>
                </div>
              </div>

              {/* Availability */}
              <div
                className="p-4 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#22c55e" }} />
                <p className="text-sm font-medium" style={{ color: "#15803d" }}>
                  Aktuell verfügbar für neue Aufträge im Sauerland und Umgebung.
                </p>
              </div>
            </div>

            {/* Right – form */}
            <div className="reveal-right">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 space-y-5"
                style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
              >
                {sent ? (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-2" style={{ color: "#111827" }}>Anfrage gesendet!</h3>
                    <p style={{ color: "#6b7280" }}>Ich melde mich schnellstmöglich bei Ihnen.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-xl" style={{ color: "#111827" }}>Kostenlose Anfrage</h3>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#374151" }}>
                        Ihr Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Max Mustermann"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input px-4 py-3"
                        style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#374151" }}>
                          Telefon
                        </label>
                        <input
                          type="tel"
                          placeholder="0123 456789"
                          value={formData.telefon}
                          onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                          className="form-input px-4 py-3"
                          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#374151" }}>
                          E-Mail *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="ihre@email.de"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="form-input px-4 py-3"
                          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#374151" }}>
                        Auftragsbeschreibung *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Beschreiben Sie Ihren Auftrag: Material, Umfang, Ort..."
                        value={formData.beschreibung}
                        onChange={(e) => setFormData({ ...formData, beschreibung: e.target.value })}
                        className="form-input px-4 py-3 resize-none"
                        style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
                      />
                    </div>

                    {/* Submit – Premium */}
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: "16px 28px",
                        borderRadius: 12,
                        background: "#E8650A",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.975rem",
                        letterSpacing: "0.02em",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 6px 22px rgba(232,101,10,0.32), 0 1px 4px rgba(0,0,0,0.08)",
                        transition: "background 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "#cf5808";
                        el.style.transform = "translateY(-2px)";
                        el.style.boxShadow = "0 12px 34px rgba(232,101,10,0.42), 0 1px 4px rgba(0,0,0,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "#E8650A";
                        el.style.transform = "translateY(0)";
                        el.style.boxShadow = "0 6px 22px rgba(232,101,10,0.32), 0 1px 4px rgba(0,0,0,0.08)";
                      }}
                    >
                      Jetzt Anfrage stellen
                      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 17, height: 17, flexShrink: 0 }}>
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Trust strip */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>
                        <svg viewBox="0 0 20 20" fill="#9ca3af" style={{ width: 11, height: 11, flexShrink: 0 }}>
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Vertraulich
                      </span>
                      <span style={{ width: 1, height: 10, background: "#e5e7eb", margin: "0 10px" }} />
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>Keine Weitergabe</span>
                      <span style={{ width: 1, height: 10, background: "#e5e7eb", margin: "0 10px" }} />
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>* Pflichtfelder</span>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAPS ══ */}
      <section style={{ background: "#0f172a", padding: "72px 0 80px" }}>
        <div className="max-w-5xl mx-auto px-6">

          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="font-black text-2xl sm:text-3xl" style={{ color: "#ffffff", marginBottom: 14 }}>
              Mein Standort
            </h2>
            <div style={{ width: 44, height: 3, background: "#E8650A", borderRadius: 2, margin: "0 auto" }} />
          </div>

          {/* Map */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid #E8650A", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
            <iframe
              title="SOROKIN Mobiler Schweißservice – Menden"
              src="https://maps.google.com/maps?q=Regerstra%C3%9Fe+24,+58710+Menden&output=embed&hl=de&z=15"
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)", borderTop: "3px solid #E8650A" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">

            {/* Left – Logo + tagline + desc */}
            <div>
              <Logo size="sm" variant="light" />
              <p className="mt-4 text-sm font-semibold" style={{ color: "#94a3b8" }}>
                Mobiler Schweißservice · Menden (Sauerland)
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Mobiler Schweißservice direkt bei Ihnen vor Ort, für Industrie, Gewerbe und Privatkunden.
              </p>
            </div>

            {/* Middle – Nav */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#475569" }}>
                Navigation
              </h4>
              <div className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="footer-link text-sm font-medium"
                    style={{ color: "#cbd5e1" }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right – Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#475569" }}>
                Kontakt
              </h4>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:015114459165"
                  className="footer-link flex items-center gap-2 text-sm"
                  style={{ color: "#cbd5e1" }}
                >
                  <svg viewBox="0 0 20 20" fill="#E8650A" className="w-4 h-4 flex-shrink-0">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  01511 4459165
                </a>
                <a
                  href="https://wa.me/4915114459165"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link flex items-center gap-2 text-sm"
                  style={{ color: "#cbd5e1" }}
                >
                  <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="mailto:schweisserservice24@gmail.com"
                  className="footer-link flex items-center gap-2 text-sm break-all"
                  style={{ color: "#cbd5e1" }}
                >
                  <svg viewBox="0 0 20 20" fill="#E8650A" className="w-4 h-4 flex-shrink-0">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  schweisserservice24@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar – slightly darker */}
        <div style={{ background: "#0f0f1a" }}>
          <div
            className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            style={{ color: "#475569" }}
          >
            <span>© 2026 SOROKIN Mobiler Schweißservice · Konstantin Sorokin</span>
            <div className="flex gap-5">
              <button
                onClick={() => setModal("impressum")}
                className="footer-link"
                style={{ color: "#64748b" }}
              >
                Impressum
              </button>
              <button
                onClick={() => setModal("datenschutz")}
                className="footer-link"
                style={{ color: "#64748b" }}
              >
                Datenschutz
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ MODAL ══ */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl p-8"
            style={{ background: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: "#6b7280" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-black text-xl mb-4" style={{ color: "#111827" }}>
              {modal === "impressum" ? "Impressum" : "Datenschutzerklärung"}
            </h3>
            <p style={{ color: "#6b7280" }}>
              {modal === "impressum"
                ? "Impressum wird in Kürze ergänzt."
                : "Datenschutzerklärung wird in Kürze ergänzt."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
