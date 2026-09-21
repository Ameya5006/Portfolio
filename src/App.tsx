import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Github,
  Menu,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";
import Sculpture, { type Finish } from "./Sculpture";
import ProjectArt from "./ProjectArt";
import {
  achievements,
  certifications,
  experience,
  github,
  linkedin,
  navigation,
  projects,
  resume,
  supportingExperience,
  toolkit,
} from "./content";
import { useExperience, useReactiveCursor } from "./useExperience";
import { useArtDirection } from "./useArtDirection";
import SignalField from "./SignalField";

function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function Showcase() {
  const [filter, setFilter] = useState("All");
  const root = useRef<HTMLDivElement>(null);
  const selection = projects.filter(
    (item) =>
      filter === "All" ||
      (filter === "Web"
        ? ["gym", "palm"].includes(item.id)
        : ["amedic", "ocean"].includes(item.id)),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-in-view", entry.isIntersecting);
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.05 },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    window.dispatchEvent(new Event("portfolio:layout"));
    return () => observer.disconnect();
  }, [filter]);

  return (
    <div className="showcase" ref={root}>
      <div className="showcase-toolbar wrap">
        <div className="project-filters" aria-label="Filter projects">
          {["All", "Web", "Flutter"].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value}
              <sup>{value === "All" ? "04" : "02"}</sup>
            </button>
          ))}
        </div>
        <span className="project-scroll-hint">
          <ArrowDown size={14} aria-hidden="true" /> Keep scrolling. Every build
          has a story.
        </span>
        <span className="sr-only" role="status">
          {selection.length} projects shown.
        </span>
      </div>
      <div className="project-flow wrap" aria-label="Selected projects">
        {selection.map((project) => (
          <article
            className={`project-scene scene-${project.id}`}
            id={`project-${project.id}`}
            key={project.id}
            aria-labelledby={`title-${project.id}`}
            data-reveal
          >
            <header className="project-title">
              <span className="eyebrow">
                {project.number} / {project.category}
              </span>
              <h3 id={`title-${project.id}`}>
                {project.title}
                <span>{project.id === "ocean" ? " / ARGO Mobile" : ""}</span>
              </h3>
              <h4>{project.headline.split("\n").join(" ")}</h4>
            </header>
            <div className="project-summary project-description">
              <p>{project.description}</p>
            </div>
            <a
              className="project-scene-visual"
              href={project.live || github + project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title}: ${project.live ? "open live project" : "view source code"} (opens in a new tab)`}
            >
              <ProjectArt id={project.id} />
              <span className="project-light" aria-hidden="true" />
              <span className="project-frame" aria-hidden="true" />
              <span className="slide-number" aria-hidden="true">
                /{project.number}
              </span>
              <span className="slide-label">
                {project.live ? "Open project" : "View source"}{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </a>
            <div className="project-scene-details project-description">
              <ul>
                {project.highlights.map((item) => (
                  <li key={item}>
                    <Check size={13} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <details
                className="technical-details"
                onToggle={() =>
                  window.dispatchEvent(new Event("portfolio:layout"))
                }
              >
                <summary>
                  Full technical stack <Plus size={16} aria-hidden="true" />
                </summary>
                <p>{project.detail}</p>
              </details>
            </div>
            <div className="project-links">
              {project.live && (
                <External href={project.live} className="button button-dark">
                  Open project
                </External>
              )}
              <External href={github + project.repo} className="text-link">
                <Github size={16} />
                Code
              </External>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function Skills() {
  const [open, setOpen] = useState<number | null>(3);
  return (
    <div className="skill-list">
      {toolkit.map((group, i) => (
        <div
          className={`skill-group ${open === i ? "is-open" : ""}`}
          key={group.title}
        >
          <h3>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`skills-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>0{i + 1}</span>
              <span>{group.title}</span>
              <Plus size={18} />
            </button>
          </h3>
          <div className="skill-content" id={`skills-${i}`} hidden={open !== i}>
            {group.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Milestones() {
  return (
    <section
      className="milestones light-section"
      aria-labelledby="milestones-title"
    >
      <div className="wrap">
        <p className="eyebrow">HACKATHONS & SPORTS</p>
        <h2 id="milestones-title">
          The same drive.
          <br />
          <span className="serif">A different arena.</span>
        </h2>
        <div className="milestone-timeline">
          {achievements.map((item, i) => (
            <article className="milestone" key={item.title} data-reveal>
              <span className="milestone-index">0{i + 1}</span>
              <div>
                <span className="eyebrow">{item.kind}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.progression && (
                  <span className="milestone-progress">{item.progression}</span>
                )}
                {item.previous && (
                  <small className="milestone-previous">{item.previous}</small>
                )}
              </div>
              <span
                className={`milestone-mark ${i === 1 ? "medal-mark" : ""}`}
                aria-hidden="true"
              >
                {item.mark}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [motion, setMotion] = useState(
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [finish, setFinish] = useState<Finish>("silver");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [intro, setIntro] = useState(() => {
    try {
      return (
        !sessionStorage.getItem("ameya-immersive-intro") &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch {
      return false;
    }
  });
  const menu = useRef<HTMLDialogElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useExperience(motion, menuOpen);
  useReactiveCursor(motion);
  useArtDirection(motion && !menuOpen);
  useEffect(() => {
    if (!intro) return;
    const timer = setTimeout(() => setIntro(false), 1000);
    try {
      sessionStorage.setItem("ameya-immersive-intro", "seen");
    } catch {}
    return () => clearTimeout(timer);
  }, [intro]);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setMotion(!query.matches);
      if (query.matches) setIntro(false);
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);
  useEffect(() => {
    if (menuOpen) menu.current?.showModal();
    else menu.current?.close();
    const previous = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "home";
      navigation.forEach(({ id }) => {
        if (
          (document.getElementById(id)?.getBoundingClientRect().top ??
            Infinity) <
          innerHeight * 0.4
        )
          current = id;
      });
      setActive(current);
      const height = document.documentElement.scrollHeight - innerHeight;
      progress.current?.style.setProperty(
        "transform",
        `scaleX(${height > 0 ? scrollY / height : 0})`,
      );
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", scroll);
      removeEventListener("resize", scroll);
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="portfolio"
      data-motion={motion ? "on" : "off"}
      data-menu-open={menuOpen}
    >
      <Sculpture motion={motion && !menuOpen} finish={finish} />
      <div className="reactive-cursor" aria-hidden="true">
        <span />
      </div>
      <div className="reading-progress" ref={progress} aria-hidden="true" />
      <a className="skip-link" href="#work">
        Skip to projects
      </a>
      {intro && (
        <div
          className="arrival"
          role="status"
          aria-label="Ameya portfolio introduction"
        >
          <span className="arrival-logo">
            a<span>↗</span>
          </span>
          <p className="eyebrow">IDEAS INTO INTERFACES.</p>
          <button type="button" onClick={() => setIntro(false)}>
            Skip intro <ArrowRight size={15} />
          </button>
        </div>
      )}
      <header className="site-header">
        <a href="#home" className="wordmark" aria-label="Ameya home">
          a<span>↗</span>
        </a>
        <span className="header-caption">
          BUILDER.
          <br />
          STILL CURIOUS.
        </span>
        <div className="header-actions">
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
          >
            Explore <Menu size={17} />
          </button>
        </div>
      </header>
      <dialog
        ref={menu}
        className="menu-dialog"
        aria-label="Explore portfolio"
        onCancel={() => setMenuOpen(false)}
      >
        <div className="menu-top">
          <a
            className="wordmark"
            href="#home"
            onClick={() => setMenuOpen(false)}
            aria-label="Home"
          >
            a<span>↗</span>
          </a>
          <button
            autoFocus
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(false)}
          >
            Close <X size={18} />
          </button>
        </div>
        <div className="menu-body">
          <p className="eyebrow">IDEAS → CODE → REAL WORLD</p>
          <nav>
            {navigation.map(({ id, label }, i) => (
              <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight />
              </a>
            ))}
          </nav>
          <div className="menu-social">
            <External href={github}>GitHub</External>
            <External href={linkedin}>LinkedIn</External>
            <External href={resume}>Résumé</External>
          </div>
        </div>
      </dialog>
      <nav
        className={`section-dock ${["work", "journey", "credentials"].includes(active) ? "on-light" : ""}`}
        aria-label="Section navigation"
      >
        {navigation.map(({ id, label }, i) => (
          <a
            href={`#${id}`}
            key={id}
            aria-label={label}
            aria-current={active === id ? "location" : undefined}
          >
            <span>0{i + 1}</span>
            <span className="dock-label">{label}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={() => setMotion((value) => !value)}
          aria-label={motion ? "Pause animations" : "Enable animations"}
          aria-pressed={!motion}
        >
          {motion ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </nav>
      <main className="site-content">
        <section className="hero" id="home" aria-labelledby="hero-name">
          <SignalField />
          <div className="hero-copy">
            <h1 id="hero-name" aria-label="Ameya Agarwal">
              <span>AMEYA</span>
              <span className="name-outline">AGARWAL</span>
            </h1>
            <p className="hero-roleline">FULL-STACK · FLUTTER · AI / ML</p>
            <div className="hero-actions">
              <a href="#work" className="button button-light">
                Enter the playground <ArrowDown size={16} />
              </a>
              <External
                href={resume}
                className="button button-outline hero-resume"
              >
                View Résumé
              </External>
            </div>
          </div>
          <div className="sculpture-controls">
            <div className="finish-controls" aria-label="Sculpture finish">
              {(["silver", "warm", "cobalt"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-label={`${value} sculpture finish`}
                  aria-pressed={finish === value}
                  className={`finish-dot dot-${value}`}
                  onClick={() => setFinish(value)}
                >
                  <span />
                </button>
              ))}
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#work" aria-label="Scroll into the good stuff">
              <ArrowDown size={18} />
            </a>
          </div>
        </section>
        <section
          className="work-section light-section"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-intro wrap" data-reveal>
            <p className="eyebrow">
              <span className="section-counter">01 /</span> SELECTED PROJECTS
            </p>
            <div className="section-heading">
              <h2 id="work-title">
                Built for
                <br />
                <span className="serif">real life.</span>
              </h2>
              <p>
                Four builds. Different problems.
                <br />
                The same itch to make things work.
              </p>
            </div>
          </div>
          <Showcase />
          <div className="work-bottom wrap">
            <span className="eyebrow">MORE EXPERIMENTS. MORE SIDE QUESTS.</span>
            <External href={`${github}?tab=repositories`} className="text-link">
              All repositories
            </External>
          </div>
        </section>
        <section
          className="stack-section"
          id="stack"
          aria-labelledby="stack-title"
        >
          <div className="wrap">
            <p className="eyebrow" data-reveal>
              <span className="section-counter">02 /</span> THE TOOLKIT
            </p>
            <div className="about-statement" data-reveal>
              <h2 id="stack-title">
                Many tools.
                <br />
                <span className="muted">One</span> curious
                <br />
                <span className="serif">mind.</span>
              </h2>
              <div className="about-copy">
                <span className="asterisk-orbit" aria-hidden="true">
                  ✳
                </span>
                <p>
                  No proficiency bars.
                  <br />
                  Just tools behind the things I build.
                </p>
                <External href={resume} className="text-link">
                  View Résumé
                </External>
                <span className="eyebrow education-note">
                  B.TECH CSE / BENNETT UNIVERSITY
                </span>
              </div>
            </div>
            <div className="expertise-layout">
              <article className="ai-editorial" data-reveal>
                <span className="eyebrow">
                  CURRENT FOCUS / AI + MACHINE LEARNING
                </span>
                <div
                  className="neural-sculpture ambient-scene"
                  aria-hidden="true"
                >
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} style={{ "--ring-index": i } as CSSProperties} />
                  ))}
                  <span className="neural-core" />
                  <div className="neural-signals">
                    {Array.from({ length: 8 }, (_, i) => (
                      <b key={i} style={{ "--node": i } as CSSProperties} />
                    ))}
                  </div>
                </div>
                <h3>
                  Learning how
                  <br />
                  <span className="serif">systems learn.</span>
                </h3>
                <p>
                  Working through the ML pipeline—from data preparation and
                  feature engineering to training, evaluation, deployment and
                  monitoring.
                </p>
                <div className="ai-tags">
                  {["Python", "NumPy", "pandas", "scikit-learn", "MLOps"].map(
                    (item) => (
                      <span key={item}>{item}</span>
                    ),
                  )}
                </div>
              </article>
              <Skills />
            </div>
          </div>
        </section>
        <div className="interlude ambient-scene" aria-hidden="true">
          <div>
            {[0, 1].map((i) => (
              <span key={i}>
                THINK IT <b>↗</b> BUILD IT <b>✳</b> BREAK IT <b>↗</b> MAKE IT
                BETTER <b>✳</b>
              </span>
            ))}
          </div>
        </div>
        <section
          className="journey-section light-section"
          id="journey"
          aria-labelledby="journey-title"
        >
          <div className="wrap">
            <div className="section-intro" data-reveal>
              <p className="eyebrow">
                <span className="section-counter">03 /</span> PEOPLE, PRODUCTS &
                PROGRESS
              </p>
              <div className="section-heading">
                <h2 id="journey-title">
                  More than
                  <br />
                  <span className="serif">a commit log.</span>
                </h2>
                <p>
                  Technical experience first.
                  <br />
                  The leadership behind it, too.
                </p>
              </div>
            </div>
            <div className="experience-rows" data-reveal>
              {experience.map(
                ({ period, org, title, description, icon: Icon }) => (
                  <article className="experience-row" key={title}>
                    <span className="experience-date">{period}</span>
                    <div>
                      <span className="eyebrow">{org}</span>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                    <Icon size={25} strokeWidth={1.2} />
                  </article>
                ),
              )}
            </div>
            <div className="leadership-heading">
              <span className="eyebrow">SELECTED LEADERSHIP</span>
              <span>TRUSTED WITH PEOPLE + EXECUTION</span>
            </div>
            <div className="leadership-grid">
              <article className="leadership-card" data-reveal>
                <span className="eyebrow">
                  AUG 2026 — PRESENT / CURRENT CAMPUS ROLE
                </span>
                <div
                  className="leadership-art ambient-scene"
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                  <span>↗</span>
                </div>
                <h3>
                  Placement Committee
                  <br />
                  Member
                </h3>
                <h4>Career Services Center · Bennett University</h4>
                <p>
                  Selected to support placement coordination while continuing to
                  build technical projects.
                </p>
              </article>
              <article className="leadership-card council" data-reveal>
                <span className="eyebrow">
                  JUL 2025 — MAY 2026 / STUDENT COUNCIL
                </span>
                <div
                  className="leadership-art council-art ambient-scene"
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                  <span>✳</span>
                </div>
                <h3>
                  Sub Head
                  <br />
                  Operations
                </h3>
                <h4>Bennett University Student Council</h4>
                <p>
                  Trusted with teams, resources and event logistics—including
                  the smooth execution of Uphoria, the university’s three-day
                  annual fest.
                </p>
              </article>
            </div>
            <details className="supporting-experience">
              <summary>
                More leadership & operations{" "}
                <span>
                  04 MORE ROLES <Plus size={17} />
                </span>
              </summary>
              <div className="other-roles">
                {supportingExperience.map(([period, role, org]) => (
                  <article key={org}>
                    <span>{period}</span>
                    <div>
                      <h4>{role}</h4>
                      <p>{org}</p>
                    </div>
                  </article>
                ))}
              </div>
              <External href={linkedin} className="text-link">
                Full timeline on LinkedIn
              </External>
            </details>
            <aside className="practice-panel" data-reveal>
              <div>
                <p className="eyebrow">THE PROBLEM-SOLVING LOOP</p>
                <h3>
                  One more
                  <br />
                  <span className="serif">“got it.”</span>
                </h3>
                <p>
                  Arrays. Hashing. Binary search. Sorting.
                  <br />
                  Small reps, sharper thinking.
                </p>
                <External
                  href={`${github}/neetcode-submissions`}
                  className="text-link"
                >
                  NeetCode submissions
                </External>
              </div>
              <div className="practice-right">
                <div className="practice-stats">
                  <div>
                    <strong>
                      12<span>↗</span>
                    </strong>
                    <span>problems synced</span>
                  </div>
                  <div>
                    <strong>
                      03<span>d</span>
                    </strong>
                    <span>verified streak</span>
                  </div>
                </div>
                <div className="practice-topics">
                  <span>arrays[]</span>
                  <span>hash&#123;&#125;</span>
                  <span>search()</span>
                </div>
                <small>
                  Repository snapshot · 5 Sep 2026
                  <br />
                  Streak: 2–4 Sep · Synced submissions only
                </small>
              </div>
            </aside>
          </div>
        </section>
        <Milestones />
        <section
          className="credentials-section light-section"
          id="credentials"
          aria-labelledby="credentials-title"
        >
          <div className="wrap">
            <div className="learning-layout">
              <div className="learning-copy" data-reveal>
                <p className="eyebrow">
                  <span className="section-counter">04 /</span> VERIFIED
                  LEARNING
                </p>
                <h2 id="credentials-title">
                  Proof of
                  <br />
                  <span className="serif">curiosity.</span>
                </h2>
                <p>
                  Technical credentials lead.
                  <br />
                  Every listed certification follows.
                </p>
                <External href={linkedin} className="text-link">
                  View credentials on LinkedIn
                </External>
              </div>
              <div className="credential-list">
                {certifications.map(({ title, tag, icon: Icon }, i) => (
                  <External href={linkedin} className="credential" key={title}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="eyebrow">{tag}</span>
                      <h3>{title}</h3>
                    </div>
                    <Icon size={19} strokeWidth={1.2} />
                  </External>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="wrap">
            <div className="contact-top">
              <p className="eyebrow">
                <span className="section-counter">05 /</span> OPEN A
                CONVERSATION
              </p>
              <span className="contact-star" aria-hidden="true">
                ✳
              </span>
            </div>
            <h2 id="contact-title" data-reveal>
              Got a<br />
              <span className="serif">wild idea?</span>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-arrow"
                aria-label="Let’s connect on LinkedIn (opens in a new tab)"
              >
                <ArrowUpRight strokeWidth={1.1} />
              </a>
            </h2>
            <p className="contact-manifesto">Let’s make it work.</p>
            <div className="contact-bottom">
              <p>
                A project, a learning opportunity, or a tricky
                <br />
                problem worth figuring out. I’m listening.
              </p>
              <div>
                <External href={linkedin}>Let’s connect</External>
                <External href={github}>GitHub</External>
                <External href={resume}>Résumé</External>
              </div>
            </div>
            <footer className="site-footer">
              <a className="wordmark" href="#home" aria-label="Back to top">
                a<span>↗</span>
              </a>
              <span>
                © {new Date().getFullYear()} AMEYA AGARWAL · BUILT WITH
                CURIOSITY.
              </span>
              <button
                type="button"
                className="footer-motion"
                onClick={() => setMotion((v) => !v)}
                aria-pressed={!motion}
              >
                {motion ? <Pause size={12} /> : <Play size={12} />}{" "}
                {motion ? "Pause motion" : "Enable motion"}
              </button>
              <a href="#home">
                BACK TO TOP <ArrowUp size={14} />
              </a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
