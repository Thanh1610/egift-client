"use client";

import Link from "next/link";

export default function Footer() {

  // Structured Data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EGIFT365",
    legalName: "Công ty TNHH MatureX Group",
    taxID: "0111068620",
    url: "https://egift365.vn",
    logo: "https://egift365.vn/logo/egift365.svg",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-912-345-678",
      contactType: "Customer Service",
      email: "contact@egift365.vn",
      areaServed: "VN",
      availableLanguage: ["Vietnamese"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "D02-L02, Khu A - Khu đô thị mới Dương Nội",
      addressLocality: "P. Dương Nội, Q. Hà Đông",
      addressRegion: "Hà Nội",
      addressCountry: "VN",
    },
    sameAs: ["https://www.facebook.com/profile.php?id=61583995955610"],
  };

  return (
    <footer className="border-t" role="contentinfo">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Cột 1: Các bộ sưu tập */}
          <nav aria-label="Các bộ sưu tập">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Các bộ sưu tập</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/collections/van-phong-pham"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem bộ sưu tập Văn phòng phẩm"
                >
                  Văn phòng phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/trang-tri-noi-that"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem bộ sưu tập Trang trí & Nội thất"
                >
                  Trang trí & Nội thất
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/qua-tet"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem bộ sưu tập Quà Tết"
                >
                  Quà Tết
                </Link>
              </li>
            </ul>
          </nav>

          {/* Cột 2: Chính sách */}
          <nav aria-label="Chính sách">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Chính sách</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/policies/payment"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem hình thức thanh toán"
                >
                  Hình thức thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/delivery"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem hình thức giao hàng"
                >
                  Hình thức giao hàng
                </Link>
              </li>
            </ul>
          </nav>

          {/* Cột 3: Chính sách bảo mật */}
          <nav aria-label="Chính sách bảo mật">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Chính sách bảo mật</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy/policy"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem chính sách bảo mật"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy/warranty"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem chính sách bảo hành"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy/return"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  aria-label="Xem chính sách đổi trả"
                >
                  Chính sách đổi trả
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

