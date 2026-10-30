import { site } from "@/content/site";
import { Clock } from "./Clock";

export function MenuBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex h-10 items-stretch justify-between border-b-2 border-ink bg-paper">
      <div className="flex items-stretch">
        <div className="flex w-10 items-center justify-center bg-ink">
          <span
            aria-hidden="true"
            className="size-3 border-2 border-paper bg-signal"
          />
        </div>
        <div className="flex items-center border-r-2 border-ink px-4 text-[15px] font-semibold tracking-[0.06em]">
          NATHAN.OS
        </div>
      </div>
      <Clock city={site.city} timeZone={site.timeZone} />
    </header>
  );
}
