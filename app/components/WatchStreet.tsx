"use client";

import { useState } from "react";
import type { Application, Filters } from "@/lib/types";
import AlertModal from "./AlertModal";

export default function WatchStreet({
  postcode,
  area,
  filters,
  nearby,
  onSave,
}: {
  postcode: string;
  area: string;
  filters: Filters;
  nearby: Application[];
  onSave: (postcode: string, area: string, filters: Filters, email: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-brand-500 py-2.5 pl-4 pr-5 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition hover:bg-brand-600"
      >
        🔔 Create alert for this area
      </button>

      {open && (
        <AlertModal
          postcode={postcode}
          area={area}
          filters={filters}
          nearby={nearby}
          onCreate={(email) => onSave(postcode, area, filters, email)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
