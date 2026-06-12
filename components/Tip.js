// Тултип-обёртка для ставочных терминов: наведение на десктопе, тап (focus) на телефоне.
export default function Tip({ hint, children, className, hoverOnly = false }) {
  const cls = (className ? className + ' ' : '') + 'tip';
  if (!hint) return <span className={className}>{children}</span>;
  return (
    <span className={cls} tabIndex={hoverOnly ? undefined : 0} data-tip={hint} role="note">
      {children}
    </span>
  );
}
