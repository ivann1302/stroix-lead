import { trustIntro, trustPoints } from '../data/home';

export default function TrustSection() {
  return (
    <section className="trust-section" id="trust">
      <div className="trust-section__head">
        <p className="eyebrow">Почему работать со мной выгодно</p>
        <h2>Не агентская текучка, а личная ответственность за поток заявок</h2>
      </div>

      <div className="trust-layout">
        <div className="trust-person">
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
            <article className="trust-commitment" key={title}>
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
