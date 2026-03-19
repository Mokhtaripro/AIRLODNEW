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
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="dashboard-content">
          <div className="dashboard-inner">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </AppProvider>
  );
}
