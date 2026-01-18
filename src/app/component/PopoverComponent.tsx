import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

export function PopoverComponent() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gold hover:text-gold-bright hover:bg-gold/10 p-2"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="help-scroll rounded-lg shadow-lg p-6 space-y-4 w-80 md:w-96">
        {/* Title */}
        <h2 className="font-cinzel text-xl text-gold flex items-center gap-2">
          <span>📜</span>
          <span>How to Play</span>
        </h2>

        {/* Introduction */}
        <p className="text-ink text-sm leading-relaxed">
          Guess the hero based on lore clues. You have{" "}
          <span className="font-bold text-gold">6 guesses</span>.
          Each wrong guess reveals another clue:
        </p>

        {/* Clue progression */}
        <ul className="space-y-2 text-sm text-ink">
          <li className="flex items-start gap-2">
            <span className="text-gold shrink-0">1.</span>
            <span>Two ability descriptions are shown.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold shrink-0">2.</span>
            <span>More lore is revealed.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold shrink-0">3.</span>
            <span>Two more abilities shown.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold shrink-0">4.</span>
            <span>
              <em className="text-gold-dim">Attribute</em> and{" "}
              <em className="text-gold-dim">roles</em> shown.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold shrink-0">5.</span>
            <span>
              <em className="text-gold-dim">Attack type</em> revealed.
            </span>
          </li>
        </ul>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dim/50 to-transparent" />
          <span className="text-gold-dim text-xs">◆</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dim/50 to-transparent" />
        </div>

        {/* Note */}
        <p className="text-ink-faded text-xs text-center">
          Choose carefully!
        </p>
      </PopoverContent>
    </Popover>
  );
}
