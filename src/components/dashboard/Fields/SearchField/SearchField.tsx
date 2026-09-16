'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface SearchFieldProps {
  placeholder?: string;
  queryKey?: string;
}

const SearchField = ({ placeholder = 'Search...', queryKey = 'search' }: SearchFieldProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim() === '') {
      params.delete(queryKey);
    } else {
      params.set(queryKey, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-lg">
      <Search className="text-muted absolute top-1/2 left-3 -translate-y-1/2" size={18} />
      <Input
        type="text"
        defaultValue={searchParams.get(queryKey) || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="bg-muted/5 border-muted/10 focus:ring-primary w-full rounded-md border py-5 pr-4 pl-10 shadow-none transition-all focus:ring-1 focus:outline-none"
      />
    </div>
  );
};

export default SearchField;
