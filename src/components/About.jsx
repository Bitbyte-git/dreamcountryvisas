import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { ABOUT_TEAM, ABOUT_FAQ_ITEMS } from '../data.js';
import FAQ from '../components/FAQ.jsx';
import { useT } from '../i18n/useT.js';

const PILLARS = [
  {
    icon: 'certificate',
    title: 'Mission',
    text: 'To offer genuine, ethical, and results-driven immigration services while maintaining the highest level of integrity.',
  },
  {
    icon: 'globe',
    title: 'Vision',
    text: 'To be the most trusted immigration consultant, providing honest, client-focused solutions that help individuals and families achieve their dream of living abroad.',
  },
];

const WHY_CHOOSE = [
  {
    icon: 'support',
    title: 'Expert Case Managers',
    text: 'Our team consists of highly experienced professionals who have been with us for years — more than just a team, they are family. We have complete confidence in their expertise, ensuring every client receives personalized attention and expert guidance.',
  },
  {
    icon: 'certificate',
    title: 'Quality Over Quantity',
    text: 'Unlike firms that churn out cases, we carefully screen applications and only take on cases with a high success potential.',
  },
  {
    icon: 'star',
    title: 'High Success Rate',
    text: 'Our thorough screening process means a greater chance of visa approval.',
  },
  {
    icon: 'passport',
    title: 'Full Transparency',
    text: 'No false promises — we provide clear, honest assessments of your case.',
  },
  {
    icon: 'building',
    title: 'Comprehensive Support',
    text: 'From document preparation to visa approval, we handle every step of your immigration journey.',
  },
];

const ABOUT_STATS = [
  { value: '25', label: 'Years Experience' },
  { value: '6', label: 'Awards' },
  { value: '20', label: 'Support Members' },
];


function TypewriterTagline() {
  // Typed letter by letter, so it's translated here as whole phrases
  // (the <h2> is translate="no" so the DOM pass leaves the fragments alone).
  const t = useT();
  const firstText = t('Your Aspiration Is');
  const secondText = t('Our Ambition');

  const [firstTyped, setFirstTyped] = useState('');
  const [secondTyped, setSecondTyped] = useState('');
  const [phase, setPhase] = useState('typing-first');

  useEffect(() => {
    let timeout;

    // Type first line smoothly
    if (phase === 'typing-first') {
      if (firstTyped.length < firstText.length) {
        timeout = setTimeout(() => {
          setFirstTyped(
            firstText.slice(0, firstTyped.length + 1)
          );
        }, 95);
      } else {
        timeout = setTimeout(() => {
          setPhase('typing-second');
        }, 500);
      }
    }

    // Type second line smoothly
    else if (phase === 'typing-second') {
      if (secondTyped.length < secondText.length) {
        timeout = setTimeout(() => {
          setSecondTyped(
            secondText.slice(0, secondTyped.length + 1)
          );
        }, 110);
      } else {
        timeout = setTimeout(() => {
          setPhase('pause');
        }, 2500);
      }
    }

    // Pause after complete text
    else if (phase === 'pause') {
      timeout = setTimeout(() => {
        setPhase('deleting-second');
      }, 800);
    }

    // Delete second line smoothly
    else if (phase === 'deleting-second') {
      if (secondTyped.length > 0) {
        timeout = setTimeout(() => {
          setSecondTyped(
            secondTyped.slice(0, -1)
          );
        }, 65);
      } else {
        timeout = setTimeout(() => {
          setPhase('deleting-first');
        }, 300);
      }
    }

    // Delete first line smoothly
    else if (phase === 'deleting-first') {
      if (firstTyped.length > 0) {
        timeout = setTimeout(() => {
          setFirstTyped(
            firstTyped.slice(0, -1)
          );
        }, 65);
      } else {
        timeout = setTimeout(() => {
          setPhase('typing-first');
        }, 800);
      }
    }

    return () => clearTimeout(timeout);

  }, [firstTyped, secondTyped, phase]);

  return (
    <h2 className="tagline-text" translate="no">
      <span className="tagline-navy">
        {firstTyped}

        {(phase === 'typing-first' ||
          phase === 'deleting-first') && (
          <span className="typing-cursor">|</span>
        )}
      </span>

      <span className="tagline-gold">
        {secondTyped}

        {(phase === 'typing-second' ||
          phase === 'deleting-second') && (
          <span className="typing-cursor">|</span>
        )}
      </span>
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <p className="about-hero-tag">OUR STORY</p>
          <h1>Who We Are &amp; What We Do</h1>
          <p className="about-hero-desc">
            At DreamCountry Visas, we prioritize trust, transparency, and
            fairness in every step of the immigration process. Unlike
            agencies that chase numbers, we focus on quality over quantity.
          </p>
        </div>
      </section>

           {/* Story */}
      <section className="section">
        <div className="container story-block">
          <div className="story-text-col">
            <p className="story-lead">
              We carefully screen every application with honesty and
              expertise, ensuring it has a strong, realistic chance of
              success.
            </p>
            <p className="story-body">
              In today&rsquo;s immigration industry, trust is often a
              concern. However, we stand firm in our commitment to
              delivering positive outcomes and exceptional service. We
              never blindly accept cases &mdash; every application must
              hold strong potential for approval before we take it forward.
            </p>
          </div>
          <div className="story-stat-card">
            <span className="story-stat-value">99%</span>
            <span className="story-stat-label">
              Assurance of Delivering Positive Outcomes
            </span>
            <p className="story-stat-note">
              The remaining 1% depends on external factors beyond our
              control.
            </p>
          </div>
        </div>
      </section>

{/* Tagline */}
<section className="section tagline-section">
  <div className="container">
    <div className="tagline-line" />

    <TypewriterTagline />
  </div>
</section>

      {/* Mission / Vision / Establishment */}
      <section className="section about-pillars-section">
        <div className="container">
          <div className="about-pillars">
            {PILLARS.map((p, idx) => (
              <div className="about-pillar" key={p.title}>
                <span className="about-pillar-num">0{idx + 1}</span>
                <span className="about-pillar-icon">
                  <Icon name={p.icon} size={24} />
                </span>
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Leadership */}
      <section className="section ldr-section">
        <div className="container">
          <p className="section-tag">OUR LEADERSHIP</p>
          <h2 className="center">Experts Who Guide, Support &amp; Deliver</h2>
                    <div className="ldr-list">
            {ABOUT_TEAM.map((member, idx) => (
              <div
                className={`ldr-row ${idx % 2 === 1 ? 'rev' : ''}`}
                key={member.name}
              >
                <div className="ldr-photo-wrap">
                  <img
  className="ldr-photo"
  src={member.image}
  alt={member.name}
  loading="lazy"
  decoding="async"
/>
                </div>
                                <div className="ldr-info">
                  <span className="ldr-quote">&rdquo;</span>
                  <div className="ldr-header-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <p className="ldr-role">{member.role}</p>
                      <h3>{member.name}</h3>
                    </div>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-linkedin"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <Icon name="linkedin" size={15} />
                      </a>
                    )}
                  </div>
                  <div className="ldr-divider" />
                  <p className="ldr-desc" dangerouslySetInnerHTML={{ __html: member.description }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose-section">
        <div className="container">
          <p className="section-tag">WHY CHOOSE US</p>
          <h2 className="center">Why Choose Dream Country Visas?</h2>
          <div className="why-choose-grid">
            {WHY_CHOOSE.map((w) => (
              <div className="why-card" key={w.title}>
                <span className="why-icon">
                  <Icon name={w.icon} size={22} />
                </span>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* We have helped many — stats strip */}
      <section className="about-stats-strip">
        <div className="container">
          <p className="about-stats-tag">WE HAVE HELPED MANY</p>
          <div className="about-stats-row">
            {ABOUT_STATS.map((s) => (
              <div className="about-stat" key={s.label}>
                <strong>{s.value}+</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="country-cta">
            <div>
              <h3>Ready to start your immigration journey?</h3>
              <p>Get a free consultation with our expert case managers.</p>
            </div>
            <div className="cta-buttons">
                           <Link to="/contact" className="btn btn-light">
                Book Consultation <Icon name="arrow" size={16} />
              </Link>
              <Link to="/" className="btn btn-ghost">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={ABOUT_FAQ_ITEMS} />
    </div>
  );
}