import AppProvider from '@/components/dashboard/AppProvider';
import BottomNav from '@/components/dashboard/BottomNav';

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

        {/* Content */}
        <div className="mobile-container relative z-10 pb-24">
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </AppProvider>
  );
}
