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
      <div className="min-h-screen bg-mesh relative">
        {/* Background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="dashboard-content relative z-10">
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
