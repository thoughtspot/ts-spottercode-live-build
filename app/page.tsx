import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="flex max-w-xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Acme Analytics
        </h1>
        <p className="text-lg text-foreground/60">
          Your data, your dashboards, and answers in plain language.
        </p>
      </div>
      <Link
        href="/login"
        className="rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90"
      >
        Login
      </Link>
    </div>
  );
}
