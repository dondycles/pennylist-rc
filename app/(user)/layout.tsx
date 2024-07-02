"use client";

import Nav from "../../components/nav";

export default function ListLayout({
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
