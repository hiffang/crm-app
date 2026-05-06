import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import SignOutButton from "@/app/components/SignOutButton";
import SidebarNav from "@/app/components/SidebarNav";
import UserAvatar from "@/app/components/UserAvatar";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col gap-10 border-r border-slate-900 bg-slate-950 px-6 py-8 lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              TorchCRM
            </p>
            <h1 className="mt-2 text-xl font-semibold text-white">
              Sales OS
            </h1>
          </div>
          <SidebarNav />
          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
            Stay on top of pipeline momentum.
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col bg-slate-100 text-slate-900">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <p className="text-sm font-semibold text-slate-900">
                  Atlas CRM
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Signed in
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {name || "Admin"}
                  </p>
                </div>
                <UserAvatar name={name} email={email} />
                <SignOutButton />
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
