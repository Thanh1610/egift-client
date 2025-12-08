import Link from "next/link";
import { ROUTES } from "@/config/constain";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-14">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Không tìm thấy quan niệm</h1>
        <p className="text-muted-foreground mb-8">
          Quan niệm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href={ROUTES.CONCEPTS}
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Quay lại Kho quan niệm
        </Link>
      </div>
    </div>
  );
}

