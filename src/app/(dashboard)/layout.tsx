import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans flex">
      <DashboardSidebar user={user} />
      <main className="flex-1 ml-0 lg:ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
