/**
 * Component để render structured data script
 * Tái sử dụng cho các trang cần structured data
 */
type StructuredDataScriptProps = {
  data: object;
};

export default function StructuredDataScript({
  data,
}: StructuredDataScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

