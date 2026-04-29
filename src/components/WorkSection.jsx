import { workSteps } from '../data/home';

export default function WorkSection() {
  return (
    <section className="work-section" id="work" data-reveal="section">
      <div className="work-section__head" data-reveal="item">
        <p className="eyebrow">Как происходит работа</p>
        <h2>Я собираю систему заявок под ключ, Вы выбираете клиентов</h2>
      </div>

      <ol className="work-steps">
        {workSteps.map((step, index) => (
          <li className="work-step" key={step} data-reveal="item" data-reveal-delay={String(Math.min(index + 1, 4))}>
            <span className="work-step__num">{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
