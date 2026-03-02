"use client";
import * as React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/app/component/SelectDropdown";
import { GuessesType } from "@/types/dotalore";
import { motion, AnimatePresence } from "framer-motion";
import { updateCorrectGuess } from "@/app/actions/updateGuess";
import useUser from "@/context/user-context";
import { NextHeroTimer } from "./next-timer";
import { PopoverComponent } from "@/app/component/PopoverComponent";
import { BookOpen, Swords, Gem, Crosshair, Lock, Trophy } from "lucide-react";

const CLUE_CONFIG = [
  { category: "Lore", icon: BookOpen, accent: "clue-lore", color: "text-immortal", bg: "bg-immortal/10" },
  { category: "Abilities", icon: Swords, accent: "clue-abilities", color: "text-arcane", bg: "bg-arcane/10" },
  { category: "More Lore", icon: BookOpen, accent: "clue-lore", color: "text-immortal", bg: "bg-immortal/10" },
  { category: "More Abilities", icon: Swords, accent: "clue-abilities", color: "text-arcane", bg: "bg-arcane/10" },
  { category: "Attributes & Roles", icon: Gem, accent: "clue-attributes", color: "text-mystic", bg: "bg-mystic/10" },
  { category: "Attack Type", icon: Crosshair, accent: "clue-attack", color: "text-crimson", bg: "bg-crimson/10" },
];

export function LoreForm({
  dropdownValues,
  guessDetails,
}: {
  dropdownValues: [{ id: any; label: string; image: string }];
  guessDetails: GuessesType;
}) {
  const [guessCount, setGuessCount] = useState<number>(6);
  const [guessList, setGuessList] = useState<any[]>([]);
  const [, setSelectedHero] = useState<string>("");
  const [, setCorrectGuess] = useState<boolean>(false);
  const [disabledDropdown, setDisabledDropdown] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pre-compute all clue data
  const clueData = useMemo(() => {
    const guessLore = guessDetails.data.guess_lore;
    const sentences = guessLore.match(/[^.!?]+[.!?]/g) || [];
    const loreHalf = Math.ceil(sentences.length / 2);
    const guessSkillLore = JSON.parse(guessDetails.data.guess_skill_lore);
    const skillHalf = Math.ceil(guessSkillLore.length / 2);

    return [
      { type: "lore", content: sentences.slice(0, loreHalf).join(" ").trim() },
      { type: "abilities", content: guessSkillLore.slice(0, skillHalf) },
      { type: "lore", content: sentences.slice(loreHalf).join(" ").trim() },
      { type: "abilities", content: guessSkillLore.slice(skillHalf) },
      {
        type: "attributes",
        content: {
          attr: guessDetails.data.primary_attribute,
          roles: guessDetails.data.roles,
        },
      },
      { type: "attack", content: guessDetails.data.attack_type },
    ];
  }, [guessDetails]);

  const unlockedCount = 7 - guessCount;

  // Restore in-progress session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_session");
      if (!saved) return;
      const session = JSON.parse(saved);
      if (session.puzzleId === guessDetails.id) {
        setGuessCount(session.guessCount);
        setGuessList(session.guessList);
        if (session.guessCount === 0) {
          setDisabledDropdown(true);
        }
      } else {
        localStorage.removeItem("game_session");
      }
    } catch {
      localStorage.removeItem("game_session");
    }
  }, [guessDetails.id]);

  useEffect(() => {
    if (guessCount === 0) {
      setDisabledDropdown(true);
    }
  }, [guessCount]);

  useEffect(() => {
    // Scroll to bottom when new clues unlock
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 400);
    }
  }, [unlockedCount]);

  async function handleSelectHeroChange(value: string, image?: string) {
    if (value === guessDetails.data.guess_hero_name) {
      setCorrectGuess(true);
      setDisabledDropdown(true);
      const result = await updateCorrectGuess(guessDetails.id);
      if (result.statusCode === 200) {
        let userGuess = {
          remainingLife: guessCount,
          correct: true,
          lastGuessHero: guessDetails.data.guess_hero_name,
          lastGuessBaseName: guessDetails.data.guess_base_name,
          lastGuessId: guessDetails.id,
          lastGuessDate: new Date().toISOString(),
          lastGuessCounter: guessDetails.correct_guess + 1,
        };

        setTimeout(() => {
          localStorage.setItem("user_guess_state", JSON.stringify(userGuess));
          localStorage.removeItem("game_session");
          setUser(userGuess);
        }, 500);
      }
      return;
    }
    const newGuessList = [...guessList, image];
    const newGuessCount = guessCount - 1;
    setGuessList(newGuessList);
    setSelectedHero(value);
    setGuessCount(newGuessCount);
    localStorage.setItem("game_session", JSON.stringify({
      puzzleId: guessDetails.id,
      guessCount: newGuessCount,
      guessList: newGuessList,
    }));
  }

  function renderClueContent(data: any, index: number) {
    if (data.type === "lore") {
      return <p className="text-silver text-[15px] leading-relaxed">{data.content}</p>;
    }

    if (data.type === "abilities") {
      return (
        <div className="flex flex-col md:flex-row gap-3">
          {data.content.map((skill: string, i: number) => (
            <div key={i} className="flex-1 bg-void/40 rounded-lg p-3 border border-steel/30">
              <span className="text-arcane text-xs font-rajdhani font-semibold tracking-wider uppercase block mb-1.5">
                Ability {index <= 1 ? i + 1 : i + 3}
              </span>
              <p className="text-silver text-sm leading-relaxed">{skill}</p>
            </div>
          ))}
        </div>
      );
    }

    if (data.type === "attributes") {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-void/40 rounded-lg px-3 py-2 border border-steel/30">
            <span className="text-mystic text-xs font-semibold tracking-wider uppercase">Attribute</span>
            <span className="text-frost text-sm">{data.content.attr}</span>
          </div>
          <div className="flex items-center gap-3 bg-void/40 rounded-lg px-3 py-2 border border-steel/30">
            <span className="text-mystic text-xs font-semibold tracking-wider uppercase">Roles</span>
            <span className="text-frost text-sm">{data.content.roles.join(", ")}</span>
          </div>
        </div>
      );
    }

    if (data.type === "attack") {
      return (
        <div className="flex items-center gap-3 bg-void/40 rounded-lg px-3 py-2 border border-steel/30">
          <span className="text-crimson text-xs font-semibold tracking-wider uppercase">Attack</span>
          <span className="text-frost text-sm">{data.content}</span>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="aegis-panel w-full max-w-2xl mx-auto max-h-[88vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-steel/30">
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="font-cinzel text-xl md:text-2xl text-immortal tracking-wide">
              Guess the Hero
            </h2>
            <p className="text-mist text-sm mt-0.5 font-rajdhani">
              Read the clues and identify the hero
            </p>
          </div>
          <PopoverComponent />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-5" ref={scrollRef}>
        {user && user.correct && user.lastGuessId === guessDetails.id ? (
          /* ====== SUCCESS STATE ====== */
          <div className="space-y-6 animate-fade-in-up">
            <div className="success-card text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-arcane/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-arcane" />
                </div>
              </div>

              <h3 className="font-cinzel text-2xl text-immortal text-glow-immortal mb-2">
                Correct!
              </h3>
              <p className="text-silver text-sm">
                Well played. You know your Dota lore.
              </p>
            </div>

            {/* Hero reveal */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-obsidian/60 rounded-xl border border-steel/30">
              <div className="hero-medallion flex-shrink-0">
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.lastGuessBaseName}.png`}
                  alt="Hero"
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-cinzel text-lg text-immortal mb-1">
                  {user.lastGuessHero}
                </p>
                <p className="text-silver text-sm">
                  <span className="text-arcane font-semibold">{user.lastGuessCounter}</span>{" "}
                  players guessed today
                </p>
                <p className="text-mist text-sm mt-1">
                  Guesses remaining: <span className="text-immortal font-semibold">{user.remainingLife}/6</span>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-steel to-transparent" />

            {/* Timer */}
            <NextHeroTimer />
          </div>
        ) : (
          /* ====== GAME STATE ====== */
          <div className="space-y-5">
            {/* Game Over Banner */}
            {guessCount === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="game-over-banner"
              >
                <p className="font-cinzel text-crimson text-lg">Game Over</p>
                <p className="text-crimson-bright/70 text-sm mt-1">You&apos;ve used all your guesses.</p>
              </motion.div>
            )}

            {/* Hero Search */}
            <div className="space-y-2">
              <Label htmlFor="heroName" className="text-mist text-sm font-rajdhani font-medium tracking-wide uppercase">
                Select a Hero
              </Label>
              <SelectDropdown
                dropdownValues={dropdownValues}
                placeholder="Search for a hero..."
                onSelectChange={handleSelectHeroChange}
                disabled={disabledDropdown}
              />
            </div>

            {/* Failed Guesses + Lives Row */}
            <div className="flex items-center justify-between gap-4">
              {/* Failed guesses */}
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                <AnimatePresence>
                  {guessList.map((val: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="hero-medallion failed w-10 h-10 relative"
                    >
                      <img src={val} className="w-full h-full object-cover rounded-full" alt="Failed guess" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-crimson rounded-full flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">X</span>
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Crystal lives */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`crystal ${i < guessCount ? "active" : "spent"}`}
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="crystal-shape" />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-steel/50 to-transparent" />

            {/* Clue Cards */}
            <div className="space-y-3">
              {CLUE_CONFIG.map((config, index) => {
                const isUnlocked = index < unlockedCount;
                const Icon = config.icon;

                return (
                  <motion.div
                    key={`clue-${index}`}
                    initial={false}
                    animate={isUnlocked ? {
                      opacity: 1,
                      y: 0,
                    } : {
                      opacity: 0.5,
                      y: 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className={`clue-card ${config.accent} ${isUnlocked ? "unlocked" : "locked"}`}>
                      {/* Card header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-md ${isUnlocked ? config.bg : "bg-steel/20"} flex items-center justify-center transition-colors`}>
                            {isUnlocked ? (
                              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-mist/40" />
                            )}
                          </div>
                          <span className={`text-xs font-rajdhani font-semibold tracking-wider uppercase ${isUnlocked ? config.color : "text-mist/40"}`}>
                            {config.category}
                          </span>
                        </div>
                        {!isUnlocked && (
                          <span className="text-[10px] text-mist/30 tracking-wider uppercase font-rajdhani">
                            Locked
                          </span>
                        )}
                      </div>

                      {/* Card content */}
                      {isUnlocked ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.35 }}
                        >
                          {renderClueContent(clueData[index], index)}
                        </motion.div>
                      ) : (
                        <div className="flex gap-2">
                          <div className="h-3 bg-steel/15 rounded-full w-3/4" />
                          <div className="h-3 bg-steel/10 rounded-full w-1/4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className="px-6 py-3 border-t border-steel/20 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-steel/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-immortal/20" />
          <div className="w-1 h-1 rounded-full bg-steel/40" />
        </div>
      </div>
    </div>
  );
}
