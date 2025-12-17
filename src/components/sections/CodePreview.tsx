import { useEffect, useRef } from 'react';

export function CodePreview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return (
    <section style={{ paddingTop: 0 }}>
      <div className="code-window reveal" ref={ref}>
        <div className="code-header">
          <div className="code-dot red"></div>
          <div className="code-dot yellow"></div>
          <div className="code-dot green"></div>
        </div>
        <div className="code-content">
          <span className="comment">// What I do best</span>
          <br />
          <span className="keyword">public async</span>{' '}
          <span className="type">Task&lt;Solution&gt;</span>{' '}
          <span className="method">BuildAsync</span>(
          <span className="type">Challenge</span> challenge)
          <br />
          {'{'}
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">var</span> approach ={' '}
          <span className="keyword">await</span>{' '}
          <span className="method">AnalyzeRequirements</span>(challenge);
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">var</span> architecture ={' '}
          <span className="method">DesignCleanArchitecture</span>(approach);
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">var</span> code ={' '}
          <span className="method">WriteTestableCode</span>(architecture);
          <br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return new</span>{' '}
          <span className="type">Solution</span>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;{'{'}
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quality ={' '}
          <span className="type">QualityLevel</span>.Production,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maintainability ={' '}
          <span className="keyword">true</span>,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Documentation ={' '}
          <span className="string">"Comprehensive"</span>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'};
          <br />
          {'}'}
        </div>
      </div>
    </section>
  );
}
