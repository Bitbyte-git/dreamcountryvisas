import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons.jsx';
import { LANGUAGES, LANGUAGE_EVENT, getLanguage, setLanguage, prefetchLanguages } from '../i18n/index.js';

// Topbar language dropdown. Marked translate="no" so the language names
// always stay readable, whatever language the rest of the page is in.
export default function LanguageSelector() {
  const [current, setCurrent] = useState(getLanguage);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onChange = (e) => setCurrent(e.detail.code);
    window.addEventListener(LANGUAGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_EVENT, onChange);
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open) prefetchLanguages();
    setOpen((o) => !o);
  };

  const choose = (code) => {
    setOpen(false);
    if (code !== current) setLanguage(code);
  };

  const active = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <div className="topbar-link topbar-lang" translate="no" ref={wrapRef}>
      <button
        type="button"
        className="topbar-lang-btn"
        onClick={toggle}
        onMouseEnter={prefetchLanguages}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${active.label}`}
      >
        <Icon name="language" size={14} />
        <span>{active.nativeName}</span>
        <span className={`topbar-lang-chevron ${open ? 'open' : ''}`}>
          <Icon name="chevron-down" size={11} />
        </span>
      </button>

      {open && (
        <ul className="topbar-lang-menu" role="listbox" aria-label="Select language">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === current}
                className={`topbar-lang-option ${l.code === current ? 'active' : ''}`}
                onClick={() => choose(l.code)}
              >
                <span className="topbar-lang-names">
                  <span className="topbar-lang-label">{l.nativeName}</span>
                  {l.nativeName !== l.label && (
                    <span className="topbar-lang-native">{l.label}</span>
                  )}
                </span>
                {l.code === current && <Icon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
