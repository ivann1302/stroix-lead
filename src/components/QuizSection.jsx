import { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import { quizHighlights, quizLeadSources } from '../data/home';
import { sendLead } from '../lib/sendLead';

const STORAGE_KEY = 'stroix.quiz.progress.v1';
const SUBMISSIONS_KEY = 'stroix.quiz.submissions.v1';

const defaultAnswers = {
  city: '',
  lead_source: '',
  monthly_leads: '',
  min_order: '',
  name: '',
  phone: '',
};

const quizSteps = [
  {
    id: 'city',
    label: 'Вопрос 1',
    title: 'Какой город?',
    placeholder: 'Например, Казань',
    type: 'text',
    autoComplete: 'address-level2',
  },
  {
    id: 'lead_source',
    label: 'Вопрос 2',
    title: 'Как получаете заявки сейчас?',
    type: 'choice',
    options: quizLeadSources,
  },
  {
    id: 'monthly_leads',
    label: 'Вопрос 3',
    title: 'Сколько заявок бизнес получает в месяц?',
    placeholder: 'Например, 10-15 заявок',
    type: 'text',
  },
  {
    id: 'min_order',
    label: 'Вопрос 4',
    title: 'Какой минимальный объем заказа берете?',
    placeholder: 'Например, от 80 м²',
    type: 'text',
  },
  {
    id: 'contact',
    label: 'Вопрос 5',
    title: 'Как к Вам обращаться и куда позвонить?',
    type: 'contact',
  },
];

function readSavedProgress() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveSubmission(payload) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const saved = window.localStorage.getItem(SUBMISSIONS_KEY);
    const submissions = saved ? JSON.parse(saved) : [];
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([payload, ...submissions].slice(0, 10)));
  } catch {
    // The success screen should not depend on browser storage availability.
  }
}

export default function QuizSection() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [validationError, setValidationError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStep = quizSteps[stepIndex];
  const isLastStep = stepIndex === quizSteps.length - 1;
  const progress = Math.round(((stepIndex + 1) / quizSteps.length) * 100);

  const summaryText = useMemo(() => {
    return [
      `Город: ${answers.city || '-'}`,
      `Заявки сейчас: ${answers.lead_source || '-'}`,
      `Заявок в месяц: ${answers.monthly_leads || '-'}`,
      `Минимальный заказ: ${answers.min_order || '-'}`,
      `Имя: ${answers.name || '-'}`,
      `Телефон: ${answers.phone || '-'}`,
    ].join('\n');
  }, [answers]);

  useEffect(() => {
    const saved = readSavedProgress();

    if (saved) {
      setAnswers({ ...defaultAnswers, ...saved.answers });
      setStepIndex(Math.min(Number(saved.stepIndex) || 0, quizSteps.length - 1));
      setIsSubmitted(Boolean(saved.isSubmitted));
    }

    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (!isRestored || typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, stepIndex, isSubmitted }));
    } catch {
      // The quiz should keep working even if localStorage is unavailable.
    }
  }, [answers, isRestored, isSubmitted, stepIndex]);

  const updateAnswer = (name, value) => {
    setAnswers((current) => ({ ...current, [name]: value }));
    setValidationError('');
  };

  const validateStep = (step = currentStep) => {
    if (step.type === 'contact') {
      if (!answers.name.trim() || !answers.phone.trim()) {
        return 'Заполните имя и номер телефона.';
      }

      return '';
    }

    if (!answers[step.id]?.trim()) {
      return step.type === 'choice' ? 'Выберите один из вариантов.' : 'Заполните поле, чтобы перейти дальше.';
    }

    return '';
  };

  const goNext = () => {
    const error = validateStep();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');
    setStepIndex((current) => Math.min(current + 1, quizSteps.length - 1));
  };

  const goBack = () => {
    setValidationError('');
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const resetQuiz = () => {
    setAnswers({ ...defaultAnswers });
    setStepIndex(0);
    setValidationError('');
    setIsSending(false);
    setIsSubmitted(false);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage cleanup failures.
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validateStep(quizSteps[quizSteps.length - 1]);

    if (error) {
      setValidationError(error);
      return;
    }

    setIsSending(true);
    setValidationError('');

    const payload = {
      ...answers,
      source: 'Квиз',
      summary: summaryText,
      createdAt: new Date().toISOString(),
    };

    try {
      await sendLead(payload);
      saveSubmission(payload);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stroix:quiz-submit', { detail: payload }));
      }

      setIsSubmitted(true);
    } catch (submitError) {
      setValidationError(submitError.message || 'Не удалось отправить заявку. Попробуйте еще раз.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="quiz-section" id="quiz" data-reveal="section">
      <div className="quiz-section__head" data-reveal="item">
        <p className="eyebrow">Короткий квиз перед запуском</p>
        <h2>Ответьте на 5 вопросов, чтобы я понял, какой поток лидов нужен Вашей бригаде</h2>
      </div>

      <div className="quiz-layout">
        <div className="quiz-aside" data-reveal="panel" data-reveal-delay="1">
          <span className="quiz-aside__label">Что это даст</span>
          <ul>
            {quizHighlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p>Ответы сохраняются в браузере. Если обновить страницу, можно продолжить с того же места.</p>
        </div>

        <form className="quiz-form" onSubmit={handleSubmit} data-reveal="panel" data-reveal-delay="2">
          <div className="quiz-card">
            {isSubmitted ? (
              <div className="quiz-success" role="status" aria-live="polite">
                <span className="quiz-success__mark">✓</span>
                <h3>Заявка отправлена</h3>
                <p>Спасибо, {answers.name || 'заявка принята'}. Скоро я свяжусь с Вами и уточню детали по запуску заявок.</p>
                <Button variant="quizBack" onClick={resetQuiz}>
                  Заполнить заново
                </Button>
              </div>
            ) : (
              <>
                <div className="quiz-progress" aria-label={`Шаг ${stepIndex + 1} из ${quizSteps.length}`}>
                  <div className="quiz-progress__top">
                    <span>{currentStep.label}</span>
                    <b>{progress}%</b>
                  </div>
                  <div className="quiz-progress__bar">
                    <span style={{ width: `${progress}%` }}></span>
                  </div>
                </div>

                <div className="quiz-question">
                  <h3>{currentStep.title}</h3>

                  {currentStep.type === 'choice' && (
                    <div className="quiz-options">
                      {currentStep.options.map((option) => (
                        <Button
                          active={answers[currentStep.id] === option}
                          key={option}
                          variant="quizOption"
                          onClick={() => updateAnswer(currentStep.id, option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {currentStep.type === 'text' && (
                    <input
                      type="text"
                      value={answers[currentStep.id]}
                      placeholder={currentStep.placeholder}
                      autoComplete={currentStep.autoComplete}
                      aria-invalid={Boolean(validationError)}
                      aria-describedby={validationError ? 'quiz-validation-error' : undefined}
                      onChange={(event) => updateAnswer(currentStep.id, event.target.value)}
                    />
                  )}

                  {currentStep.type === 'contact' && (
                    <div className="quiz-contact-step">
                      <input
                        type="text"
                        value={answers.name}
                        placeholder="Ваше имя"
                        autoComplete="name"
                        required
                        aria-invalid={Boolean(validationError && !answers.name.trim())}
                        aria-describedby={validationError ? 'quiz-validation-error' : undefined}
                        onChange={(event) => updateAnswer('name', event.target.value)}
                      />
                      <input
                        type="tel"
                        value={answers.phone}
                        placeholder="Номер телефона"
                        autoComplete="tel"
                        required
                        aria-invalid={Boolean(validationError && !answers.phone.trim())}
                        aria-describedby={validationError ? 'quiz-validation-error' : undefined}
                        onChange={(event) => updateAnswer('phone', event.target.value)}
                      />
                    </div>
                  )}

                  {validationError && (
                    <p className="quiz-question__error" id="quiz-validation-error" role="alert">
                      {validationError}
                    </p>
                  )}
                </div>

                <input name="city" type="hidden" value={answers.city} readOnly />
                <input name="lead_source" type="hidden" value={answers.lead_source} readOnly />
                <input name="monthly_leads" type="hidden" value={answers.monthly_leads} readOnly />
                <input name="min_order" type="hidden" value={answers.min_order} readOnly />
                <input name="name" type="hidden" value={answers.name} readOnly />
                <input name="phone" type="hidden" value={answers.phone} readOnly />
                <input name="text" type="hidden" value={summaryText} readOnly />

                <div className="quiz-nav">
                  <Button variant="quizBack" onClick={goBack} disabled={stepIndex === 0}>
                    Назад
                  </Button>
                  {isLastStep ? (
                    <Button type="submit" disabled={isSending}>
                      {isSending ? 'Отправляю...' : 'Отправить заявку'}
                    </Button>
                  ) : (
                    <Button onClick={goNext}>Далее</Button>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
