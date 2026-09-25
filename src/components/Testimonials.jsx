import { useState } from 'react';
import { TESTIMONIALS } from '../data.js';
import { Icon } from './Icons.jsx';

function Stars() {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={14} />
      ))}
    </div>
  );
}

function getInitials(name) {
  if (!name) return 'DC';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TestiCard({ t, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`testi-card ${index === 2 ? 'featured' : ''}`}>
      <div className="testi-card-header">
        <Stars />
        <span className="testi-quote-mark">&rdquo;</span>
      </div>
      <p className="testi-text">&ldquo;{t.text}&rdquo;</p>
      <div className="testi-person">
        <div className="testi-avatar">
          {t.image && !imgError ? (
            <img
              src={t.image}
              alt={t.name}
              className="testi-avatar-img"
              style={{ objectPosition: t.imagePosition || 'center 12%' }}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            getInitials(t.name)
          )}
        </div>
        <div className="testi-person-meta">
          <strong>{t.name}</strong>
          <span className="testi-verified">
            <Icon name="check" size={12} /> Verified Client
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section testimonials-section" id="reviews">
      <div className="container">
        <div className="testi-section-header">
          <p className="section-tag">CLIENT TESTIMONIALS</p>
          <h2 className="center">Trusted by Thousands of Happy Families</h2>
          <p className="testi-section-sub center">
            Real stories from individuals and families who successfully achieved their global mobility dreams.
          </p>
        </div>

        <div className="testi-grid">
          {TESTIMONIALS.map((t, idx) => (
            <TestiCard t={t} index={idx} key={t.name} />
          ))}
        </div>
      </div>
    </section>
  );
}