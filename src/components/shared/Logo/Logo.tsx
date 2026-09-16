import logo from '@/assets/main/icons/agent-arum-logo.svg';
import Image from 'next/image';
import Link from 'next/link';

interface LogoComponentProps {
  iconSize?: number;
  className?: string;
}

const Logo = ({ iconSize = 40, className = 'text-xl sm:text-2xl' }: LogoComponentProps) => {
  return (
    <Link href={'/'} className="flex items-center gap-2.5">
      <Image
        src={logo}
        width={iconSize}
        height={iconSize}
        priority
        alt="AgentArum Logo"
        className="object-contain"
      />
      <h4 className={`font-bold text-nowrap text-[#1E3A5F] ${className}`}>
        Agent<span className="text-gold">Arum</span>
      </h4>
    </Link>
  );
};
export default Logo;
