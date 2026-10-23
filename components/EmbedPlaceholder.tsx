type EmbedPlaceholderProps = {
  title: string;
  description: string;
};

// Empty container where a ThoughtSpot embed will be rendered.
export function EmbedPlaceholder({ title, description }: EmbedPlaceholderProps) {
  return (
    <section className="flex min-h-[600px] flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-foreground/20 p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-foreground/60">{description}</p>
    </section>
  );
}
