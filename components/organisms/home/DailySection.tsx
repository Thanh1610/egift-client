import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function DailySection() {
  return (
    <section
      className="container mx-auto px-4 py-14 text-center space-y-6"
      aria-labelledby="daily-wisdom-title"
    >
      <header className="space-y-2">
        <h1
          id="daily-wisdom-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
        >
          Daily Wisdom - Quan niệm hôm nay
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Triết lý & giáo dục tận gốc, hành trình rõ ràng để sống nhẹ lại.
        </p>
      </header>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="#daily-wisdom">Khám phá Quan niệm mỗi ngày</Link>
        </Button>

        <Button asChild size="lg" variant="outline">
          <Link href="#more-stories">Xem tiếp</Link>
        </Button>
      </div>
    </section>
  );
}
