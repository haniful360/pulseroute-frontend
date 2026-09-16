interface DynamicPageHeaderProps {
  title: string;
  description?: string;
}

const DynamicPageHeader = ({ title, description }: DynamicPageHeaderProps) => {
  return (
    <div className="mb-5">
      <h2 className="text-dark-primary text-xl font-bold sm:text-2xl">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-[#94A3B8] sm:text-base">{description}</p>}
    </div>
  );
};

export default DynamicPageHeader;
