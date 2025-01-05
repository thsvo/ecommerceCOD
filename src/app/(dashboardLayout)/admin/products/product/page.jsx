import dynamic from "next/dynamic";

const AdminProducts = dynamic(
  () => import("@/components/Dashboard/Admin/Product/AdminProducts"),
  {
    ssr: false,
  }
);

export default function AdminProductsPage() {
  return <AdminProducts />;
}
