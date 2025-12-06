import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Ear, Heart, Timer } from "lucide-react"
import Link from "next/link"

type Story = {
  title: string
  category: string
  image: string
  description: string
  listenTime: string
  reads: string
  reactions: string
}

const stories: Story[] = [
  {
    title: "Hạt giống của sự thật",
    category: "Trẻ em",
    image:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg",
    description: "Câu chuyện về hạt giống kỳ diệu nảy mầm khi được chăm sóc bằng lòng trung thực.",
    listenTime: "5 phút",
    reads: "1.2k lượt đọc",
    reactions: "380 react",
  },
  {
    title: "Đối diện với cái bóng",
    category: "Người lớn",
    image:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-12_92fdb697ac5f40a68fab6ee93b614d80.jpg",
    description: "Hành trình nội tâm sâu sắc để hiểu và chấp nhận những phần khuất lấp bên trong.",
    listenTime: "7 phút",
    reads: "890 lượt đọc",
    reactions: "210 react",
  },
  {
    title: "Bài học từ loài cây",
    category: "Cả gia đình",
    image:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-8_390ff9aaa1fe4a1c95bf148199706e1e.jpg",
    description: "Cây kể chuyện về sự lắng nghe, bao dung và cách chở che nhau trước bão giông.",
    listenTime: "4 phút",
    reads: "1.5k lượt đọc",
    reactions: "480 react",
  },
]

export default function InnerStories() {
  return (
    <section className="container mx-auto px-4 py-14 space-y-8" aria-labelledby="inner-stories-title">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-[0.2em]">
          Đọc & kể chuyện
        </Badge>
        <h2
          id="inner-stories-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
        >
          CÂU CHUYỆN NỘI TÂM
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Những câu chuyện ngắn cho cả trẻ em và người lớn — kể về bài học chân thật, tình thương,
          biết ơn và bao dung.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stories.map((story) => (
          <Card key={story.title} className="overflow-hidden bg-background">
            <CardHeader className="pb-3">
              <div className="relative mb-3 h-52 w-full overflow-hidden rounded-md border bg-muted">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <Badge className="absolute left-3 top-3 bg-background/80 text-xs">{story.category}</Badge>
              </div>
              <CardTitle className="text-lg leading-snug">{story.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{story.description}</p>
            </CardContent>
            <CardFooter className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Ear className="h-4 w-4" />
                <span>{story.listenTime}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{story.reads}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                <span>{story.reactions}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="#"
          className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Xem thêm →
        </Link>
      </div>
    </section>
  )
}

