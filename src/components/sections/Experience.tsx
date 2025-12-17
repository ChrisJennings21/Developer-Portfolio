import { useEffect, useRef } from 'react';
import { experiences } from '@/data/experience';

export function Experience() {
  const headerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      itemRefs.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="experience">
      <div className="section-header reveal" ref={headerRef}>
        <div className="section-label">Career Journey</div>
        <h2 className="section-title">Professional Experience</h2>
      </div>
      <div className="experience-container">
        {experiences.map((exp, index) => (
          <div
            key={exp.date}
            className="timeline-item reveal"
            ref={(el) => { itemRefs.current[index] = el; }}
          >
            <div className="timeline-date">{exp.date}</div>
            <h3 className="timeline-title">{exp.title}</h3>
            <div className="timeline-company">{exp.company}</div>
            <p className="timeline-description">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
