'use client';

import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

interface PaginationProps {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const CustomPagination: React.FC<PaginationProps> = ({ meta }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setQuery, searchParams } = useSetSearchQueryInURL();

  const { total: totalItems, limit: pageSize, totalPages } = meta;

  // Get current page from URL or meta, default to 1
  const currentPage = Number(searchParams.get('page')) || 1;

  const handlePageChange = (page: number) => {
    setQuery('page', page);
  };

  useEffect(() => {
    if (!searchParams.get('page')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 px-5 py-3 md:justify-between">
      {/* Info */}
      <div className="text-gray text-sm">
        Showing <span className="font-medium">{start}</span> to{' '}
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalItems}</span> Files
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="hover:bg-primary/20 flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          <BsArrowLeftShort /> <span>Prev</span>
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            disabled={page === '...'}
            onClick={() => page !== '...' && handlePageChange(Number(page))}
            className={`cursor-pointer rounded-sm border px-3 py-1 text-sm transition-all duration-300 ${
              currentPage === page
                ? 'bg-primary border-primary-100 text-white'
                : 'hover:bg-primary/40'
            } ${page === '...' ? 'cursor-default border-none' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="hover:bg-primary/20 flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          <span>Next</span> <BsArrowRightShort />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
