import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

function TezosMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M12 12 L40 40 L12 68"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M68 12 L40 40 L68 68"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Cover() {
  const open = useAppStore((s) => s.open);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-fg">
      <div className="cover-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-y-0 left-[max(1.5rem,env(safe-area-inset-left))] w-px bg-accent/80" />
      <div className="grain" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10">
        <div className="stagger-in flex items-center gap-3">
          <TezosMark className="size-8 text-accent" />
          <span className="text-xs font-medium tracking-[0.22em] text-muted uppercase">
            Archive
          </span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="stagger-in max-w-4xl">
          <p className="mb-5 text-xs font-medium tracking-[0.28em] text-accent uppercase">
            Closed months
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl lg:text-8xl">
            Collected
            <br />
            on Tezos
          </h1>
          <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
            Marketplace art collected on Tezos · closed months
          </p>
          <div className="mt-10">
            <Button size="lg" onClick={open} className="min-w-40 pr-5">
              Open
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
