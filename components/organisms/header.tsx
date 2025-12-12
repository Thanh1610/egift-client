'use client';

import StickyHeader from '@/components/organisms/stickyHeader';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/atoms/ModeToggle';
import {
  Navigation,
  MobileMenuButton,
} from '@/components/organisms/Navigation';
import { ROUTES } from '@/config/constain';
import AvatarDropDown from '@/components/molecules/ui/AvatarDropDown';
import { useUserStore } from '@/store/useUserStore';

function Header() {
  // Lấy user và profile từ Zustand store
  const user = useUserStore(state => state.user);
  const profile = useUserStore(state => state.profile);
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
          className="flex cursor-pointer justify-center md:justify-start"
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
        {/* ModeToggle và AvatarDropDown - Bên phải */}
        <div className="flex items-center justify-end gap-2">
          <ModeToggle />

          {user && (
            <AvatarDropDown
              avatarUrl={profile?.avatar_url || null}
              fallback={
                profile?.full_name?.[0]?.toUpperCase() ||
                user.email?.[0]?.toUpperCase() ||
                'U'
              }
            />
          )}
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
