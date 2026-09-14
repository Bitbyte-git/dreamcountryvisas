import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons.jsx';
import {
  CONTACT,
  CITIZENSHIP_MENU,
  RESIDENCY_MENU,
  REALESTATE_MENU,
  PR_MENU,
  OTHERSERVICES_MENU,
} from '../data.js';
import { isValidEmail, isValidPhone, sanitizePhoneInput, submitContactForm } from '../utils/formValidation.js';

// Each category maps to its menu data + a function that turns a picked
// item's name into the same "program" string ConsultationModal/ContactPage
// build — so a chatbot lead lands in the exact same admin-dashboard
// category (Citizenship/Residency/Real Estate/PR/Other Service) with zero
// extra backend work.
const CATEGORIES = [
  { key: 'citizenship', label: 'Citizenship by Investment', menu: CITIZENSHIP_MENU, toProgram: (n) => `Citizenship of ${n}` },
  { key: 'residency', label: 'Residency by Investment', menu: RESIDENCY_MENU, toProgram: (n) => `Residence in ${n}` },
  { key: 'realestate', label: 'Real Estate Investment', menu: REALESTATE_MENU, toProgram: (n) => `Real Estate Investment — ${n}` },
  { key: 'pr', label: 'Permanent Residency (PR)', menu: PR_MENU, toProgram: (n) => n },
  { key: 'other', label: 'Other Services', menu: OTHERSERVICES_MENU, toProgram: (n) => n },
];

// Same two programs that trigger the extra English-level question on the
// full Contact / Consultation forms.
const PR_PROGRAMS_NEEDING_ENGLISH = ['Australia PR', 'Canada PR'];
const ENGLISH_LEVELS = ['Competitive', 'Proficient', 'Superior'];

function itemsOf(menu) {
  return menu.groups.flatMap((g) => g.items);
}

const WELCOME_TEXT = "Hi! 👋 I'm the Dream Country Visas assistant. What are you exploring today?";
const EMPTY_LEAD = { name: '', phone: '', email: '', nationality: '', residence: '' };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState([{ from: 'bot', text: WELCOME_TEXT }]);
  const [step, setStep] = useState('menu'); // menu | programs | detail | english | lead | done
  const [category, setCategory] = useState(null);
  const [item, setItem] = useState(null);
  const [englishLevel, setEnglishLevel] = useState('');
  const [lead, setLead] = useState(EMPTY_LEAD);
  const [leadError, setLeadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log, step]);

  const say = (text) => setLog((prev) => [...prev, { from: 'bot', text }]);
  const echo = (text) => setLog((prev) => [...prev, { from: 'user', text }]);

  const needsEnglish = (cat, it) =>
    cat?.key === 'pr' && PR_PROGRAMS_NEEDING_ENGLISH.includes(it?.name);

  const goMenu = () => {
    setStep('menu');
    setCategory(null);
    setItem(null);
    setEnglishLevel('');
    say('Sure — what are you exploring?');
  };

  const pickCategory = (cat) => {
    echo(cat.label);
    setCategory(cat);
    setStep('programs');
    say(`Great choice! Here are our ${cat.label} options — pick one:`);
  };

  const pickItem = (it) => {
    echo(it.name);
    setItem(it);
    setStep('detail');
    const bits = [it.price, it.time, it.sub].filter(Boolean).join(' · ');
    say(bits ? `${it.name} — ${bits}. Want us to call you about it?` : `${it.name} — want us to call you about it?`);
  };

  const startLead = () => {
    echo('Yes, get me a callback');
    if (needsEnglish(category, item)) {
      setStep('english');
      say('One quick question first — what is your English level?');
    } else {
      setStep('lead');
      say('Perfect — a few quick details and our team will reach out.');
    }
  };

  const pickEnglishLevel = (level) => {
    echo(level);
    setEnglishLevel(level);
    setStep('lead');
    say('Perfect — a few quick details and our team will reach out.');
  };

  const talkToHuman = () => {
    echo('Contact us on WhatsApp');
    window.open(CONTACT.whatsapp, '_blank', 'noreferrer');
  };

  // Single back handler for every step — keeps one "history" to unwind.
  const goBack = () => {
    if (step === 'programs') return goMenu();
    if (step === 'detail') return pickCategory(category);
    if (step === 'english') {
      setStep('detail');
      return say(`Back to ${item.name} — want us to call you about it?`);
    }
    if (step === 'lead') {
      if (needsEnglish(category, item)) {
        setStep('english');
        return say('What is your English level?');
      }
      setStep('detail');
      return say(`Back to ${item.name} — want us to call you about it?`);
    }
    goMenu();
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setLeadError('');

    if (!lead.name.trim()) return setLeadError('Please enter your name.');
    if (!isValidPhone(lead.phone, '+91')) return setLeadError('Please enter a valid 10-digit phone number.');
    if (!isValidEmail(lead.email)) return setLeadError('Please enter a valid email address.');
    if (!lead.nationality.trim()) return setLeadError('Please enter your nationality.');
    if (!lead.residence.trim()) return setLeadError('Please enter your country of residence.');

    setSubmitting(true);
    const program = category ? category.toProgram(item.name) : 'General Enquiry';
    const { success, error } = await submitContactForm({
      source: 'chatbot',
      program,
      englishLevel: englishLevel || undefined,
      firstName: lead.name.trim(),
      phoneCode: '+91',
      phone: lead.phone,
      email: lead.email,
      nationality: lead.nationality.trim(),
      residence: lead.residence.trim(),
    });
    setSubmitting(false);

    if (success) {
      setStep('done');
      say(`Thanks, ${lead.name.trim()}! Our team will call you shortly about ${program}.`);
    } else {
      setLeadError(error || 'Something went wrong — please try again.');
    }
  };

  const restart = () => {
    setLog([{ from: 'bot', text: WELCOME_TEXT }]);
    setLead(EMPTY_LEAD);
    setLeadError('');
    setEnglishLevel('');
    goMenu();
  };

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <strong>Dream Country Visas</strong>
              <span>Usually replies instantly</span>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="chatbot-log" ref={scrollRef}>
            {log.map((m, i) => (
              <div key={i} className={`chatbot-bubble ${m.from}`}>{m.text}</div>
            ))}

            {step === 'menu' && (
              <div className="chatbot-options">
                {CATEGORIES.map((cat) => (
                  <button key={cat.key} className="chatbot-option-btn" onClick={() => pickCategory(cat)}>
                    {cat.label}
                  </button>
                ))}
                <button className="chatbot-option-btn ghost" onClick={talkToHuman}>
                  <Icon name="whatsapp" size={14} /> Contact
                </button>
              </div>
            )}

            {step === 'programs' && category && (
              <div className="chatbot-options">
                {itemsOf(category.menu).map((it) => (
                  <button key={it.name} className="chatbot-option-btn" onClick={() => pickItem(it)}>
                    {it.name}{it.price ? ` — ${it.price}` : ''}
                  </button>
                ))}
                <button className="chatbot-option-btn ghost" onClick={goBack}>← Back</button>
              </div>
            )}

            {step === 'detail' && item && (
              <div className="chatbot-options">
                <button className="chatbot-option-btn primary" onClick={startLead}>Yes, get me a callback</button>
                <button className="chatbot-option-btn ghost" onClick={goBack}>← Back</button>
                <button className="chatbot-option-btn ghost" onClick={talkToHuman}>
                  <Icon name="whatsapp" size={14} /> Contact
                </button>
              </div>
            )}

            {step === 'english' && (
              <div className="chatbot-options">
                {ENGLISH_LEVELS.map((lvl) => (
                  <button key={lvl} className="chatbot-option-btn" onClick={() => pickEnglishLevel(lvl)}>
                    {lvl}
                  </button>
                ))}
                <button className="chatbot-option-btn ghost" onClick={goBack}>← Back</button>
              </div>
            )}

            {step === 'lead' && (
              <form className="chatbot-lead-form" onSubmit={submitLead}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={lead.name}
                  onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={lead.phone}
                  onChange={(e) => setLead((l) => ({ ...l, phone: sanitizePhoneInput(e.target.value) }))}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={lead.email}
                  onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Nationality"
                  value={lead.nationality}
                  onChange={(e) => setLead((l) => ({ ...l, nationality: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Country of residence"
                  value={lead.residence}
                  onChange={(e) => setLead((l) => ({ ...l, residence: e.target.value }))}
                />
                {leadError && <p className="chatbot-error">{leadError}</p>}
                <button type="submit" className="chatbot-option-btn primary" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send'}
                </button>
                <button type="button" className="chatbot-option-btn ghost" onClick={goBack}>← Back</button>
              </form>
            )}

            {step === 'done' && (
              <div className="chatbot-options">
                <button className="chatbot-option-btn ghost" onClick={restart}>Start over</button>
                <button className="chatbot-option-btn ghost" onClick={talkToHuman}>
                  <Icon name="whatsapp" size={14} /> Contact
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close chat' : 'Open chat'}>
        <img src="/landing-img/chatbot.png" alt="Chat with us" className="chatbot-fab-img" />
        {open && (
          <span className="chatbot-fab-close">
            <Icon name="close" size={12} />
          </span>
        )}
      </button>
    </div>
  );
}
