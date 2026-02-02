import { HomeIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import React from "react";

type BreadcrumbListItem = {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function BreadCrumbsRenderer({ breadcrumbs }: { breadcrumbs: BreadcrumbListItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <HomeIcon size={16} aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={`fragment-${index}`}>
            <BreadcrumbSeparator key={`separator-${index}`} />
            <BreadcrumbItem key={`item-${index}`}>
              {breadcrumb.isCurrent ? (
                <BreadcrumbPage>
                  {breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}