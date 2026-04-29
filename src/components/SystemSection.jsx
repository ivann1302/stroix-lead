import { systemBenefits, systemChannels } from '../data/home';

export default function SystemSection() {
  return (
    <section className="system-section" id="system">
      <div className="system-section__head">
        <p className="eyebrow">Почему это лучше случайных каналов</p>
        <h2>Сарафан, площадки и доски объявлений дают заявки рывками. <span>Система дает управляемый поток.</span></h2>
      </div>

      <div className="system-compare">
        <div className="system-compare__side">
          <span className="system-compare__label">Обычно</span>
          <h3>Заявки зависят не от Вас</h3>
          <ul>
            {systemChannels.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="system-compare__side system-compare__side--active">
          <span className="system-compare__label">В системе</span>
          <h3>Вы управляете потоком лидов</h3>
          <p>Сайт, реклама, аналитика и прием заявок работают вместе. Вы видите, откуда пришел клиент, что ему нужно и стоит ли брать его в работу.</p>
        </div>
      </div>

      <div className="system-benefits">
        {systemBenefits.map(([title, text]) => (
          <article className="system-benefit" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
