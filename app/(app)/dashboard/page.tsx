import { EmbedPlaceholder } from "@/components/EmbedPlaceholder";

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <EmbedPlaceholder
        title="Dashboard placeholder"
        description="A ThoughtSpot dashboard will be embedded here."
      />
    </>
  );
}
