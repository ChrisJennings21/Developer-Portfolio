import { useEffect, useRef } from 'react';
import { projects } from '@/data/projects';

interface ProjectsProps {
  onHover: (hovering: boolean) => void;
}

export function Projects({ onHover }: ProjectsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0, rootMargin: '-150px 0px' }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section id="projects">
      <div className="section-header reveal" ref={headerRef}>
        <div className="section-label">Featured Work</div>
        <h2 className="section-title">Projects & Contributions</h2>
      </div>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={project.number}
            className="project-card reveal"
            ref={(el) => { cardRefs.current[index] = el; }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            <div className="project-number">{project.number}</div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
