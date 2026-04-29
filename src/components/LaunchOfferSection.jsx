import Button from './Button';
import { launchOfferCities, launchOfferPoints } from '../data/home';

export default function LaunchOfferSection() {
  return (
    <section className="launch-offer-section" id="launch-offer" data-reveal="section">
      <div className="launch-offer-section__inner" data-reveal="panel">
        <div className="launch-offer-copy" data-reveal="item">
          <p className="eyebrow">Свободные города для запуска</p>
          <h2>
            Уже запустились в <span>Новосибирске и Калуге</span>. Готов взять еще 2-3 города.
          </h2>
          <p>
            Если в Вашем регионе есть спрос на стяжку пола, можно быстро развернуть сайт,
            рекламу и прием заявок без найма агентства, покупки домена и технической возни.
          </p>
          <div className="launch-offer-cities" aria-label="Города, где запуск уже состоялся">
            {launchOfferCities.map((city) => <span key={city}>{city}</span>)}
          </div>
        </div>

        <div className="launch-offer-price" aria-label="Стоимость запуска" data-reveal="item" data-reveal-delay="1">
          <span>Стоимость участия</span>
          <strong>15 000 ₽</strong>
          <p>в месяц</p>
          <b>Первые 5 лидов - бесплатно</b>
        </div>

        <div className="launch-offer-points">
          {launchOfferPoints.map(([title, text], index) => (
            <article className="launch-offer-point" key={title} data-reveal="item" data-reveal-delay={String(index + 1)}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="launch-offer-actions" data-reveal="item" data-reveal-delay="2">
          <Button data-lead-modal-open>Проверить мой город</Button>
          <a className="launch-offer-actions__link" href="#client-result">Что входит в запуск</a>
        </div>
      </div>
    </section>
  );
}
