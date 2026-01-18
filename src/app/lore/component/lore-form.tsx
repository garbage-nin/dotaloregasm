"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/app/component/SelectDropdown";
import { GuessesType } from "@/types/dotalore";
import { motion, AnimatePresence } from "framer-motion";
import { updateCorrectGuess } from "@/app/actions/updateGuess";
import useUser from "@/context/user-context";
import { NextHeroTimer } from "./next-timer";
import { PopoverComponent } from "@/app/component/PopoverComponent";

export function LoreForm({
  dropdownValues,
  guessDetails,
}: {
  dropdownValues: [{ id: any; label: string; image: string }];
  guessDetails: GuessesType;
}) {
  const [clues, setClues] = useState<any>([]);
  const [guessCount, setGuessCount] = useState<number>(6);
  const [guessList, setGuessList] = useState<any[]>([]);
  const [selectedHero, setSelectedHero] = useState<string>("");
  const [correctGuess, setCorrectGuess] = useState<boolean>(false);
  const [disabledDropdown, setDisabledDropdown] = useState<boolean>(false);
  const { user, setUser } = useUser();

  const CLUE_TEXT = [
    "Clue 1: Lore",
    "Clue 2: Abilities",
    "Clue 3: More Lore",
    "Clue 4: More Abilities",
    "Clue 5: Attribute & Roles",
    "Clue 6: Attack Type",
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const guessLore = guessDetails.data.guess_lore;
    const sentences = guessLore.match(/[^.!?]+[.!?]/g) || [];
    const loreHalf = Math.ceil(sentences.length / 2);
    const firstPart = sentences.slice(0, loreHalf).join(" ").trim();
    setClues([<p className="leading-relaxed">{firstPart}</p>]);
  }, [guessDetails]);

  useEffect(() => {
    setNextClue();
  }, [guessCount]);

  function setNextClue() {
    const guessSkillLore = JSON.parse(guessDetails.data.guess_skill_lore);
    if (guessCount === 5) {
      const skillHalf = Math.ceil(guessSkillLore.length / 2);
      let firstSkillPart = guessSkillLore.slice(0, skillHalf);
      setClues([
        ...clues,
        <div className="flex flex-col md:flex-row gap-4">
          {firstSkillPart.map((skills: string, index: number) => (
            <div key={index} className="flex-1 border-l-2 border-gold-dim pl-3">
              <strong className="text-gold-dim font-cinzel text-sm">Ability {index + 1}</strong>
              <p className="text-sm leading-relaxed mt-1">{skills}</p>
            </div>
          ))}
        </div>,
      ]);
    }

    if (guessCount === 4) {
      const guessLore = guessDetails.data.guess_lore;
      const sentences = guessLore.match(/[^.!?]+[.!?]/g) || [];
      const loreHalf = Math.ceil(sentences.length / 2);
      const secondPart = sentences.slice(loreHalf).join(" ").trim();
      setClues([...clues, <p className="leading-relaxed">{secondPart}</p>]);
    }

    if (guessCount === 3) {
      const skillHalf = Math.ceil(guessSkillLore.length / 2);
      let secondSkillPart = guessSkillLore.slice(skillHalf);
      setClues([
        ...clues,
        <div className="flex flex-col md:flex-row gap-4">
          {secondSkillPart.map((skills: string, index: number) => (
            <div key={index} className="flex-1 border-l-2 border-gold-dim pl-3">
              <strong className="text-gold-dim font-cinzel text-sm">Ability {index + 3}</strong>
              <p className="text-sm leading-relaxed mt-1">{skills}</p>
            </div>
          ))}
        </div>,
      ]);
    }

    if (guessCount === 2) {
      const primaryAttribute = guessDetails.data.primary_attribute;
      const roles = guessDetails.data.roles;
      setClues([
        ...clues,
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gold">◆</span>
            <span><strong className="text-gold-dim">Primary Attribute:</strong> {primaryAttribute}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold">◆</span>
            <span><strong className="text-gold-dim">Roles:</strong> {roles.join(", ")}</span>
          </div>
        </div>,
      ]);
    }

    if (guessCount === 1) {
      const attackType = guessDetails.data.attack_type;
      setClues([
        ...clues,
        <div className="flex items-center gap-2">
          <span className="text-gold">◆</span>
          <span><strong className="text-gold-dim">Attack Type:</strong> {attackType}</span>
        </div>,
      ]);
    }

    if (guessCount === 0) {
      setDisabledDropdown(true);
    }
  }

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
          setUser(userGuess);
        }, 500);
      }
      return;
    }
    setGuessList([...guessList, image]);
    setSelectedHero(value);
    setGuessCount(guessCount - 1);
  }

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  const getLifeClass = () => {
    if (guessCount > 3) return "life-high";
    if (guessCount > 1) return "life-mid";
    return "life-low";
  };

  return (
    <div className="ancient-scroll w-full max-w-2xl mx-auto max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4 border-b-2 border-wood/30">
        <div className="relative flex items-center justify-center">
          <h2 className="font-cinzel text-xl md:text-2xl text-gold text-center">
            Guess the Hero
          </h2>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <PopoverComponent />
          </div>
        </div>
        <p className="text-center text-ink-faded text-sm mt-1">
          Read the lore and guess who it is
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6" ref={scrollRef}>
        {user && user.correct && user.lastGuessId === guessDetails.id ? (
          /* Success State */
          <div className="text-center space-y-6 animate-fade-in-up">
            {/* Victory message */}
            <div className="space-y-2">
              <span className="text-gold text-3xl">✦</span>
              <h3 className="font-cinzel text-2xl text-gold animate-golden-pulse">
                Correct!
              </h3>
              <p className="text-ink">
                Nice job! You know your Dota lore!
              </p>
            </div>

            {/* Hero reveal */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
              <div className="hero-medallion">
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.lastGuessBaseName}.png`}
                  alt="Hero"
                  className="w-24 h-24 object-cover"
                />
              </div>
              <div className="parchment-card text-left max-w-xs">
                <p className="font-cinzel text-lg text-gold mb-2">
                  {user.lastGuessHero}
                </p>
                <p className="text-sm text-ink">
                  You are among <span className="font-bold text-gold">{user.lastGuessCounter}</span> players
                  who guessed today's hero.
                </p>
                <p className="text-sm text-ink mt-2">
                  Guesses remaining: <span className="font-bold text-gold">{user.remainingLife}/6</span>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="ornate-divider">
              <span className="ornate-divider-symbol">◆</span>
            </div>

            {/* Timer */}
            <NextHeroTimer />
          </div>
        ) : (
          /* Game State */
          <div className="space-y-5">
            {/* Game Over Banner */}
            {guessCount === 0 && (
              <div className="bg-blood-red/90 text-parchment text-center rounded p-3 border-2 border-blood-light">
                <span className="font-cinzel">Game Over</span>
                <p className="text-sm opacity-90">You've used all your guesses.</p>
              </div>
            )}

            {/* Hero Search */}
            <div className="space-y-2">
              <Label htmlFor="heroName" className="font-cinzel text-ink text-sm">
                Select a Hero
              </Label>
              <SelectDropdown
                dropdownValues={dropdownValues}
                placeholder="Type hero name..."
                onSelectChange={handleSelectHeroChange}
                disabled={disabledDropdown}
              />
            </div>

            {/* Failed Guesses */}
            {guessList.length > 0 && (
              <div className="flex flex-wrap gap-3 py-2">
                {guessList.map((val: any, index: number) => (
                  <div key={index} className="hero-medallion failed w-12 h-12 relative">
                    <img src={val} className="w-full h-full object-cover" alt="Failed guess" />
                    <span className="absolute -bottom-1 -right-1 text-blood-red text-lg font-bold">✕</span>
                  </div>
                ))}
              </div>
            )}

            {/* Lives Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-cinzel text-sm text-ink">Lives</span>
                <span className="font-cinzel text-sm text-gold">{guessCount} / 6</span>
              </div>
              <div className="life-essence-container mx-6">
                <div
                  className={`life-essence-bar ${getLifeClass()}`}
                  style={{ width: `${(guessCount / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="ornate-divider">
              <span className="ornate-divider-symbol text-sm">📜</span>
            </div>

            {/* Clues Container */}
            <div className="space-y-4">
              <AnimatePresence>
                {clues.map((clue: any, index: number) => (
                  <motion.div
                    key={`clue-${index}`}
                    initial={{ height: 0, opacity: 0, y: 20 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onAnimationComplete={scrollToBottom}
                    className="origin-top"
                  >
                    <div className="parchment-card">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <div className="font-cinzel text-gold-dim text-sm mb-3 flex items-center gap-2">
                          <span className="text-gold">✦</span>
                          {CLUE_TEXT[index]}
                        </div>
                        <div className="text-ink text-base leading-relaxed">
                          {clue}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Footer decoration */}
      <div className="p-4 border-t-2 border-wood/30 text-center">
        <span className="text-gold-dim text-xs">◈ ◈ ◈</span>
      </div>
    </div>
  );
}
