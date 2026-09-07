import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Code2, GitBranch as Github, Hand, HeartPulse, Layers3, Menu, Pause, Play, Smartphone, Waves, X, Zap } from "lucide-react";

const github = "https://github.com/Ameya5006";
const projects = [
  { id: "01", name: "GymFlow", kind: "FREELANCE / FULL-STACK", className: "gym", headline: <>Two gyms.<br />One flow.</>, description: "A production platform for Fitness First Boxing Club and Nisha Fitness. Memberships, admin dashboards, and the busywork—automated.", tags: ["React 19", "TypeScript", "Firebase", "Apps Script"], details: "Firebase Auth + Firestore · Google Sheets sync · WhatsApp reminders · UPI payments · Tailwind CSS · Vite · Vercel", repo: "/Dual-gym-website", live: "https://boxingguruji.vercel.app/", icon: Zap },
  { id: "02", name: "PalmChef", kind: "AI-POWERED / WEB APP", className: "palm", headline: <>Messy hands.<br />Clean controls.</>, description: "A hands-free kitchen assistant. Navigate with gestures, listen to recipes, and keep cooking without touching the screen.", tags: ["React 18", "MediaPipe", "Gemini", "MongoDB"], details: "Express + Node.js · JWT · Zustand · PDF.js · Web Speech API · Timers · Offline PWA · Docker · Nginx · Render", repo: "/PalmChef", live: "https://palmchef-14qa.onrender.com", icon: Hand },
  { id: "03", name: "Amedic", kind: "FLUTTER / HEALTH & FITNESS", className: "amedic", headline: <>Small steps.<br />Better days.</>, description: "A pocket health dashboard for steps, goals, BMI/BMR, sleep, nutrition, and shareable progress summaries.", tags: ["Flutter", "Dart", "pedometer", "fl_chart"], details: "share_plus · Interactive charts · Health calculations · Flutter animations", repo: "/Amedic", icon: HeartPulse },
  { id: "04", name: "FloatChat", kind: "FLUTTER / ARGO MOBILE", className: "float", headline: <>Big ocean.<br />Pocket explorer.</>, description: "Explore ARGO ocean data through maps, profiles, alerts, downloads, and a conversational demo.", tags: ["Flutter", "Dart", "flutter_map", "latlong2"], details: "Map-based exploration · Ocean profiles · Alerts · Data downloads · Conversational demo", repo: "/FloatChat_app", icon: Waves },
];
const toolkit = [
  { number: "01", title: "Languages", items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "Dart", "HTML", "CSS"] },
  { number: "02", title: "Interfaces", items: ["React 18 / 19", "Flutter", "Tailwind CSS", "Vite", "Framer Motion", "Zustand"] },
  { number: "03", title: "Behind the scenes", items: ["Node.js", "Express", "MongoDB", "Firebase Auth", "Firestore", "REST APIs", "JWT"] },
  { number: "04", title: "Connect & ship", items: ["Gemini", "MediaPipe", "Google Sheets API", "Apps Script", "Docker", "Nginx", "Vercel", "Render", "Git / GitHub"] },
];
function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motion, setMotion] = useState(true);
  const [role, setRole] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useRef<HTMLDivElement>(null);
  const roles = ["full-stack developer", "Flutter builder", "AI/ML explorer"];
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) setMotion(false);
    const change = () => setMotion(!query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!motion) return;
    const timer = window.setInterval(() => setRole(value => (value + 1) % 3), 3200);
    return () => window.clearInterval(timer);
  }, [motion]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  return (
    <div className={`portfolio ${motion ? "motion-on" : "motion-off"}`}>
      <a className="skip-link" href="#work">Skip to projects</a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Ameya — home">a<span>/</span><span className="wordmark-name">AMEYA</span></a>
        <nav aria-label="Main navigation" className={menuOpen ? "nav is-open" : "nav"} id="main-nav">
          {[['work', 'Work'], ['stack', 'Stack'], ['about', 'About']].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="#contact" className="nav-contact" onClick={() => setMenuOpen(false)}>Let’s connect <ArrowUpRight size={16} /></a>
        </nav>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main>
        <section className="hero wrap" id="home">
          <div className="hero-top mono"><span>INDEPENDENT DEVELOPER / INDIA</span><span className="edition">SELECTED WORK — 2026</span></div>
          <div className="hero-stage" ref={heroRef} onPointerMove={event => {
            if (!motion || event.pointerType !== "mouse") return;
            const box = event.currentTarget.getBoundingClientRect();
            event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - box.left) / box.width - .5) * 14}px`);
            event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - box.top) / box.height - .5) * 14}px`);
          }} onPointerLeave={() => { heroRef.current?.style.setProperty("--pointer-x", "0px"); heroRef.current?.style.setProperty("--pointer-y", "0px"); }}>
            <div className="hero-copy">
              <p className="eyebrow"><span className="red-line" /> HEY, I’M</p>
              <h1>AMEYA<span>.</span></h1>
              <h2>Ideas in.<br /><span className="outline-text">Impact out.</span></h2>
              <p className="hero-description">A <span className="role" key={motion ? role : "static"}>{roles[role]}</span><br />turning everyday friction into things that work.</p>
              <div className="hero-actions"><a href="#work" className="button-primary">Explore my work <ArrowDown size={18} /></a><ExternalLink href={github} className="github-link"><Github size={20} /> GitHub</ExternalLink></div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
              <img src="/images/chrome-core.webp" alt="" width="900" height="900" fetchPriority="high" className="chrome-core" />
              <span className="art-coordinate coordinate-top mono">IDEA → CODE → REAL WORLD</span>
              <span className="art-coordinate coordinate-bottom mono"><span>WEB</span><span>MOBILE</span><span>AUTOMATION</span></span>
              <span className="art-cross cross-one">+</span><span className="art-cross cross-two">+</span>
            </div>
          </div>
          <div className="hero-bottom"><span className="mono">CURRENTLY EXPLORING <span className="white">AI/ML + DSA</span></span><button className="motion-toggle mono" onClick={() => setMotion(!motion)} aria-pressed={motion}>{motion ? <Pause size={14} /> : <Play size={14} />} MOTION {motion ? "ON" : "OFF"}</button><a href="#work" className="scroll-link mono">SCROLL TO EXPLORE <ArrowDown size={15} /></a></div>
        </section>
        <div className="marquee" aria-hidden="true"><div className="marquee-track">{[0, 1].map(index => <div className="marquee-group" key={index}><span>BUILD WITH INTENT</span><span className="marquee-star">✳</span><span className="marquee-outline">SHIP SOMETHING USEFUL</span><span className="marquee-star">✳</span><span>STAY CURIOUS</span><span className="marquee-star">✳</span></div>)}</div></div>
        <section className="work-section wrap section-space" id="work">
          <div className="section-heading"><div><p className="eyebrow">01 / SELECTED BUILDS</p><h2>Less talk.<br /><span className="muted-heading">More shipped.</span></h2></div><p>Web. Mobile. Useful automation.<br />A few things I’ve put into the world.</p></div>
          <div className="project-grid">{projects.map(project => {
            const Icon = project.icon;
            return <article className={`project-card ${project.className}`} key={project.id}>
              <div className="project-visual">
                <div className="project-visual-top mono"><span>{project.kind}</span><span>/{project.id}</span></div>
                <h3>{project.headline}</h3><Icon className="project-icon" size={148} strokeWidth={1} aria-hidden="true" />
                <div className="project-visual-bottom mono">{project.id === "01" ? <><span>FITNESS FIRST BOXING CLUB</span><span>NISHA FITNESS</span></> : project.id === "02" ? <><span>GESTURE + VOICE</span><span>HANDS-FREE</span></> : project.id === "03" ? <><span>MOVE. TRACK. REPEAT.</span><span>HEALTH IN YOUR POCKET</span></> : <><span>ARGO OCEAN DATA</span><span>GO DEEPER ↓</span></>}</div>
              </div>
              <div className="project-info"><div className="project-title-row"><h3>{project.name}<span>{project.id === "04" ? " / ARGO Mobile" : ""}</span></h3>{project.live && <span className="live-label">LIVE PROJECT</span>}</div><p>{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><details className="project-details"><summary>Under the hood <span>+</span></summary><p>{project.details}</p></details><div className="project-links">{project.live && <ExternalLink href={project.live}>Visit live site</ExternalLink>}<ExternalLink href={`${github}${project.repo}`}><Github size={16} /> Source code</ExternalLink></div></div>
            </article>;
          })}</div>
          <div className="work-footer"><span className="mono">EXPERIMENTS, SIDE QUESTS & THE REST</span><ExternalLink href={`${github}?tab=repositories`}>Explore all repositories</ExternalLink></div>
        </section>
        <section className="stack-section section-space" id="stack"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">02 / THE TOOLKIT</p><h2>The right tools.<br /><span className="muted-heading">No magic wand.</span></h2></div><Code2 className="section-symbol" size={74} strokeWidth={1} aria-hidden="true" /></div><div className="toolkit">{toolkit.map(group => <div className="tool-row" key={group.number}><div className="tool-title"><span className="mono">{group.number}</span><h3>{group.title}</h3></div><div className="tool-items">{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div><details className="utility-drawer"><summary>Also in the utility drawer <span>+</span></summary><p>React Router · Mongoose · bcrypt.js · CORS · Zod · PDF.js · Web Speech API · Vitest · React Testing Library · ESLint · Prettier · PostCSS · Nodemon · fl_chart · pedometer · share_plus · flutter_map · latlong2 · Flutter animations · WhatsApp integration · UPI integration · VS Code</p></details></div></section>
        <section className="about-section wrap section-space" id="about"><div className="about-intro"><p className="eyebrow">03 / THE HUMAN BEHIND THE CODE</p><h2>Curiosity is<br />the <span className="red-text">engine.</span></h2><p>I’m Ameya, a B.Tech CSE student at Bennett University. I build full-stack products and Flutter apps, especially when there’s a real problem worth untangling.</p><p>Currently getting deeper into AI/ML and sharpening my problem-solving with C++. The loop is simple: learn, build, break, improve.</p><div className="about-pills"><span><Layers3 size={16} /> Full-stack</span><span><Smartphone size={16} /> Flutter</span><span><Code2 size={16} /> C++ / DSA</span></div></div><aside className="practice-card"><div className="practice-top mono"><span>THE DAILY SIDE QUEST</span><Code2 size={22} /></div><h3>One problem.<br />One better idea.</h3><p>Arrays, hashing, binary search, sorting—and plenty of “oh, that’s why.”</p><div className="practice-stats"><div><strong>12<span>↗</span></strong><span>problems synced</span></div><div><strong>03<span>d</span></strong><span>verified streak</span></div></div><p className="snapshot mono">SNAPSHOT: 05 SEP 2026<br />REPO SUBMISSIONS · STREAK: 02–04 SEP<br />NOT A LIVE LEETCODE TOTAL</p><ExternalLink href={`${github}/neetcode-submissions`}>Follow the NeetCode journey</ExternalLink></aside></section>
        <section className="contact-section" id="contact"><div className="wrap"><div className="contact-top"><span className="eyebrow">04 / NEXT TRANSMISSION</span><span className="mono">GOOD IDEAS DESERVE TO EXIST.</span></div><h2>Have something<br /><span>in mind?</span><ArrowUpRight aria-hidden="true" className="contact-arrow" /></h2><div className="contact-bottom"><p>Projects, learning opportunities, or a genuinely<br className="desktop-break" /> interesting problem. I’m listening.</p><ExternalLink href={github} className="button-primary"><Github size={20} /> Find me on GitHub</ExternalLink></div></div></section>
      </main>
      <footer className="site-footer wrap"><a className="wordmark" href="#home" aria-label="Back to top">a<span>/</span></a><span className="mono">© 2026 AMEYA · ALWAYS IN PROGRESS.</span><a href="#home" className="mono">BACK TO TOP <ArrowUpRight size={15} /></a></footer>
    </div>
  );
}
