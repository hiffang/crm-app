import { Suspense } from "react";

import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1e293b,_transparent_55%),radial-gradient(circle_at_bottom,_#0f172a,_transparent_60%)] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-10 shadow-[0_30px_120px_-60px_rgba(15,23,42,0.7)]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300">
            Torch CRM
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-600">
            Enter your credentials to access the CRM workspace.
          </p>
        </div>
        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-slate-500">Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Test account</p>
          <p>admin@example.com</p>
          <p>password123</p>
        </div>
      </div>
    </div>
  );
}
