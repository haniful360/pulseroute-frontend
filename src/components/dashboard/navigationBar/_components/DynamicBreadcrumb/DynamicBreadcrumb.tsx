'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split the pathname into segments
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList className="gap-1 sm:gap-2">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const isFirst = index === 0;
          const isSecond = index === 1;
          const label = segment.replace(/-/g, ' ');
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast || isFirst || isSecond ? (
                  <BreadcrumbPage
                    className={`${isLast ? 'font-semibold text-white' : 'text-secondary font-medium'} capitalize`}
                  >
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={href}
                    className="text-secondary hover:text-primary font-medium capitalize transition-colors"
                  >
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator className="text-gray">
                  <span className="text-sm opacity-70">{'>'}</span>
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
