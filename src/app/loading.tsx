export default function GlobalLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading content...</p>
      </div>
    </main>
  );
}
