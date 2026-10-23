import { useState, type FormEvent } from "react";
import { LIMITS } from "../../../cms/shared/limits";
import { SITE_NAME } from "../../../cms/shared/site";
import { api, ApiRequestError } from "../lib/api";
import {
  Button,
  Card,
  Field,
  Notice,
  PageHeader,
  TextInput,
  useToast,
} from "../ui";
import { DownloadIcon, LogOutIcon } from "../icons";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="border-b border-[#eee6d5] px-5 py-4 sm:px-6">
        <h2 className="font-display text-xl font-semibold text-forest-deep">{title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/50">{description}</p>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </Card>
  );
}

export default function Account({ onSignOut }: { onSignOut: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (newPassword !== confirmPassword) {
      setErrors({ newPassword: "The two new passwords don't match." });
      return;
    }
    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Your password has been updated.");
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setErrors(caught.fields);
        toast.error(caught.message);
      } else {
        toast.error("We couldn't update your password. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const downloadBackup = async () => {
    setDownloading(true);
    try {
      const data = await api.exportContent();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${SITE_NAME.toLowerCase().replace(/\s+/g, "-")}-content-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Your content backup has been downloaded.");
    } catch {
      toast.error("The backup couldn't be created. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Your account"
        title="My account"
        description="Change the password you use to sign in, download a copy of your content, or sign out of this device."
      />

      <div className="space-y-4">
        <Section
          title="Change password"
          description={`Use at least ${LIMITS.passwordMin} characters with a mix of letters and numbers. You'll stay signed in on this device.`}
        >
          <form onSubmit={changePassword} className="grid max-w-xl gap-4" noValidate>
            <Field
              label="Current password"
              htmlFor="current-password"
              required
              error={errors.currentPassword}
            >
              <TextInput
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                invalid={Boolean(errors.currentPassword)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password" htmlFor="new-password" required error={errors.newPassword}>
                <TextInput
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  invalid={Boolean(errors.newPassword)}
                />
              </Field>
              <Field
                label="Confirm new password"
                htmlFor="confirm-password"
                required
                error={errors.confirmPassword}
              >
                <TextInput
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  invalid={Boolean(errors.confirmPassword)}
                />
              </Field>
            </div>
            <div>
              <Button type="submit" loading={saving} disabled={!currentPassword || !newPassword}>
                Update password
              </Button>
            </div>
          </form>
        </Section>

        <Section
          title="Back up your content"
          description="Download everything you've written — business details, treatments, offers, homepage text and gallery descriptions — as a single file."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink/55">
              A backup is yours to keep. Photos themselves stay in your website's secure storage
              and are included when Launchpad Studio exports a full copy.
            </p>
            <Button variant="secondary" onClick={downloadBackup} loading={downloading}>
              <DownloadIcon className="h-4 w-4" />
              Download backup
            </Button>
          </div>
        </Section>

        <Section
          title="Sign out"
          description="If you're using a shared device, sign out when you've finished."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Notice>Your session ends automatically after 12 hours of inactivity.</Notice>
            <Button variant="secondary" onClick={onSignOut}>
              <LogOutIcon className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </Section>

        <p className="px-1 text-[12.5px] leading-relaxed text-ink/40">
          Need help with your account? Contact Launchpad Studio. We'll never ask for your password
          by email or message.
        </p>
      </div>
    </div>
  );
}
