const buttonVariants = {
  primary: 'button',
  dark: 'button button--dark',
  quizBack: 'quiz-nav__back',
  quizOption: 'quiz-option',
  modalOverlay: 'lead-modal__overlay',
  modalClose: 'lead-modal__close',
};

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

export default function Button({
  active = false,
  children,
  className = '',
  href,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const Component = href ? 'a' : 'button';
  const variantClassName = buttonVariants[variant] || buttonVariants.primary;
  const activeClassName = active && variant === 'quizOption' ? 'quiz-option--active' : '';
  const elementProps = href ? { href } : { type };

  return (
    <Component
      className={joinClassNames(variantClassName, activeClassName, className)}
      {...elementProps}
      {...props}
    >
      {children}
    </Component>
  );
}
