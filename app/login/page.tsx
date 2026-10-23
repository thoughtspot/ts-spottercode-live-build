"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: credentials are intentionally not checked or sent anywhere.
    // Real authentication (ThoughtSpot Trusted Auth) is added later.
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-foreground/10 p-8"
      >
        <div>
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Sign in to Acme Analytics.
          </p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 font-normal"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Log in
        </button>

        <Link
          href="/"
          className="text-center text-sm text-foreground/60 hover:text-foreground"
        >
          Back to home
        </Link>
      </form>
    </div>
  );
}
