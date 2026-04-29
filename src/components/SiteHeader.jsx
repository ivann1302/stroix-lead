import { basePath, contactLinks } from '../data/home';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href={basePath} aria-label="На главную">
          <span className="brand__mark">S</span>
          <span>Лиды для стяжки</span>
        </a>
        <nav className="social-links social-links--header" aria-label="Связаться">
          {contactLinks.map((link) => (
            <a className="social-link" href={link.href} target="_blank" rel="noreferrer" aria-label={link.name} key={link.name}>
              <img src={link.icon} alt="" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
