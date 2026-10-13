import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';

export default function MegaMenu({ data, overviewLink = '/', open = false, onNavigate }) {
  const { groups, offer, allLabel } = data;

  return (
    <div className={`mega-menu ${open ? 'open' : ''}`}>
      <div className={`mega-inner ${offer ? '' : 'no-offer'}`}>
        <div className="mega-left">
          <Link to={overviewLink} className="mega-all" onClick={onNavigate}>
            {allLabel || 'All Programs'} <Icon name="arrow" size={15} />
          </Link>

          <div className="mega-groups">
            {groups.map((g, idx) => (
              <div className="mega-group" key={g.title ? `${g.title}-${idx}` : idx}>
                <p
                  className="mega-group-title"
                  style={g.hideTitle ? { visibility: 'hidden', userSelect: 'none' } : {}}
                >
                  {g.title || '\u00A0'}
                </p>
                                {g.items.map((c) => {
                  // If the item has a `link`, it navigates to its own page
                  const Tag = c.link ? Link : 'a';
                  const props = c.link ? { to: c.link } : { href: '/#contact' };
                  return (
                  <Tag {...props} className="mega-item" key={c.name} onClick={onNavigate}>
  <img src={c.image} alt={c.name} loading="lazy" decoding="async" />
                                        <div className="mega-item-info">
                      <strong>{c.name}</strong>
                      {c.sub && <span className="mega-sub">{c.sub}</span>}
                      {c.price && <span className="mega-price">{c.price}</span>}
                      {c.time && (
                        <span className="mega-time">
                          <Icon name="clock" size={12} /> {c.time}
                        </span>
                                            )}
                    </div>
                  </Tag>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

                {offer && (
                <Link
            to={offer.link || '/#contact'}
            className={`mega-offer ${offer.variant || ''}`}
            style={{ backgroundImage: `url(${offer.image})` }}
            onClick={onNavigate}
          >
            <p className="mega-offer-tag">{offer.tag}</p>
            <h4>{offer.title}</h4>
            <p className="mega-offer-sub">{offer.subtitle}</p>
            <span className="btn btn-primary">
              {offer.button}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}