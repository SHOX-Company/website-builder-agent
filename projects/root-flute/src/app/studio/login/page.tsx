import { Suspense } from "react";
import StudioLoginForm from "@/components/studio/StudioLoginForm";

export default function StudioLoginPage() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-brand-dark px-6 py-16">
      <Suspense fallback={null}>
        <StudioLoginForm />
      </Suspense>
    </main>
  );
}
