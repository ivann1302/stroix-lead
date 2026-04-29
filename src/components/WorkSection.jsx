import { workSteps } from '../data/home';

export default function WorkSection() {
  return (
    <section className="work-section" id="work">
      <div className="work-section__head">
        <p className="eyebrow">Как происходит работа</p>
        <h2>Я собираю систему заявок под ключ, Вы выбираете клиентов</h2>
      </div>

      <ol className="work-steps">
        {workSteps.map((step, index) => (
          <li className="work-step" key={step}>
            <span className="work-step__num">{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
