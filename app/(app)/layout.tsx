import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
        {children}
      </main>
    </>
  );
}
