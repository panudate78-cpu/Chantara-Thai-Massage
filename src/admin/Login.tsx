import { useState, type FormEvent } from "react";
import { SITE_NAME, SITE_URL } from "../../cms/shared/site";
import { api, ApiRequestError, type SessionInfo } from "./lib/api";
import { Button, Field, TextInput } from "./ui";
import { CheckIcon, ExternalIcon } from "./icons";

const HIGHLIGHTS = [
  "Update prices and treatments in seconds",
  "Publish or pause offers without a developer",
  "Photos resized and optimised automatically",
  "Your SEO settings stay locked and safe",
];

export default function Login({
  onSuccess,
  notice,
}: {
  onSuccess: (session: SessionInfo) => void;
  notice?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await api.login(email.trim(), password);
      onSuccess(session);
    } catch (caught) {
      setError(
        caught instanceof ApiRequestError
          ? caught.message
          : "We couldn't reach the server. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f2e9] font-sans text-ink lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="pattern-dots-light relative hidden overflow-hidden bg-forest-deep px-12 py-14 text-ivory lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-forest text-gold-soft">
              <span className="font-display text-2xl font-semibold">C</span>
            </span>
            <div>
              <p className="font-display text-2xl font-semibold leading-none text-ivory">{SITE_NAME}</p>
              <p className="mt-1.5 text-[9.5px] font-bold uppercase tracking-[0.36em] text-gold-soft">
                Content manager
              </p>
            </div>
          </div>

          <h1 className="mt-16 max-w-md font-display text-5xl font-medium leading-[1.06]">
            Your website,
            <br />
            <span className="italic text-gold-soft">in your hands.</span>
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-cream/65">
            Keep every detail of Chantara up to date — prices, opening hours, offers and photos —
            without waiting for a developer.
          </p>

          <ul className="mt-10 space-y-3.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-cream/75">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-soft/15 text-gold-soft">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-auto pt-12 text-[11px] uppercase tracking-[0.2em] text-cream/35">
          Built by Launchpad Studio
        </div>
      </aside>

      <main className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-forest text-gold-soft">
                <span className="font-display text-xl font-semibold">C</span>
              </span>
              <div>
                <p className="font-display text-xl font-semibold leading-none text-forest-deep">
                  {SITE_NAME}
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-gold-deep">
                  Content manager
                </p>
              </div>
            </div>
          </div>

          <h2 className="font-display text-4xl font-semibold text-forest-deep">Welcome back</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
            Sign in with the email address and password for your website.
          </p>

          {notice && (
            <p className="mt-5 rounded-lg border border-[#dcd2bb] bg-[#fbf8f0] px-4 py-3 text-[13px] text-ink/70">
              {notice}
            </p>
          )}

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <Field label="Email address" htmlFor="login-email">
              <TextInput
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="username"
                autoFocus
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password" htmlFor="login-password">
              <div className="relative">
                <TextInput
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="pr-[4.5rem]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 px-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-forest/70 hover:text-forest"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800"
              >
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full py-3">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-[13px] leading-relaxed text-ink/50">
            Forgotten your password? Ask Launchpad Studio to reset it for you — we'll never ask you
            to share it by email.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#e7dec9] pt-5">
            <a
              href={SITE_URL}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest/70 transition-colors hover:text-forest"
            >
              <ExternalIcon className="h-3.5 w-3.5" />
              Back to the website
            </a>
            <span className="text-[13px] font-semibold text-ink/40">
              Built by Launchpad Studio
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
