"use client";

import { useBackButtonHandler } from "@/lib/useBackButton";
import Nav from "./nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useBackButtonHandler();
  return (
    <div className="w-full h-full flex">
      {children}
      <Nav />
    </div>
  );
}
