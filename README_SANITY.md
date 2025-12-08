# Cấu hình Sanity cho egift-client

## Bước 1: Tạo file `.env.local`

Tạo file `.env.local` trong thư mục `egift-client`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Bước 2: Lấy Project ID từ Sanity

1. Truy cập [Sanity.io](https://www.sanity.io/manage)
2. Chọn project của bạn
3. Vào Settings → API
4. Copy **Project ID**

## Bước 3: Kiểm tra API Route

Sau khi cấu hình, test API route:

```bash
# Chạy dev server
npm run dev

# Test API (trong terminal khác)
curl http://localhost:3000/api/concepts
```

## Troubleshooting

### Lỗi: "Failed to fetch concepts"

1. **Kiểm tra environment variables:**
   ```bash
   # Trong terminal
   echo $NEXT_PUBLIC_SANITY_PROJECT_ID
   ```

2. **Kiểm tra console logs:**
   - Xem server logs khi chạy `npm run dev`
   - Kiểm tra browser console

3. **Kiểm tra Sanity project:**
   - Đảm bảo project ID đúng
   - Đảm bảo dataset là "production"
   - Đảm bảo đã có concepts trong Sanity Studio

4. **Test Sanity connection:**
   ```typescript
   // Tạo file test: lib/sanity/test.ts
   import { sanityClient } from "./client";
   
   async function test() {
     const data = await sanityClient.fetch(`*[_type == "concept"]`);
     console.log("Concepts:", data);
   }
   
   test();
   ```

## API Endpoints

- `GET /api/concepts` - Fetch tất cả concepts từ Sanity

