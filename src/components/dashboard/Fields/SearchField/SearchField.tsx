'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
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
    <div className="w-full max-w-lg">
      <InputField
        defaultValue={searchParams.get(queryKey) || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        icon={<Search className="text-slate-400" size={18} />}
      />
    </div>
  );
};

export default SearchField;
