import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, BookOpen, Swords, Gem, Crosshair } from "lucide-react";

export function PopoverComponent() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-mist hover:text-immortal hover:bg-immortal/5 p-2 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="help-panel rounded-xl shadow-2xl p-6 space-y-4 w-80 md:w-96 border-steel">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-immortal/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-immortal" />
          </div>
          <h2 className="font-cinzel text-lg text-immortal">How to Play</h2>
        </div>

        {/* Intro */}
        <p className="text-silver text-sm leading-relaxed">
          Guess the hero from lore clues. You have{" "}
          <span className="font-bold text-immortal">6 guesses</span>.
          Each wrong guess reveals more:
        </p>

        {/* Clue progression */}
        <div className="space-y-2.5">
          {[
            { icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-immortal", bg: "bg-immortal/10", text: "Two ability descriptions" },
            { icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-immortal", bg: "bg-immortal/10", text: "More lore is revealed" },
            { icon: <Swords className="w-3.5 h-3.5" />, color: "text-arcane", bg: "bg-arcane/10", text: "Two more abilities" },
            { icon: <Gem className="w-3.5 h-3.5" />, color: "text-mystic", bg: "bg-mystic/10", text: "Attribute & roles shown" },
            { icon: <Crosshair className="w-3.5 h-3.5" />, color: "text-crimson", bg: "bg-crimson/10", text: "Attack type revealed" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              <span className="text-silver text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-steel to-transparent" />

        {/* Note */}
        <p className="text-mist text-xs text-center tracking-wide">
          Choose wisely, Ancient one.
        </p>
      </PopoverContent>
    </Popover>
  );
}
