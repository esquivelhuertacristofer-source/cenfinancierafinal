import SupabaseStatusBanner from "../../components/SupabaseStatusBanner";

export default function DashboardLayout({
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
