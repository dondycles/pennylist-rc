import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LegalPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full p-4 flex flex-col gap-4">
      <nav className="flex justify-between">
        <Button asChild className="font-black text-md" variant={"ghost"}>
          <Link href={"/"}>pennylist.</Link>
        </Button>
        <Button>Get Started</Button>
      </nav>
      {children}
      <footer className="flex flex-row flex-wrap justify-between w-full gap-4 p-4 text-sm text-muted-foreground">
        <Link href={"/"}>© pennylist. 2024 </Link>
        <div className="flex flex-row gap-4">
          <Link href={"/privacypolicy"}>Privacy Policy</Link>
          <Link href={"/termsandconditions"}>Terms and Conditions</Link>
        </div>
      </footer>
    </main>
  );
}
