import { useState } from 'react';
import { sendLead } from '../lib/sendLead';

const growthBars = ['32%', '48%', '68%', '88%'];

export default function HeroSection() {
  const [contact, setContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setSubmitError('');

    const payload = {
      source: 'Форма в первом экране',
      name: 'Не указано',
      phone: contact,
      comment: 'Запрос расчета заявок',
    };

    try {
      await sendLead(payload);
      setIsSubmitted(true);
      setContact('');
    } catch (error) {
      setSubmitError(error.message || 'Не удалось отправить заявку. Попробуйте еще раз.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="hero">
      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">Сервис заявок для бригад по стяжке</p>
        <h1><span>50+ заявок</span> в месяц для вашей бригады по стяжке пола</h1>
        <p className="lead">Я даю Вам в аренду сайт, точечно настраиваю и подключаю рекламу, организую систему по приему заявок. Как итог: Вы занимаетесь работой, а не поиском клиентов.</p>
        <div className="hero__proof">
          <span>Гарантия</span>
          <strong>Первые лиды через 48 часов</strong>
        </div>
        <form className="hero-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="phone">Ваш телефон</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={contact}
            placeholder="Телефон или Telegram"
            autoComplete="tel"
            required
            onChange={(event) => {
              setContact(event.target.value);
              setSubmitError('');
              setIsSubmitted(false);
            }}
          />
          <button className="button" type="submit" disabled={isSending}>
            {isSending ? 'Отправляю...' : 'Получить расчет заявок'}
          </button>
        </form>
        {submitError && (
          <p className="hero-form__message hero-form__message--error" role="alert">
            {submitError}
          </p>
        )}
        {isSubmitted && (
          <p className="hero-form__message" role="status">
            Заявка отправлена. Скоро я свяжусь с Вами.
          </p>
        )}
        <p className="trust">Первые 5 лидов - за мой счет. Работаю лично, без менеджеров и ботов.</p>
      </div>
      <div className="hero__visual" aria-label="Что меняется после запуска системы заявок">
        <div className="hero-panel__header">
          <span>До / После запуска</span>
          <b>простым языком</b>
        </div>

        <div className="hero-change">
          <article className="hero-change__card hero-change__card--before">
            <b>Сейчас</b>
            <ul>
              <li>Заказы приходят случайно</li>
              <li>Нужно самому искать клиентов</li>
              <li>Непонятно, будут ли заявки завтра</li>
            </ul>
          </article>
          <article className="hero-change__card hero-change__card--after">
            <b>После запуска</b>
            <ul>
              <li>Заявки приходят в Telegram</li>
              <li>Видите цену каждой заявки</li>
              <li>Платите только за целевых клиентов</li>
            </ul>
          </article>
        </div>

        <div className="hero-growth">
          <div className="hero-growth__top">
            <span>График привлечения заявок</span>
            <strong>100+</strong>
          </div>
          <div className="hero-growth__chart" aria-hidden="true">
            {growthBars.map((height) => (
              <span key={height} style={{ height }}></span>
            ))}
          </div>
          <div className="hero-growth__labels">
            <span>1 неделя</span>
            <span>2 неделя</span>
            <span>месяц</span>
          </div>
        </div>

        <div className="hero-note">
          <span>Риск беру на себя</span>
          <b>Если не пойдут целевые заявки - возвращаю оплату за настройку.</b>
        </div>
      </div>
    </section>
  );
}
