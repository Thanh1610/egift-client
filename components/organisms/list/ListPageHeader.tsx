type ListPageHeaderProps = {
  title: string;
  description?: string;
  itemCount?: number;
};

/**
 * Reusable header component cho list pages
 * Tái sử dụng cho concepts, stories, và các trang list khác
 */
export default function ListPageHeader({
  title,
  description,
  itemCount,
}: ListPageHeaderProps) {
  return (
    <div className="hidden md:block container mx-auto px-4 pt-14 pb-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            {description}
            {itemCount !== undefined && ` (${itemCount} ${itemCount === 1 ? "mục" : "mục"})`}
          </p>
        )}
      </div>
    </div>
  );
}

