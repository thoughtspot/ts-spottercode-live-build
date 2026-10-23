import { EmbedPlaceholder } from "@/components/EmbedPlaceholder";

export default function ChatPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Chat</h1>
      <EmbedPlaceholder
        title="Chat placeholder"
        description="ThoughtSpot Spotter will be embedded here."
      />
    </>
  );
}
