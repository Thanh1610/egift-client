import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Spreader = {
  name: string;
  role: string;
  avatar: string;
  description: string;
};

const spreaders: Spreader[] = [
  {
    name: "Người lan tỏa 1",
    role: "Vai trò",
    avatar:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur",
  },
  {
    name: "Người lan tỏa 2",
    role: "Vai trò",
    avatar:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-12_92fdb697ac5f40a68fab6ee93b614d80.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur",
  },
  {
    name: "Người lan tỏa 3",
    role: "Vai trò",
    avatar:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-8_390ff9aaa1fe4a1c95bf148199706e1e.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur",
  },
];

export default function CommunitySpreaders() {
  return (
    <section className="container mx-auto px-4 py-14 space-y-8" aria-labelledby="community-spreaders-title">
      <div className="text-center space-y-2">
        <h2
          id="community-spreaders-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
        >
          Cộng đồng & Người lan tỏa
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {spreaders.map((spreader) => (
          <Card key={spreader.name} className="overflow-hidden bg-background w-full max-w-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative h-24 w-24 flex-shrink-0 rounded-full overflow-hidden border-2">
                  <Image
                    src={spreader.avatar}
                    alt={spreader.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold">{spreader.name}</h3>
                    <p className="text-sm text-muted-foreground">{spreader.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{spreader.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

