import { basePath, contactLinks } from '../data/home';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__bottom">
        <a className="site-footer__brand" href={basePath} aria-label="На главную">
          <span>s</span>
          <b>Лиды для стяжки</b>
        </a>
        <p className="site-footer__info">Сайт, реклама и прием заявок для бригад по стяжке пола. Работаю лично, без менеджеров.</p>
        <nav className="site-footer__links" aria-label="Ссылки в футере">
          <div className="social-links social-links--footer" aria-label="Связаться">
            {contactLinks.map((link) => (
              <a className="social-link" href={link.href} target="_blank" rel="noreferrer" aria-label={link.name} key={link.name}>
                <img src={link.icon} alt="" aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>
        <p className="site-footer__copy">© {year} Stroix Leads</p>
      </div>
    </footer>
  );
}
