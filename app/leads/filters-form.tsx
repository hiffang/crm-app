"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function FiltersForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string" && value.trim()) {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/leads?${params.toString()}`);
    });
  };

  return (
    <form className="grid gap-4 md:grid-cols-4" onChange={handleChange}>
      {children}
    </form>
  );
}
