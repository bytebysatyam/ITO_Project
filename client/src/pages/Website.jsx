import { useState, useEffect, useRef } from "react";

const COLORS = {
  cream: "#FAF8F3",
  white: "#FFFFFF",
  navy: "#0D1B3E",
  navyLight: "#1A2D5A",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  charcoal: "#2C2C2C",
  gray: "#6B7280",
  grayLight: "#F0EDE6",
  green: "#1A6B3C",
  greenLight: "#22863A",
  border: "#E2D9C8",
};

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Transport", href: "#transport" },
  { label: "Export", href: "#export" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    id: "stone",
    icon: "⬡",
    title: "Stone Aggregates",
    tagline: "Precision-graded for every civil requirement",
    color: "#5A6A7A",
    grades: ["10 mm", "20 mm", "30 mm", "40/60 mm", "Dust", "WMM"],
    description:
      "We supply premium crushed stone aggregates from certified quarries across Bihar and Bengal. Every batch is quality-checked with lab reports available. LOI requirement supported.",
    features: [
      "Multiple loading points across Jharkhand & Bihar",
      "Lab report available on request",
      "LOI / Purchase Order supported",
      "Bulk quantity dispatch — minimum 10 MT",
      "Transport coordination to your destination",
    ],
  },
  {
    id: "coal",
    icon: "◈",
    title: "Coal",
    tagline: "Industrial-grade supply for heavy operations",
    color: "#2C2C2C",
    grades: ["Non-Coking Coal", "Steam Coal", "Washery Grade"],
    description:
      "Reliable coal supply for industrial, brick kiln, and power usage. Grade and GCV specifications shared upon request. Bulk movement handled directly from source.",
    features: [
      "Verified source information shared on enquiry",
      "GCV specifications on request",
      "Bulk quantity — minimum 100 MT",
      "Pan-India transport support",
      "Industrial supply — kilns, boilers, factories",
    ],
  },
  {
    id: "tea",
    icon: "❧",
    title: "Tea",
    tagline: "From Assam gardens to global buyers",
    color: "#5C3D1E",
    grades: ["CTC Tea", "Orthodox Tea", "Assam Blend"],
    description:
      "ITO sources CTC and Orthodox tea from Assam's finest gardens. Available under our Prakriti brand or in bulk for private labelling. Export and domestic enquiries welcome.",
    features: [
      "Assam garden sourcing — Prakriti brand",
      "CTC and Orthodox varieties",
      "Bulk packaging for export",
      "Domestic and international supply",
      "Custom packaging enquiry accepted",
    ],
  },
  {
    id: "rice",
    icon: "✦",
    title: "Rice",
    tagline: "Basmati and non-basmati for global markets",
    color: "#8B7355",
    grades: ["Basmati", "Non-Basmati", "Parboiled"],
    description:
      "Premium rice supply for domestic distributors and export buyers. Multiple varieties available with full quality documentation. Bulk export enquiries welcome.",
    features: [
      "Basmati and non-basmati varieties",
      "Export-quality packaging",
      "Full quality documentation",
      "Bulk buyer pricing available",
      "Delivery term negotiation supported",
    ],
  },
  {
    id: "agro",
    icon: "❃",
    title: "Agro Products",
    tagline: "Direct from farm to international trade",
    color: "#3A6B2A",
    grades: ["Maize", "Food Grains", "Oil Seeds"],
    description:
      "ITO handles bulk agro commodity trade — maize, food grains, oil seeds and agricultural products. Export documentation, payment terms and delivery logistics managed end-to-end.",
    features: [
      "Maize, food grains, oil seeds",
      "Export enquiry accepted",
      "Bulk buyer registration available",
      "Payment and delivery term discussion",
      "International trade documentation support",
    ],
  },
];

// ─── Utility ─────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────
function Navbar({ onOpenChat }) {
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const solid = scrollY > 60;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: solid ? COLORS.navy : "transparent",
        borderBottom: solid ? `1px solid rgba(201,168,76,0.2)` : "none",
        transition: "background 0.4s, border 0.4s",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        {/* Logo */}
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 16,
              color: COLORS.navy,
              letterSpacing: "-0.5px",
            }}
          >
            ITO
          </div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15, lineHeight: 1.1, letterSpacing: "0.02em" }}>
              INDIA TRADE OVERSEAS
            </div>
            <div style={{ color: COLORS.gold, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              B2B Trading · Export · Logistics
            </div>
          </div>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="desktop-nav">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = COLORS.gold)}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onOpenChat}
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
              color: COLORS.navy,
              border: "none",
              padding: "9px 20px",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Request Quotation
          </button>
          <a
            href="/login"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "9px 16px",
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.04em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
            >
             Staff Login
            </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: COLORS.white, fontSize: 24, cursor: "pointer", display: "none" }}
          className="mobile-menu-btn"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: COLORS.navy,
            padding: "16px 24px 24px",
            borderTop: `1px solid rgba(201,168,76,0.2)`,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                padding: "12px 0",
                fontSize: 14,
                borderBottom: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); onOpenChat(); }}
            style={{
              marginTop: 16,
              width: "100%",
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
              color: COLORS.navy,
              border: "none",
              padding: "12px",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Request Quotation
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────
function Hero({ onOpenChat }) {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 55%, #1E3A5F 100%)`,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 60px",
      }}
    >
      {/* Background texture lines */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${i * 9}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: COLORS.gold,
            }}
          />
        ))}
      </div>

      {/* Gold accent blob */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(201,168,76,0.12)",
              border: `1px solid rgba(201,168,76,0.3)`,
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 32,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.gold }} />
            <span style={{ color: COLORS.gold, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
              India's Trusted B2B Trading Partner
            </span>
          </div>

          <h1
            style={{
              color: COLORS.white,
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Trading Power.{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Export Strength.
            </span>
            <br />
            Delivered.
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: 18,
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 580,
            }}
          >
            India Trade Overseas is a B2B trading and export organization supplying Stone Aggregates,
            Coal, Tea, Rice, Agro Products and Logistics solutions across India and international markets.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={onOpenChat}
              style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                color: COLORS.navy,
                border: "none",
                padding: "15px 32px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.04em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Request a Quotation
            </button>
            <a
              href="#products"
              style={{
                background: "transparent",
                color: COLORS.white,
                border: `1.5px solid rgba(255,255,255,0.3)`,
                padding: "15px 32px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.04em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Explore Products
            </a>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 64,
              paddingTop: 40,
              borderTop: `1px solid rgba(255,255,255,0.1)`,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "6+", label: "Product Divisions" },
              { value: "Pan-India", label: "Supply Network" },
              { value: "Export", label: "Ready Operations" },
              { value: "B2B", label: "Trusted Partner" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ color: COLORS.gold, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────
function About() {
  const ref = useRef(null);
  useInView(ref);
  return (
    <section id="about" style={{ background: COLORS.cream, padding: "96px 24px" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <FadeIn>
            <div
              style={{
                display: "inline-block",
                color: COLORS.gold,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
                borderBottom: `2px solid ${COLORS.gold}`,
                paddingBottom: 6,
              }}
            >
              About India Trade Overseas
            </div>
            <h2
              style={{
                color: COLORS.navy,
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              A Digital Head Office for India's B2B Trade
            </h2>
            <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
              India Trade Overseas was founded with a clear mission: to build a technology-driven trading
              organization that operates with corporate discipline, speed and transparency. We are not just
              a supplier — we are a structured business partner.
            </p>
            <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Every enquiry is tracked. Every quotation is approved by the Founder. Every dispatch is monitored.
              Every payment is followed up. We combine the reliability of a trading house with the speed of a
              technology company.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["Stone Aggregates", "Coal", "Tea", "Rice", "Agro Products", "Logistics"].map((t) => (
                <span
                  key={t}
                  style={{
                    background: COLORS.navy,
                    color: COLORS.gold,
                    padding: "6px 14px",
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            {/* Founder Vision Card */}
            <div
              style={{
                background: COLORS.navy,
                borderRadius: 16,
                padding: 40,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)`,
                }}
              />
              <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
                Founder's Vision
              </div>
              <div style={{ color: COLORS.white, fontSize: 48, lineHeight: 1, marginBottom: 16, opacity: 0.3 }}>"</div>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, lineHeight: 1.75, fontStyle: "italic", marginBottom: 28 }}>
                India Trade Overseas is building a digital command system where every customer enquiry,
                employee action, quotation approval and dispatch movement can be tracked, controlled and improved —
                reducing manual dependency and building scalable corporate operations.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: COLORS.navy,
                    fontSize: 16,
                  }}
                >
                  MR
                </div>
                <div>
                  <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15 }}>Md Ramiz Raza Khan</div>
                  <div style={{ color: COLORS.gold, fontSize: 12, letterSpacing: "0.06em" }}>Founder, India Trade Overseas</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Products ─────────────────────────────────────────
function ProductCard({ product, index, onEnquire }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={index * 0.08}>
      <div
        id={product.id}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: COLORS.white,
          borderRadius: 16,
          overflow: "hidden",
          border: `1.5px solid ${hovered ? COLORS.gold : COLORS.border}`,
          transition: "border 0.3s, box-shadow 0.3s, transform 0.3s",
          transform: hovered ? "translateY(-4px)" : "none",
          boxShadow: hovered ? "0 20px 60px rgba(13,27,62,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
          cursor: "pointer",
        }}
      >
        {/* Color bar */}
        <div
          style={{
            height: 5,
            background: `linear-gradient(90deg, ${product.color}, ${COLORS.gold})`,
          }}
        />

        <div style={{ padding: 28 }}>
          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: `${product.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: product.color,
                flexShrink: 0,
              }}
            >
              {product.icon}
            </div>
            <div>
              <h3 style={{ color: COLORS.navy, fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 4 }}>
                {product.title}
              </h3>
              <p style={{ color: COLORS.gold, fontSize: 12, fontStyle: "italic" }}>{product.tagline}</p>
            </div>
          </div>

          <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{product.description}</p>

          {/* Grades */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {product.grades.map((g) => (
              <span
                key={g}
                style={{
                  background: COLORS.grayLight,
                  color: COLORS.charcoal,
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Features */}
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
            {product.features.map((f) => (
              <li key={f} style={{ color: COLORS.charcoal, fontSize: 13, lineHeight: 1.6, display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: COLORS.gold, marginTop: 2 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onEnquire(product.title)}
            style={{
              width: "100%",
              background: COLORS.navy,
              color: COLORS.white,
              border: "none",
              padding: "11px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = COLORS.gold) && (e.target.style.color = COLORS.navy)}
            onMouseLeave={(e) => { e.target.style.background = COLORS.navy; e.target.style.color = COLORS.white; }}
          >
            Request Quotation →
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

function Products({ onEnquire }) {
  return (
    <section id="products" style={{ background: COLORS.grayLight, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>
              Our Product Divisions
            </div>
            <h2 style={{ color: COLORS.navy, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16 }}>
              Six Divisions. One Trusted Partner.
            </h2>
            <p style={{ color: COLORS.gray, fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              From raw materials to agro commodities — every division operates with structured enquiry,
              verified supply and Founder-approved quotations.
            </p>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onEnquire={onEnquire} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Transport ───────────────────────────────────────
function Transport() {
  return (
    <section id="transport" style={{ background: COLORS.navy, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <FadeIn>
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
              Transport & Logistics
            </div>
            <h2 style={{ color: COLORS.white, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Bulk Movement. Every Route. Handled.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
              ITO's logistics network covers Bihar, Jharkhand, Bengal, Assam, and Bhutan routes.
              We coordinate truck availability, loading/unloading and freight rate negotiation so
              your bulk material moves on time.
            </p>
            {[
              "Truck availability coordination",
              "Assam / Bihar / Bengal / Bhutan routes",
              "Loading and unloading support",
              "Bulk movement for stone, coal, agro",
              "Future integration with ITO Transport portal",
            ].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ color: COLORS.gold, marginTop: 2 }}>▸</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{f}</span>
              </div>
            ))}
            <div style={{ marginTop: 32 }}>
              <a
                href="#contact"
                style={{
                  display: "inline-block",
                  background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                  color: COLORS.navy,
                  padding: "13px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Contact Transport Team →
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Bihar", icon: "📍" },
                { label: "Jharkhand", icon: "📍" },
                { label: "West Bengal", icon: "📍" },
                { label: "Assam", icon: "📍" },
                { label: "Bhutan Routes", icon: "🛤️" },
                { label: "Pan-India", icon: "🌐" },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 12,
                    padding: 20,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
                  <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Export Enquiry ───────────────────────────────────
function ExportEnquiry({ onOpenChat }) {
  return (
    <section id="export" style={{ background: COLORS.cream, padding: "96px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
            Export Enquiries
          </div>
          <h2 style={{ color: COLORS.navy, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Ready to Supply International Buyers
          </h2>
          <p style={{ color: COLORS.gray, fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 48px" }}>
            India Trade Overseas handles export documentation, payment terms (LC, TT, DP),
            delivery terms (CIF, FOB, EXW) and custom packaging for international orders.
            Talk to our AI agent or contact us directly to start your export enquiry.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
            {[
              { label: "Payment Terms", value: "LC · TT · DP · DA" },
              { label: "Delivery Terms", value: "CIF · FOB · EXW" },
              { label: "Documentation", value: "Full Export Docs" },
              { label: "Products", value: "Tea · Rice · Agro" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: COLORS.white,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {item.label}
                </div>
                <div style={{ color: COLORS.navy, fontWeight: 700, fontSize: 16 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenChat}
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
              color: COLORS.navy,
              border: "none",
              padding: "15px 36px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Start Export Enquiry →
          </button>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Trust Section ────────────────────────────────────
function Trust() {
  return (
    <section style={{ background: COLORS.grayLight, padding: "64px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>
              Why India Trade Overseas
            </div>
            <h2 style={{ color: COLORS.navy, fontSize: 32, fontWeight: 800 }}>
              Corporate Discipline. Trading Speed.
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {[
            { icon: "🔐", title: "Founder-Approved Quotations", desc: "No pricing is shared without direct Founder approval." },
            { icon: "📊", title: "End-to-End Tracking", desc: "Every lead, dispatch and payment is monitored in real time." },
            { icon: "🤖", title: "AI-Powered Enquiry", desc: "Our AI agent collects your requirement and creates a qualified lead instantly." },
            { icon: "📋", title: "Structured CRM Workflow", desc: "14-stage pipeline from New Lead to Closed Won — nothing falls through." },
            { icon: "🛡️", title: "Data Protection", desc: "Customer and business data is masked, logged and protected at all times." },
            { icon: "🌐", title: "Export Ready", desc: "Full documentation, payment and delivery term support for international buyers." },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.07}>
              <div
                style={{
                  background: COLORS.white,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: 28,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ color: COLORS.navy, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: COLORS.gray, fontSize: 13, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────
function Contact({ onOpenChat }) {
  const [form, setForm] = useState({ name: "", company: "", phone: "", product: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone) return alert("Please fill name and phone number.");
    setSubmitted(true);
  };

  return (
    <section id="contact" style={{ background: COLORS.navy, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <FadeIn>
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
              Get In Touch
            </div>
            <h2 style={{ color: COLORS.white, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 24 }}>
              Send Us Your Requirement
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              Our team will review your enquiry and respond with pricing, availability and
              transport options within one business day.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Email", value: "enquiry@indiatradeoverseeas.com" },
                { label: "WhatsApp / Phone", value: "+91 XXXXX XXXXX" },
                { label: "Headquarters", value: "India Trade Overseas, India" },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(201,168,76,0.15)", border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: COLORS.gold, fontSize: 12 }}>◉</span>
                  </div>
                  <div>
                    <div style={{ color: COLORS.gold, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {submitted ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1.5px solid rgba(201,168,76,0.3)`,
                  borderRadius: 16,
                  padding: 48,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
                <h3 style={{ color: COLORS.gold, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Enquiry Received</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7 }}>
                  Thank you, {form.name}. Our team will contact you within one business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: 24, background: "transparent", border: `1px solid ${COLORS.gold}`, color: COLORS.gold, padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1.5px solid rgba(201,168,76,0.15)`,
                  borderRadius: 16,
                  padding: 36,
                }}
              >
                {[
                  { key: "name", label: "Your Name *", placeholder: "Full name" },
                  { key: "company", label: "Company Name", placeholder: "Company / Firm name" },
                  { key: "phone", label: "Phone / WhatsApp *", placeholder: "+91 XXXXX XXXXX" },
                  { key: "product", label: "Product Required", placeholder: "Stone Aggregates, Coal, Tea..." },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 8,
                        padding: "11px 14px",
                        color: COLORS.white,
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Message / Requirement
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Quantity, destination, delivery terms..."
                    rows={3}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      padding: "11px 14px",
                      color: COLORS.white,
                      fontSize: 14,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                    color: COLORS.navy,
                    border: "none",
                    padding: "13px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Send Enquiry →
                </button>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button
                    onClick={onOpenChat}
                    style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Or chat with our AI agent →
                  </button>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#070F22", padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: COLORS.navy }}>
                ITO
              </div>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>INDIA TRADE OVERSEAS</div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.75, maxWidth: 320 }}>
              A digital head office for India's B2B trade. Stone Aggregates, Coal, Tea, Rice,
              Agro Products and Logistics — structured, tracked and Founder-controlled.
            </p>
          </div>
          <div>
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              Products
            </div>
            {["Stone Aggregates", "Coal", "Tea", "Rice", "Agro Products", "Transport"].map((p) => (
              <div key={p} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8 }}>{p}</div>
            ))}
          </div>
          <div>
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              Company
            </div>
            {["About ITO", "Founder Vision", "Export Enquiry", "Contact Us", "Employee Login"].map((p) => (
              <div key={p} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8 }}>{p}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            © 2026 India Trade Overseas. All Rights Reserved. Confidential.
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            Founder: Md Ramiz Raza Khan
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── AI Chat Widget ───────────────────────────────────
const QUESTIONS = [
  { key: "product", text: "Which product are you interested in?", type: "options", options: ["Stone Aggregates", "Coal", "Tea", "Rice", "Agro Products", "Transport & Logistics", "Export Enquiry"] },
  { key: "quantity", text: "What quantity do you require? (e.g. 100 MT, 500 bags)" },
  { key: "destination", text: "What is your delivery destination?" },
  { key: "company", text: "What is your company / firm name?" },
  { key: "contact", text: "What is your name and mobile / WhatsApp number?" },
  { key: "payment", text: "What payment terms do you prefer? (e.g. advance, LC, TT)" },
];

function ChatWidget({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome to India Trade Overseas! 👋 I'm your digital sales assistant. I'll collect your requirement and create a qualified enquiry for our team. Let's start!" },
    { from: "bot", text: QUESTIONS[0].text, options: QUESTIONS[0].options },
  ]);
  const [input, setInput] = useState("");
  const [data, setData] = useState({});
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOption = (opt) => sendAnswer(opt);
  const handleSend = () => { if (input.trim()) sendAnswer(input.trim()); };

  const sendAnswer = (val) => {
    const q = QUESTIONS[step];
    const newMessages = [...messages, { from: "user", text: val }];
    const newData = { ...data, [q.key]: val };
    setData(newData);
    setInput("");

    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      const nextQ = QUESTIONS[nextStep];
      newMessages.push({ from: "bot", text: nextQ.text, options: nextQ.options });
      setStep(nextStep);
    } else {
      newMessages.push({
        from: "bot",
        text: `Thank you! Here is your enquiry summary:\n\n📦 Product: ${newData.product}\n📏 Quantity: ${newData.quantity}\n📍 Destination: ${newData.destination}\n🏢 Company: ${newData.company}\n📞 Contact: ${newData.contact}\n💰 Payment: ${newData.payment}\n\nYour lead has been created and assigned to our sales team. We will contact you within one business day. You can also reach us on WhatsApp.`,
      });
      setDone(true);
    }
    setMessages(newMessages);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 360,
        maxHeight: 560,
        background: COLORS.white,
        borderRadius: 16,
        boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
        overflow: "hidden",
        border: `1.5px solid ${COLORS.border}`,
      }}
    >
      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: COLORS.navy }}>
            AI
          </div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 13 }}>ITO Sales Assistant</div>
            <div style={{ color: COLORS.gold, fontSize: 11 }}>● Online now</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer" }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <div
              style={{
                maxWidth: "85%",
                marginLeft: m.from === "user" ? "auto" : 0,
                background: m.from === "user" ? COLORS.navy : COLORS.grayLight,
                color: m.from === "user" ? COLORS.white : COLORS.charcoal,
                padding: "10px 14px",
                borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                fontSize: 13,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
            {m.options && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {m.options.map((o) => (
                  <button
                    key={o}
                    onClick={() => handleOption(o)}
                    style={{
                      background: "transparent",
                      border: `1.5px solid ${COLORS.navy}`,
                      color: COLORS.navy,
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!done && (
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your answer..."
            style={{
              flex: 1,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 13,
              outline: "none",
              color: COLORS.charcoal,
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: COLORS.navy,
              color: COLORS.white,
              border: "none",
              borderRadius: 8,
              padding: "9px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            →
          </button>
        </div>
      )}
      {done && (
        <div style={{ padding: 16, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            style={{
              flex: 1,
              background: "#25D366",
              color: COLORS.white,
              textDecoration: "none",
              textAlign: "center",
              padding: "10px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            📱 WhatsApp Us
          </a>
          <button
            onClick={() => { setMessages([{ from: "bot", text: "Welcome back! Let's start a new enquiry." }, { from: "bot", text: QUESTIONS[0].text, options: QUESTIONS[0].options }]); setStep(0); setData({}); setDone(false); }}
            style={{ background: COLORS.grayLight, border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 12, color: COLORS.navy, fontWeight: 600 }}
          >
            New Enquiry
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Chat FAB ─────────────────────────────────────────
function ChatFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
        border: "none",
        boxShadow: "0 8px 32px rgba(201,168,76,0.45)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        zIndex: 199,
        color: COLORS.navy,
        fontWeight: 800,
      }}
      title="Chat with AI Agent"
    >
      💬
    </button>
  );
}

// ─── App ──────────────────────────────────────────────
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  const openChat = () => {
    setChatOpen(true);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: COLORS.cream }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 900px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          section > div > div[style*="grid-template-columns: 2fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Navbar onOpenChat={() => setChatOpen(true)} />
      <Hero onOpenChat={() => setChatOpen(true)} />
      <About />
      <Products onEnquire={openChat} />
      <Transport />
      <ExportEnquiry onOpenChat={() => setChatOpen(true)} />
      <Trust />
      <Contact onOpenChat={() => setChatOpen(true)} />
      <Footer />

      {chatOpen ? (
        <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
      ) : (
        <ChatFAB onClick={() => setChatOpen(true)} />
      )}
    </div>
  );
}
