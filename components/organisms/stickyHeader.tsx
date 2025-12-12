'use client';

import clsx from 'clsx';

type StickyHeaderProps = {
  className?: string;
  offset?: number;
};

export default function StickyHeader({
  className,
  children,
}: React.PropsWithChildren<StickyHeaderProps>) {
  return (
    <header
      className={clsx(
        'fixed top-0 z-[9999] flex w-full items-center',
        'bg-white/90 border-b border-gray-200',
        'dark:bg-gray-900/90 dark:border-gray-800',
        'backdrop-blur-xl',
        'shadow-md',
        'dark:shadow-lg',
        'px-5 py-2 md:px-5 lg:px-6',

        className,
      )}
    >
      {children}
    </header>
  );
}
