import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LegalPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full p-4 flex flex-col gap-4">
      <nav className="flex justify-between">
        <Button asChild className="font-black text-md" variant={"ghost"}>
          <Link href={"/"}>pennylist.</Link>
        </Button>
        <Button asChild>
          <Link href={"/login"}>Get Started</Link>
        </Button>
      </nav>
      {children}
      <Footer />
    </main>
  );
}
