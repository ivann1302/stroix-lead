import { trustIntro, trustPoints } from '../data/home';

export default function TrustSection() {
  return (
    <section className="trust-section" id="trust" data-reveal="section">
      <div className="trust-section__head" data-reveal="item">
        <p className="eyebrow">Почему работать со мной выгодно</p>
        <h2>Не агентская текучка, а личная ответственность за поток заявок</h2>
      </div>

      <div className="trust-layout">
        <div className="trust-person" data-reveal="panel" data-reveal-delay="1">
          <div className="trust-person__photo">
            <img src="/images/ivan.png" alt="Иван, основатель сервиса лидов для стяжки" loading="lazy" />
          </div>
          <div>
            <span className="trust-person__label">Иван, основатель сервиса</span>
            {trustIntro.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>

        <div className="trust-commitments">
          {trustPoints.map(([title, text], index) => (
            <article
              className={index === 2 ? 'trust-commitment trust-commitment--accent' : 'trust-commitment'}
              key={title}
              data-reveal="item"
              data-reveal-delay={String(Math.min(index + 1, 4))}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
