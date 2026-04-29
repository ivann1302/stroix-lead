import Button from './Button';
import { interactionSteps } from '../data/home';

export default function InteractionSection() {
  return (
    <section className="interaction-section" id="interaction" data-reveal="section">
      <div className="interaction-section__head" data-reveal="item">
        <p className="eyebrow">Как мы взаимодействуем</p>
        <h2>От первого сообщения до первых лидов - без менеджеров и чат-ботов</h2>
      </div>

      <div className="interaction-flow" aria-label="Схема запуска заявок">
        {interactionSteps.map(([title, text], index) => (
          <article className="interaction-step" key={title} data-reveal="item" data-reveal-delay={String(Math.min(index + 1, 4))}>
            <span className="interaction-step__num">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="interaction-contact" data-reveal="panel" data-reveal-delay="2">
        <div>
          <span>Стартуем с удобного контакта</span>
          <p>Можно оставить телефон для обратного звонка или сразу написать в Telegram.</p>
        </div>
        <div className="interaction-contact__actions">
          <Button data-lead-modal-open>Оставить заявку</Button>
          <Button href="https://t.me/ivann97n" variant="dark">Написать в Telegram</Button>
        </div>
      </div>
    </section>
  );
}
