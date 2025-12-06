import StickyHeader from '@/components/organisms/stickyHeader';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/atoms/ModeToggle';
import {
  Navigation,
  MobileMenuButton,
} from '@/components/organisms/Navigation';
import { ROUTES } from '@/config/constain';

function Header() {
  return (
    <StickyHeader className="flex flex-col items-center">
      {/* Mobile: Grid 3 cột (Menu, Logo giữa, ModeToggle) */}
      {/* Desktop: Flex justify-between (Logo trái, ModeToggle phải) */}
      <div className="grid w-full grid-cols-3 items-center md:flex md:justify-between">
        {/* Mobile Menu Button - Chỉ hiển thị trên mobile, bên trái */}
        <div className="flex justify-start md:hidden">
          <MobileMenuButton />
        </div>
        {/* Logo - Căn giữa trên mobile, bên trái trên desktop */}
        <Link
          href={ROUTES.HOME}
          className="flex justify-center md:justify-start cursor-pointer"
        >
          <div className="flex h-12 w-[148px] items-center">
            <Image
              src="/logo/egift365.svg"
              alt="Egift365"
              width={148}
              height={48}
              className="max-h-full max-w-full object-contain"
              unoptimized
              priority
            />
          </div>
        </Link>
        {/* ModeToggle - Bên phải */}
        <div className="flex items-center justify-end gap-2">
          <ModeToggle />
        </div>
      </div>
      {/* Navigation - Chỉ hiển thị trên desktop */}
      <div className="hidden w-full items-center justify-center px-4 py-3 md:flex md:px-6">
        <Navigation />
      </div>
    </StickyHeader>
  );
}

export default Header;
