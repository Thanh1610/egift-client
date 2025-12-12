import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Facebook, Twitter } from 'lucide-react';

export default function ShareSocial({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      '_blank'
    );

  const shareZalo = () =>
    window.open(`https://zalo.me/share?url=${encodedUrl}`, '_blank');

  const shareX = () =>
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      '_blank'
    );

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Facebook */}
      <Button
        onClick={shareFacebook}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
        Facebook
      </Button>

      {/* Zalo (SVG custom) */}
      <Button
        onClick={shareZalo}
        variant="outline"
        className="flex items-center gap-2"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5">
          <path
            fill="#0068FF"
            d="M39 4H9C6.2 4 4 6.2 4 9v30c0 2.8 2.2 5 5 5h30c2.8 0 5-2.2 
            5-5V9c0-2.8-2.2-5-5-5zM17.3 30.4H9.1v-2.5l4.8-5.9c.5-.6.8-1.1.8-1.8 
            0-.9-.6-1.5-1.5-1.5-1 0-1.6.6-1.6 1.8H8.7c0-3 1.8-4.6 4.7-4.6 
            2.8 0 4.6 1.5 4.6 4 0 1.4-.6 2.4-1.6 3.6L12.9 28h4.4v2.4zm9 .1c-3 0-5.3-2.2-5.3-5.3 
            0-3 2.2-5.3 5.3-5.3 3 0 5.3 2.2 5.3 5.3 0 3-2.3 5.3-5.3 5.3zm9.6-.1H32V18h3.9v12.4z"
          />
        </svg>
        Zalo
      </Button>

      {/* X */}
      <Button
        onClick={shareX}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Twitter className="h-5 w-5" />X
      </Button>
    </div>
  );
}
