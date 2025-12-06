'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronDown, X } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/** Menu item đơn giản chỉ có title và href */
type SimpleMenuItem = {
  title: string;
  href: string;
};

/** Menu item có description (dùng cho ListItem) */
type MenuItemWithDescription = {
  title: string;
  href: string;
  description: string;
};

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

/** Danh sách các items cho menu "Hành trình Trưởng thành" */
const journeyItems: SimpleMenuItem[] = [
  {
    title: 'Bản đồ Chuyển hóa',
    href: '/journey/map',
  },
  {
    title: 'Game Hành trình Trưởng thành',
    href: '/journey/game',
  },
  {
    title: 'Vòng quay Tri thức',
    href: '/journey/wheel',
  },
];

/** Danh sách các items cho menu "Mentor Master" */
const mentorMasterItems: SimpleMenuItem[] = [
  {
    title: 'Ghi danh Thành Mentor Master',
    href: '/mentor/register',
  },
  {
    title: 'Ưu đãi Dành cho Mentor/Master',
    href: '/mentor/benefits',
  },
];

/** Danh sách các items cho menu "Kho Quan niệm" */
const conceptItems: SimpleMenuItem[] = [
  {
    title: 'Tất cả Quan niệm',
    href: '/concepts/all',
  },
  {
    title: 'Vòng quay Quan niệm',
    href: '/concepts/wheel',
  },
];

/** Danh sách các items cho menu "Kho Tri thức" */
const knowledgeItems: MenuItemWithDescription[] = [
  {
    title: 'Kho Tri thức',
    href: '/docs',
    description:
      'Nơi lưu trữ và chia sẻ các bài viết, tài liệu tri thức quý giá theo chủ đề.',
  },
  {
    title: 'Bộ Khái niệm',
    href: '/docs/installation',
    description:
      'Tập hợp các khái niệm cốt lõi được giải thích chi tiết để áp dụng thực tế.',
  },
  {
    title: 'Thẻ Tri thức',
    href: '/docs/primitives/typography',
    description:
      'Các thẻ tri thức ngắn gọn, dễ nhớ để nắm bắt nhanh kiến thức quan trọng.',
  },
  {
    title: 'Các khóa học',
    href: '/docs/primitives/typography',
    description:
      'Tham gia các khóa học từ cơ bản đến nâng cao phù hợp mọi trình độ.',
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Component dropdown menu đơn giản - dùng cho các menu chỉ có danh sách links
 * @param title - Tiêu đề menu
 * @param items - Danh sách các menu items
 * @param triggerClass - Class cho trigger button
 * @param contentWidth - Độ rộng của dropdown content (default: '250px')
 * @param className - Class bổ sung cho NavigationMenuItem
 */
function SimpleDropdownMenu({
  title,
  items,
  triggerClass,
  contentWidth = '250px',
  className,
}: {
  title: string;
  items: SimpleMenuItem[];
  triggerClass: string;
  contentWidth?: string;
  className?: string;
}) {
  return (
    <NavigationMenuItem className={className}>
      <NavigationMenuTrigger className={triggerClass}>
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-4" style={{ width: contentWidth }}>
          {items.map(item => (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <Link href={item.href}>{item.title}</Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

/**
 * Component menu link đơn giản - không có dropdown
 * @param href - Đường dẫn
 * @param children - Nội dung hiển thị
 * @param triggerClass - Class cho link
 */
function SimpleMenuLink({
  href,
  children,
  triggerClass,
}: {
  href: string;
  children: React.ReactNode;
  triggerClass: string;
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={triggerClass}>
        <Link href={href}>{children}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Component Mobile Menu Content - Nội dung menu dạng vertical cho mobile
 */
function MobileMenuContent({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!open) return null;

  return (
        <div className="fixed left-0 right-0 top-[var(--header-height,100px)] z-50 border-t bg-background shadow-lg max-h-[calc(100vh-var(--header-height,100px))] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {/* Kho Tri thức */}
            <div>
              <button
                onClick={() => toggleMenu('knowledge')}
                className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Kho Tri thức
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openMenus.knowledge ? 'rotate-180' : ''}`}
                />
              </button>
              {openMenus.knowledge && (
                <div className="mt-2 space-y-1 pl-4">
                  {knowledgeItems.map(item => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                      onClick={onClose}
                    >
                      <div className="font-medium">{item.title}</div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Hành trình Trưởng thành */}
            <div>
              <button
                onClick={() => toggleMenu('journey')}
                className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Hành trình Trưởng thành
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openMenus.journey ? 'rotate-180' : ''}`}
                />
              </button>
              {openMenus.journey && (
                <div className="mt-2 space-y-1 pl-4">
                  {journeyItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mentor Master */}
            <div>
              <button
                onClick={() => toggleMenu('mentor')}
                className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Mentor Master
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openMenus.mentor ? 'rotate-180' : ''}`}
                />
              </button>
              {openMenus.mentor && (
                <div className="mt-2 space-y-1 pl-4">
                  {mentorMasterItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Kho Quan niệm */}
            <div>
              <button
                onClick={() => toggleMenu('concepts')}
                className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Kho Quan niệm
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openMenus.concepts ? 'rotate-180' : ''}`}
                />
              </button>
              {openMenus.concepts && (
                <div className="mt-2 space-y-1 pl-4">
                  {conceptItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Cộng đồng */}
            <Link
              href="/community"
              className="block rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={onClose}
            >
              Cộng đồng
            </Link>

            {/* Quà tặng E-Gift */}
            <Link
              href="https://egift365.vn/"
              className="block rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={onClose}
            >
              Quà tặng E-Gift
            </Link>
          </nav>
        </div>
  );
}

/**
 * Component Mobile Menu Button - Nút mở/đóng menu trên mobile
 */
export function MobileMenuButton() {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Đóng menu khi click ra ngoài
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        onClick={() => setOpen(!open)}
        className="border border-border md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <div ref={menuRef} className="relative md:hidden">
        <MobileMenuContent open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}

/**
 * Component Mobile Menu - Menu dạng vertical cho mobile (wrapper)
 */
function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(!open)}
        className="border border-border"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <MobileMenuContent open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

/**
 * Component Navigation chính - Hiển thị menu điều hướng của website
 * Bao gồm các menu: Kho Tri thức, Hành trình Trưởng thành, Cộng đồng, Mentor Master, Kho Quan niệm, Quà tặng E-Gift
 */
export function Navigation() {
  const isMobile = useIsMobile();
  const triggerClass = `${navigationMenuTriggerStyle()} border border-border`;

  // Trên mobile hiển thị menu dạng vertical, trên desktop giữ nguyên
  if (isMobile) {
    return <MobileMenu />;
  }

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        {/* Menu Kho Tri thức - Menu đặc biệt có image banner và description */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClass}>
            Kho Tri thức
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {/* Image banner */}
              <li className="row-span-4">
                <NavigationMenuLink asChild>
                  <a
                    className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-md p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    href="/"
                  >
                    <Image
                      src="https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-12_92fdb697ac5f40a68fab6ee93b614d80.jpg"
                      alt="Kho Tri thức"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 200px, 100vw"
                    />
                    <div className="relative z-10 mb-2 text-lg font-medium text-white drop-shadow-md sm:mt-4">
                      Kho Tri thức
                    </div>
                    <p className="relative z-10 text-sm leading-tight text-white/90 drop-shadow-md">
                      Khám phá kho tàng tri thức phong phú được tổ chức khoa học
                      và dễ tiếp cận.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {/* Menu items với description */}
              {knowledgeItems.map(item => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Menu Hành trình Trưởng thành */}
        <SimpleDropdownMenu
          title="Hành trình Trưởng thành"
          items={journeyItems}
          triggerClass={triggerClass}
        />

        {/* Menu Mentor Master - Chỉ hiển thị trên desktop */}
        <SimpleDropdownMenu
          title="Mentor Master"
          items={mentorMasterItems}
          triggerClass={triggerClass}
          className="hidden md:block"
        />

        {/* Menu Kho Quan niệm - Chỉ hiển thị trên desktop */}
        <SimpleDropdownMenu
          title="Kho Quan niệm"
          items={conceptItems}
          triggerClass={triggerClass}
          contentWidth="200px"
          className="hidden md:block"
        />

        {/* Menu Cộng đồng - Link đơn giản không có dropdown */}
        <SimpleMenuLink href="/community" triggerClass={triggerClass}>
          Cộng đồng
        </SimpleMenuLink>

        {/* Link Quà tặng E-Gift */}
        <SimpleMenuLink href="https://egift365.vn/" triggerClass={triggerClass}>
          Quà tặng E-Gift
        </SimpleMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Component ListItem - Hiển thị menu item có title và description
 * Dùng cho menu "Kho Tri thức"
 */
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string; title: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
