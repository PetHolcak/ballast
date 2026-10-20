import { Background } from "@/components/Background";
import { Generator } from "@/components/Generator";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-20">
      <Background />
      <div className="w-full max-w-xl">
        <Header />
        <Generator />
      </div>
    </main>
  );
}
