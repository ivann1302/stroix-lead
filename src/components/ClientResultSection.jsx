import Button from './Button';
import { clientPackageItems } from '../data/home';

export default function ClientResultSection() {
  return (
    <section className="client-result-section" id="client-result" data-reveal="section">
      <div className="client-result-section__head" data-reveal="item">
        <p className="eyebrow">Что Вы получаете</p>
        <h2>
          <span className="client-result-section__accent">Готовая система заявок</span> без найма подрядчиков и технической рутины
        </h2>
        <p>
          Вы получаете не набор отдельных услуг, а связку из сайта, рекламы, инфраструктуры
          и приема обращений, которая работает под Ваш регион и Ваши условия.
        </p>
      </div>

      <div className="client-result-grid">
        {clientPackageItems.map(([title, text], index) => (
          <article className="client-result-item" key={title} data-reveal="item" data-reveal-delay={String(Math.min(index + 1, 4))}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
              {index === 2 && (
                <strong className="client-result-item__accent">
                  С Вас только бюджет на рекламу
                </strong>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="client-result-cta" data-reveal="panel" data-reveal-delay="2">
        <div>
          <span>Следующий шаг</span>
          <h3>Разберем Ваш город и покажу, как получить первые заявки</h3>
          <strong className="client-result-cta__price">Всего 15 000 ₽ - окупается с первого заказа</strong>
          <p>Оставьте контакт, и я лично уточню регион, услуги, минимальный заказ и формат приема лидов.</p>
        </div>
        <div className="client-result-cta__actions">
          <Button data-lead-modal-open>Обсудить запуск</Button>
          <Button href="https://t.me/ivann97n" variant="dark">Написать в Telegram</Button>
        </div>
      </div>
    </section>
  );
}
