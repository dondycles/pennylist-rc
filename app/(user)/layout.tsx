"use client";

import Nav from "./nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex">
      {children}
      <Nav />
    </div>
  );
}
