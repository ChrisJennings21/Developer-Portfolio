interface HeroProps {
  onHover: (hovering: boolean) => void;
}

export function Hero({ onHover }: HeroProps) {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="about">
      <div className="hero-content">
        <div className="hero-label">Full-Stack Software Developer</div>
        <h1>
          Building <span className="gradient">enterprise solutions</span> with modern tech
        </h1>
        <p className="hero-description">
          Passionate software developer with 5+ years experience in fast-paced agile environments.
          Specializing in Vue.js, Angular, .NET, and cloud architecture.
          Keen interest in AI, cryptography, security and web development.
        </p>
        <div className="hero-cta">
          <a
            href="#projects"
            className="btn btn-primary"
            onClick={(e) => handleSmoothScroll(e, '#projects')}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="btn btn-secondary"
            onClick={(e) => handleSmoothScroll(e, '#contact')}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            Get In Touch
          </a>
        </div>
        <div className="tech-stack">
          <div className="tech-item">
            <div
              className="tech-icon"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              .NET
            </div>
            <span className="tech-label">Backend</span>
          </div>
          <div className="tech-item">
            <div
              className="tech-icon"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              Vue
            </div>
            <span className="tech-label">Frontend</span>
          </div>
          <div className="tech-item">
            <div
              className="tech-icon"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              SQL
            </div>
            <span className="tech-label">Database</span>
          </div>
          <div className="tech-item">
            <div
              className="tech-icon"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              Azure
            </div>
            <span className="tech-label">Cloud</span>
          </div>
        </div>
      </div>
    </section>
  );
}
