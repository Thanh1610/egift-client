import StickyHeader from "@/components/organisms/stickyHeader";
import Image from "next/image";
import { ModeToggle } from "@/components/atoms/ModeToggle";
import { Navigation } from "@/components/organisms/Navigation";

function Header() {
  return (
    <StickyHeader className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-start items-center gap-2">
          <div className="h-12 w-[148px] flex items-center">
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
        </div>

        <div className="flex gap-2 justify-end items-center col-start-3">
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-center items-center w-full px-4 py-3 md:px-6">
        <Navigation />
      </div>
    </StickyHeader>
  );
}

export default Header;
