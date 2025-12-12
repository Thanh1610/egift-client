import Link from "next/link";
import { ROUTES } from "@/config/constain";

export default function StoryNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">Không tìm thấy câu chuyện</h1>
      <p className="mb-8 text-muted-foreground">
        Câu chuyện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href={ROUTES.STORIES}
        className="rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Quay lại danh sách câu chuyện
      </Link>
    </div>
  );
}

