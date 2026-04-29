import { useEffect, useRef, useState } from 'react';
import { sendLead } from '../lib/sendLead';

const SUBMISSIONS_KEY = 'stroix.lead.submissions.v1';

const defaultForm = {
  name: '',
  phone: '',
  comment: '',
};

function saveLead(payload) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const saved = window.localStorage.getItem(SUBMISSIONS_KEY);
    const submissions = saved ? JSON.parse(saved) : [];
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([payload, ...submissions].slice(0, 10)));
  } catch {
    // Sending feedback should not depend on browser storage availability.
  }
}

export default function LeadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState(defaultForm);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const openModal = (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest('[data-lead-modal-open]')
        : null;

      if (!trigger) {
        return;
      }

      event.preventDefault();
      setIsOpen(true);
      setIsSubmitted(false);
      setSubmitError('');
    };

    document.addEventListener('click', openModal);

    return () => document.removeEventListener('click', openModal);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    window.setTimeout(() => nameInputRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitError('');
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setSubmitError('');

    const payload = {
      ...form,
      source: 'Модальная форма',
      createdAt: new Date().toISOString(),
    };

    try {
      await sendLead(payload);
      saveLead(payload);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stroix:lead-submit', { detail: payload }));
      }

      setIsSubmitted(true);
      setForm(defaultForm);
    } catch (error) {
      setSubmitError(error.message || 'Не удалось отправить заявку. Попробуйте еще раз.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="lead-modal" role="presentation">
      <button className="lead-modal__overlay" type="button" aria-label="Закрыть форму" onClick={closeModal}></button>
      <div className="lead-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
        <button className="lead-modal__close" type="button" aria-label="Закрыть" onClick={closeModal}>×</button>

        {isSubmitted ? (
          <div className="lead-modal__success" role="status" aria-live="polite">
            <span>✓</span>
            <h2 id="lead-modal-title">Заявка отправлена</h2>
            <p>Спасибо. Скоро я свяжусь с Вами, уточню детали и подскажу следующий шаг.</p>
            <button className="button" type="button" onClick={closeModal}>Понятно</button>
          </div>
        ) : (
          <>
            <div className="lead-modal__head">
              <p className="eyebrow">Оставить заявку</p>
              <h2 id="lead-modal-title">Напишите контакты, и я лично свяжусь с Вами</h2>
              <p>Можно коротко описать город, текущие заявки или задачу. Это поможет быстрее подготовить ответ.</p>
            </div>

            <form className="lead-modal__form" onSubmit={handleSubmit}>
              <label>
                <span>Имя</span>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={form.name}
                  placeholder="Как к Вам обращаться"
                  autoComplete="name"
                  required
                  onChange={(event) => updateField('name', event.target.value)}
                />
              </label>

              <label>
                <span>Телефон</span>
                <input
                  type="tel"
                  value={form.phone}
                  placeholder="+7 999 000-00-00"
                  autoComplete="tel"
                  required
                  onChange={(event) => updateField('phone', event.target.value)}
                />
              </label>

              <label>
                <span>Комментарий</span>
                <textarea
                  value={form.comment}
                  placeholder="Например: город, сколько заявок нужно, когда удобно созвониться"
                  rows="4"
                  onChange={(event) => updateField('comment', event.target.value)}
                />
              </label>

              {submitError && (
                <p className="lead-modal__error" role="alert">
                  {submitError}
                </p>
              )}

              <button className="button" type="submit" disabled={isSending}>
                {isSending ? 'Отправляю...' : 'Отправить заявку'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
