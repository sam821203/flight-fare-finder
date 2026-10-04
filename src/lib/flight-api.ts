const API_URL =
  import.meta.env["VITE_FLIGHT_API_URL"] ??
  "https://gohn5cklvb.execute-api.us-east-1.amazonaws.com";

export type PlanName = "tokyo" | "seoul" | "london";

export type SubscriptionStatus = "pending_payment" | "active" | "cancelled" | "expired";

export type Subscription = {
  route: string;
  plan_name: PlanName;
  target_price: number;
  currency: string;
  updated_at?: string;
  subscription_status?: SubscriptionStatus | undefined;
  current_period_end_date?: string | null | undefined;
};

export async function fetchSubscriptions(email: string): Promise<Subscription[]> {
  const res = await fetch(`${API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`Failed to load subscriptions (${res.status})`);
  const data = (await res.json()) as { subscriptions: Subscription[] };
  return data.subscriptions;
}

export async function saveSubscription(email: string, planName: PlanName, targetPrice: number) {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, plan_name: planName, target_price: targetPrice }),
  });
  const contentType = res.headers.get("content-type") ?? "";
  if (res.ok && contentType.includes("text/html")) {
    const html = await res.text();
    document.open();
    document.write(html);
    document.close();
    return null;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Failed to subscribe (${res.status})`);
  return data as {
    route: string;
    plan_name: PlanName;
    target_price: number;
    subscription_status?: SubscriptionStatus;
    current_period_end_date?: string | null;
  };
}

export async function cancelSubscription(email: string, route: string) {
  const res = await fetch(`${API_URL}/cancel`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, route }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Failed to cancel (${res.status})`);
  return data as {
    route: string;
    subscription_status: SubscriptionStatus;
    current_period_end_date?: string;
  };
}
