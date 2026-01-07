"use client";
import { seedEntries } from "@/app/actions";
import { useState, useTransition } from "react";

export function SeedButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleClick = () => {
    startTransition(async () => {
      const result = await seedEntries(process.env.NEXT_PUBLIC_ADMIN_SECRET || null);
      setMessage(result.message);
    });
  };

  return (
    <div className="seed-container">
      <button onClick={handleClick} disabled={isPending}>
        {isPending ? "Seeding..." : "Seed Entries"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
