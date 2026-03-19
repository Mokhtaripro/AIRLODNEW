import AppProvider from '@/components/dashboard/AppProvider';
import BottomNav from '@/components/dashboard/BottomNav';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Sidebar />
      <div className="main-content">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </div>
      <BottomNav />
    </AppProvider>
  );
}
