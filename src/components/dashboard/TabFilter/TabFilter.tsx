'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface TabItem {
  name: string;
  component: React.ReactNode;
}

interface TabFilterProps {
  tabs: TabItem[];
}

export default function TabFilter({ tabs }: TabFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || tabs[0].name;

  const handleTabChange = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', name);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabChange(tab.name)}
            className={`cursor-pointer rounded-sm border px-6 py-2 text-sm font-medium transition-all ${
              activeTab === tab.name
                ? 'bg-primary border-primary hover:bg-primary/90 text-white'
                : 'border-primary/40 text-primary hover:bg-muted/10 bg-transparent'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div>{tabs.find((tab) => tab.name === activeTab)?.component}</div>
    </div>
  );
}
