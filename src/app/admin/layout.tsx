import SupabaseStatusBanner from "../../components/SupabaseStatusBanner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SupabaseStatusBanner variant="authenticated" />
      {children}
    </>
  );
}
