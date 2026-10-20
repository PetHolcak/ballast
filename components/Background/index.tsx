export function Background() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-zinc-50 dark:bg-zinc-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-120 w-180 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-400/30 via-fuchsia-400/20 to-sky-400/20 blur-3xl dark:from-violet-600/25 dark:via-fuchsia-600/15 dark:to-sky-600/10" />
    </>
  );
}
