"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

export function SubPagesSelector({
  pages,
}: {
  pages: { title: string; href: string }[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = pages.find((page) => page.href === pathname);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue>{currentPage?.title}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {pages.map((page) => (
          <SelectItem
            key={page.href}
            value={page.href}
            onClick={() => router.push(page.href)}
          >
            {page.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
