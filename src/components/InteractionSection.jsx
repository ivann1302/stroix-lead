import { interactionSteps } from '../data/home';

export default function InteractionSection() {
  return (
    <section className="interaction-section" id="interaction">
      <div className="interaction-section__head">
        <p className="eyebrow">Как мы взаимодействуем</p>
        <h2>От первого сообщения до первых лидов - без менеджеров и чат-ботов</h2>
      </div>

      <div className="interaction-flow" aria-label="Схема запуска заявок">
        {interactionSteps.map(([title, text], index) => (
          <article className="interaction-step" key={title}>
            <span className="interaction-step__num">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="interaction-contact">
        <div>
          <span>Стартуем с удобного контакта</span>
          <p>Можно оставить телефон для обратного звонка или сразу написать в Telegram.</p>
        </div>
        <div className="interaction-contact__actions">
          <button className="button" type="button" data-lead-modal-open>Оставить заявку</button>
          <a className="button button--dark" href="https://t.me/ivann97n">Написать в Telegram</a>
        </div>
      </div>
    </section>
  );
}
