import type {
  AdminUser,
  AuditEntry,
  BusinessDetails,
  DashboardStats,
  GalleryImage,
  HomepageContent,
  OfferContent,
  SiteContent,
  TreatmentContent,
} from "../../../cms/shared/types";

export type GalleryRecord = GalleryImage & {
  variants: Record<string, { key: string; width: number; type: string; bytes?: number }>;
};

export class ApiRequestError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fields = fields;
  }
}

let unauthorisedHandler: (() => void) | null = null;

/** Lets the app return to the sign-in screen when a session expires. */
export function setUnauthorisedHandler(handler: (() => void) | null): void {
  unauthorisedHandler = handler;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "x-cms-request": "1",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !path.endsWith("/login") && !path.endsWith("/session")) {
      unauthorisedHandler?.();
    }
    const message =
      (data as { error?: { message?: string } } | null)?.error?.message ??
      "Something went wrong. Please try again.";
    const fields =
      (data as { error?: { fields?: Record<string, string> } } | null)?.error?.fields ?? {};
    throw new ApiRequestError(message, response.status, fields);
  }

  return data as T;
}

export type Overview = {
  stats: DashboardStats;
  business: BusinessDetails;
  siteUrl: string;
  user: AdminUser;
  audit: AuditEntry[];
};

export type PreparedVariantPayload = { name: string; width: number; data: string };

export type SessionInfo = {
  user: AdminUser;
  site: { name: string; url: string };
};

export const api = {
  session: () => request<SessionInfo>("/api/admin/session"),
  login: (email: string, password: string) =>
    request<SessionInfo>("/api/admin/login", {
      method: "POST",
      body: { email, password },
    }),
  logout: () => request<{ ok: true }>("/api/admin/logout", { method: "POST" }),

  overview: () => request<Overview>("/api/admin/overview"),

  business: () => request<{ business: BusinessDetails }>("/api/admin/business"),
  updateBusiness: (business: BusinessDetails) =>
    request<{ business: BusinessDetails }>("/api/admin/business", {
      method: "PUT",
      body: business,
    }),

  homepage: () => request<{ homepage: HomepageContent }>("/api/admin/homepage"),
  updateHomepage: (homepage: HomepageContent) =>
    request<{ homepage: HomepageContent }>("/api/admin/homepage", {
      method: "PUT",
      body: homepage,
    }),

  treatments: () =>
    request<{ treatments: TreatmentContent[] }>("/api/admin/treatments"),
  createTreatment: (treatment: {
    title: string;
    tag: string | null;
    description: string;
    prices: { minutes: number; price: number }[];
  }) =>
    request<{ treatment: TreatmentContent }>("/api/admin/treatments", {
      method: "POST",
      body: treatment,
    }),
  updateTreatment: (
    id: string,
    treatment: {
      title: string;
      tag: string | null;
      description: string;
      prices: { minutes: number; price: number }[];
    }
  ) =>
    request<{ treatment: TreatmentContent }>(`/api/admin/treatments/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: treatment,
    }),
  archiveTreatment: (id: string, archived: boolean) =>
    request<{ treatments: TreatmentContent[] }>(
      `/api/admin/treatments/${encodeURIComponent(id)}/archive`,
      { method: "POST", body: { archived } }
    ),
  deleteTreatment: (id: string) =>
    request<void>(`/api/admin/treatments/${encodeURIComponent(id)}`, { method: "DELETE" }),

  offers: () => request<{ offers: OfferContent[] }>("/api/admin/offers"),
  createOffer: (offer: Omit<OfferContent, "id">) =>
    request<{ offer: OfferContent }>("/api/admin/offers", { method: "POST", body: offer }),
  updateOffer: (id: string, offer: Omit<OfferContent, "id">) =>
    request<{ offer: OfferContent }>(`/api/admin/offers/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: offer,
    }),
  toggleOffer: (id: string, enabled: boolean) =>
    request<{ offers: OfferContent[] }>(`/api/admin/offers/${encodeURIComponent(id)}/toggle`, {
      method: "POST",
      body: { enabled },
    }),
  deleteOffer: (id: string) =>
    request<void>(`/api/admin/offers/${encodeURIComponent(id)}`, { method: "DELETE" }),

  gallery: () => request<{ photos: GalleryRecord[] }>("/api/admin/gallery"),
  uploadPhoto: (payload: {
    alt: string;
    caption: string | null;
    width: number;
    height: number;
    variants: PreparedVariantPayload[];
  }) => request<{ photos: GalleryRecord[] }>("/api/admin/gallery", { method: "POST", body: payload }),
  updatePhoto: (id: string, meta: { alt: string; caption: string | null }) =>
    request<{ photos: GalleryRecord[] }>(`/api/admin/gallery/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: meta,
    }),
  reorderGallery: (ids: string[]) =>
    request<{ photos: GalleryRecord[] }>("/api/admin/gallery/reorder", {
      method: "POST",
      body: { ids },
    }),
  deletePhoto: (id: string) =>
    request<void>(`/api/admin/gallery/${encodeURIComponent(id)}`, { method: "DELETE" }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: true }>("/api/admin/account/password", {
      method: "POST",
      body: { currentPassword, newPassword },
    }),

  exportContent: () => request<SiteContent & Record<string, unknown>>("/api/admin/export"),
};
