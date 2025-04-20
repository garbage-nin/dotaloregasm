import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverComponent() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Help</Button>
      </PopoverTrigger>
      <PopoverContent className="bg-primary rounded-xl text-white shadow-md p-6 space-y-4 mx-auto w-96">
        <h2 className="text-2xl font-bold text-white">🕹️ How to Play</h2>
        <p>
          Guess the Dota hero based on their lore. You have{" "}
          <span className="font-semibold text-destructive">6 lives</span> to get
          it right. Each incorrect guess unlocks a new clue:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">1st wrong guess:</span> Two of the
            hero’s skills (lore-only, random order).
          </li>
          <li>
            <span className="font-semibold">2nd wrong guess:</span> The second
            half of the hero’s lore.
          </li>
          <li>
            <span className="font-semibold">3rd wrong guess:</span> Two more
            skill descriptions.
          </li>
          <li>
            <span className="font-semibold">4th wrong guess:</span> The hero’s{" "}
            <span className="italic">primary attribute</span> and{" "}
            <span className="italic">roles</span>.
          </li>
          <li>
            <span className="font-semibold">Final clue:</span> The hero’s{" "}
            <span className="italic">attack type</span> (Melee or Ranged).
          </li>
        </ul>
        <p className="text-sm text-muted-foreground italic">
          Guess wisely — you only have six chances!
        </p>
      </PopoverContent>
    </Popover>
  );
}
