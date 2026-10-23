import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../utils/cn";
import { CheckIcon, CloseIcon } from "./icons";

/* ------------------------------------------------------------------ buttons */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type ButtonSize = "sm" | "md";

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
    size === "md" && "px-4 py-2.5 text-sm",
    size === "sm" && "px-3 py-1.5 text-xs",
    variant === "primary" && "bg-forest text-ivory hover:bg-forest-deep",
    variant === "secondary" && "border border-forest/20 bg-white text-forest hover:border-forest/40 hover:bg-cream/40",
    variant === "ghost" && "text-forest/80 hover:bg-forest/[0.06] hover:text-forest",
    variant === "danger" && "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
    variant === "gold" && "bg-gold text-forest-deep hover:bg-gold-soft"
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(buttonClass(variant, size), className)}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("animate-spin", className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ layout */

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={cn("rounded-xl border border-[#e7dec9] bg-white shadow-[0_1px_2px_rgba(19,40,30,0.04)]", className)}>
      {children}
    </Tag>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-deep">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold leading-tight text-forest-deep sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/65">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "gold" | "red" | "blue";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em]",
        tone === "neutral" && "bg-ink/[0.06] text-ink/65",
        tone === "green" && "bg-emerald-50 text-emerald-800",
        tone === "gold" && "bg-gold/15 text-gold-deep",
        tone === "red" && "bg-red-50 text-red-700",
        tone === "blue" && "bg-sky-50 text-sky-800"
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- forms */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-forest-deep">
          {label}
          {required && <span className="ml-1 text-gold-deep" aria-hidden="true">*</span>}
        </span>
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[13px] leading-relaxed text-ink/50">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-[13px] font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const controlClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/35 shadow-[inset_0_1px_1px_rgba(19,40,30,0.03)] transition-colors focus:outline-none focus:ring-2 focus:ring-gold/25 disabled:bg-cream/50 disabled:text-ink/50";

export function TextInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(controlClass, invalid ? "border-red-300 focus:border-red-400" : "border-[#ded4bf] focus:border-gold", className)}
    />
  );
}

export function Textarea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(controlClass, "min-h-[110px] resize-y leading-relaxed", invalid ? "border-red-300 focus:border-red-400" : "border-[#ded4bf] focus:border-gold", className)}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(controlClass, "appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10", invalid ? "border-red-300" : "border-[#ded4bf] focus:border-gold", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23645940' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
    >
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-forest-deep">{label}</p>
        {description && <p className="mt-0.5 text-[13px] leading-relaxed text-ink/55">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:opacity-50",
          checked ? "bg-forest" : "bg-ink/20"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export function FormActions({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-[#e7dec9] bg-[#f6f2e9]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]">
        <p className="text-[13px] text-ink/50">{hint ?? "Changes go live on the website immediately."}</p>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ states */

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-ink/55">
      <Spinner className="h-6 w-6 text-forest" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#ded4bf] bg-white/60 px-6 py-12 text-center">
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-cream text-gold-deep">{icon}</div>}
      <h3 className="font-display text-xl font-semibold text-forest-deep">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/55">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "warning";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-[13px] leading-relaxed",
        tone === "info" && "border-[#dcd2bb] bg-[#fbf8f0] text-ink/70",
        tone === "success" && "border-emerald-200 bg-emerald-50/70 text-emerald-900",
        tone === "warning" && "border-amber-200 bg-amber-50/70 text-amber-900"
      )}
    >
      <span className="mt-0.5 shrink-0">
        {tone === "success" ? <CheckIcon className="h-4 w-4" /> : <span className="block h-4 w-4 rounded-full border border-current opacity-50" />}
      </span>
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ modals */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-forest-deep/45 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#fbf8f1] shadow-2xl outline-none sm:rounded-2xl",
          size === "sm" && "sm:max-w-md",
          size === "md" && "sm:max-w-xl",
          size === "lg" && "sm:max-w-3xl"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e7dec9] px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-2xl font-semibold text-forest-deep">
              {title}
            </h2>
            {description && <p className="mt-1 text-[13px] leading-relaxed text-ink/55">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/50 transition-colors hover:bg-forest/[0.06] hover:text-forest"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#e7dec9] bg-white/60 px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "default",
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[15px] leading-relaxed text-ink/70">{description}</p>
    </Modal>
  );
}

/* ------------------------------------------------------------------- toast */

type Toast = { id: number; message: string; tone: "success" | "error" };
type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: Toast["tone"]) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      window.setTimeout(() => remove(id), 5200);
    },
    [remove]
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message: string) => push(message, "success"),
      error: (message: string) => push(message, "error"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg",
              toast.tone === "success"
                ? "border-emerald-200 bg-white text-emerald-900"
                : "border-red-200 bg-white text-red-800"
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                toast.tone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              )}
            >
              {toast.tone === "success" ? <CheckIcon className="h-3.5 w-3.5" /> : <CloseIcon className="h-3.5 w-3.5" />}
            </span>
            <p className="flex-1 font-medium leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => remove(toast.id)}
              aria-label="Dismiss"
              className="text-ink/35 transition-colors hover:text-ink/70"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
