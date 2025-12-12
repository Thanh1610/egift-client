"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/config/constain";
import { Home } from "lucide-react";

export type BreadcrumbItemType = {
  label: string;
  href?: string; // Nếu không có href, sẽ render là BreadcrumbPage (current page)
};

type CustomBreadcrumbProps = {
  items: BreadcrumbItemType[];
  className?: string;
};

/**
 * Custom Breadcrumb component tái sử dụng
 * 
 * @example
 * <CustomBreadcrumb items={[
 *   { label: "Trang chủ", href: ROUTES.HOME },
 *   { label: "Kho quan niệm", href: ROUTES.CONCEPTS },
 *   { label: "Tên quan niệm" } // Current page, không có href
 * ]} />
 */
export default function CustomBreadcrumb({
  items,
  className,
}: CustomBreadcrumbProps) {
  // Luôn thêm "Trang chủ" vào đầu nếu chưa có
  const allItems: BreadcrumbItemType[] = items[0]?.href === ROUTES.HOME
    ? items
    : [{ label: "Trang chủ", href: ROUTES.HOME }, ...items];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="flex items-center gap-1">
                      {index === 0 && <Home className="h-3.5 w-3.5" />}
                      <span>{item.label}</span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-1 font-semibold">
                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

