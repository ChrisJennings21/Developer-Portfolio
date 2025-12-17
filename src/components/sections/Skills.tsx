import { useEffect, useRef } from 'react';
import { skillCategories } from '@/data/skills';

interface SkillsProps {
  onHover: (hovering: boolean) => void;
}

export function Skills({ onHover }: SkillsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    categoryRefs.current.forEach((cat) => {
      if (cat) observer.observe(cat);
    });

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      categoryRefs.current.forEach((cat) => {
        if (cat) observer.unobserve(cat);
      });
    };
  }, []);

  return (
    <section id="skills">
      <div className="section-header reveal" ref={headerRef}>
        <div className="section-label">Technical Expertise</div>
        <h2 className="section-title">Skills & Technologies</h2>
      </div>
      <div className="skills-container">
        {skillCategories.map((category, index) => (
          <div
            key={category.title}
            className="skill-category reveal"
            ref={(el) => { categoryRefs.current[index] = el; }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            <h3>{category.title}</h3>
            <div className="skill-list">
              {category.skills.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar">
                    <div
                      className="skill-progress"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
