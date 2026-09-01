"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayButton({
  amountLabel,
  onAuthorized,
}: {
  amountLabel: string;
  onAuthorized: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Fehler bei der Zahlungseingabe.");
      setSubmitting(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Zahlung fehlgeschlagen.");
      setSubmitting(false);
      return;
    }

    if (
      paymentIntent &&
      (paymentIntent.status === "requires_capture" || paymentIntent.status === "succeeded")
    ) {
      onAuthorized(paymentIntent.id);
    } else {
      setError("Zahlung konnte nicht autorisiert werden.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border-2 border-black p-6">
      <h3 className="text-lg font-bold">Zahlungsdaten</h3>
      <div className="mt-4">
        <PaymentElement />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handlePay}
        disabled={submitting || !stripe}
        className="mt-6 w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
      >
        {submitting ? "Wird autorisiert…" : `Zahlung autorisieren (${amountLabel})`}
      </button>
      <p className="mt-2 text-center text-xs text-zinc-500">
        Es wird nur der Höchstbetrag autorisiert. Belastet wird erst bei Drop-Ende der
        tatsächlich erreichte, niedrigere Bestpreis.
      </p>
    </div>
  );
}

export function StripePaymentStep({
  clientSecret,
  amountLabel,
  onAuthorized,
}: {
  clientSecret: string;
  amountLabel: string;
  onAuthorized: (paymentIntentId: string) => void;
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <PayButton amountLabel={amountLabel} onAuthorized={onAuthorized} />
    </Elements>
  );
}
