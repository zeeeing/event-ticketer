export function Hero() {
  return (
    <div className="flex flex-col gap-16 justify-center items-center">
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Your express ride straight into any event with{" "}
        <span className="font-bold hover:underline">Event Ticketer</span>.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
