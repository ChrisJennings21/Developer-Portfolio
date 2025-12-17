import { useState } from 'react';
import { useWarp } from '@/context/WarpContext';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

interface NavigationProps {
  onHover: (hovering: boolean) => void;
}

export function Navigation({ onHover }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { triggerWarp } = useWarp();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    triggerWarp(href);
  };

  return (
    <>
      <nav>
        <a
          href="#"
          className="logo"
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
          &lt;chris.jennings<span>/&gt;</span>
        </a>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                onMouseEnter={() => onHover(true)}
                onMouseLeave={() => onHover(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
