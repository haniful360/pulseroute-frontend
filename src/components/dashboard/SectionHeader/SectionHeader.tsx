import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  subtitleColor = '#616161',
}) => {
  return (
    <div className="space-y-1.5">
      <h1 className="text-primary-text text-2xl leading-7.5 font-semibold md:text-3xl">{title}</h1>

      <p className="font-normal md:text-lg" style={{ color: subtitleColor }}>
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
