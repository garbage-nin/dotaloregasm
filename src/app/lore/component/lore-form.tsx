"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const imageUrl = "/images/enigma.png";
  const CLUE_TEXT = [
    "Clue 1: Lore 1st part",
    "Clue 2: Skills Lore",
    "Clue 3: Lore 2nd part",
    "Clue 4: Skills Lore",
    "Clue 5: Primary Attribute and Roles",
    "Final Clue: Attack Type",
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const guessLore = guessDetails.data.guess_lore;
    const sentences = guessLore.match(/[^.!?]+[.!?]/g) || []; // Match sentences ending in ., !, or ?

    const loreHalf = Math.ceil(sentences.length / 2);
    const firstPart = sentences.slice(0, loreHalf).join(" ").trim();

    setClues([<p>{firstPart}</p>]);
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
        <div className="flex space-x-4">
          {firstSkillPart.map((skills: string, index: number) => {
            return (
              <div key={index} className="flex-1">
                <strong>Skill {index + 1}:</strong>
                <p>{skills}</p>
              </div>
            );
          })}
        </div>,
      ]);
    }

    if (guessCount === 4) {
      const guessLore = guessDetails.data.guess_lore;
      const sentences = guessLore.match(/[^.!?]+[.!?]/g) || []; // Match sentences ending in ., !, or ?
      const loreHalf = Math.ceil(sentences.length / 2);
      const secondPart = sentences.slice(loreHalf).join(" ").trim();
      setClues([...clues, secondPart]);
    }

    if (guessCount === 3) {
      const skillHalf = Math.ceil(guessSkillLore.length / 2);
      let secondSkillPart = guessSkillLore.slice(skillHalf);
      setClues([
        ...clues,
        <div className="flex space-x-4">
          {secondSkillPart.map((skills: string, index: number) => {
            return (
              <div key={index} className="flex-1">
                <strong>Skill {index + 1}:</strong>
                <p>{skills}</p>
              </div>
            );
          })}
        </div>,
      ]);
    }

    if (guessCount === 2) {
      const primaryAttribute = guessDetails.data.primary_attribute;
      const roles = guessDetails.data.roles;
      let fourthClue = (
        <div className="flex flex-col space-y-1.5">
          <span>Primary Attribute: {primaryAttribute}</span>
          <span>Roles: {roles.join(", ")}</span>
        </div>
      );
      setClues([...clues, fourthClue]);
    }

    if (guessCount === 1) {
      const attackType = guessDetails.data.attack_type;
      setClues([...clues, <div>Attack Type: {attackType}</div>]);
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

  return (
    <Card className="w-[45%] max-h-[80vh]">
      <CardHeader>
        <div className="relative">
          <CardTitle className="text-center">Guess the Dota 2 Hero.</CardTitle>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <PopoverComponent />
          </div>
        </div>

        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {user && user.correct && user.lastGuessId === guessDetails.id ? (
          <div className="grid w-full items-center gap-4">
            <div className="text-center font-extrabold text-2xl">
              Well done!
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              You really know the hero lore inside and out
              <div className="flex items-center pt-2 w-11/12">
                <div className="flex flex-col items-center mr-4 w-1/5">
                  <img
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.lastGuessBaseName}.png`}
                    alt="Hero"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                <div className="bg-gray-100 p-2 rounded-lg shadow">
                  <p>
                    <span className="font-semibold">Hero name:</span>{" "}
                    {user.lastGuessHero}
                  </p>
                  <p>
                    You're part of the
                    <span className="font-semibold">
                      {" "}
                      {user.lastGuessCounter}
                    </span>{" "}
                    players who uncovered the today's Hero base on the lore.
                  </p>
                  <p>
                    {" "}
                    With a remaining life of{" "}
                    <span className="font-semibold">{user.remainingLife}</span>
                  </p>
                </div>
              </div>
            </div>
            <NextHeroTimer />
          </div>
        ) : (
          <div>
            {guessCount === 0 && (
              <div className="bg-red-500 w-full text-white text-center rounded-3xl p-1 my-2">
                You have reached the maximum number of guesses.
              </div>
            )}
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="heroName">Hero Name</Label>
                  <SelectDropdown
                    dropdownValues={dropdownValues}
                    placeholder="Type the hero name..."
                    onSelectChange={handleSelectHeroChange}
                    disabled={disabledDropdown}
                  />
                </div>
                <div className="px-2 flex flex-row space-x-4">
                  {guessList.map((val: any, index: number) => {
                    return (
                      <div className="flex flex-col" key={index}>
                        <img src={val} className="w-10 h-10 mr-2 grayscale" />
                        <span className="text-center text-xs text-red-500 font-extrabold">
                          x
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full">
                  <span className="py-2">Health</span>
                  <div className="relative bg-gray-300 rounded-full h-6 overflow-hidden">
                    <div
                      className={`${
                        guessCount > 2 ? "bg-green-500" : "bg-red-500"
                      }  h-full rounded-full transition-all duration-500 ease-in-out`}
                      style={{ width: `${(guessCount / 6) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white drop-shadow-sm">
                        {guessCount} / 6
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-col space-y-1.5 max-h-[50vh] overflow-auto"
                  ref={scrollRef}
                >
                  <AnimatePresence>
                    {clues.map((clue: any, index: number) => (
                      <motion.div
                        key={clue + index} // ensure unique key if duplicate clues
                        initial={{ height: 0, opacity: 0, scaleY: 0 }}
                        animate={{ height: "auto", opacity: 1, scaleY: 1 }}
                        exit={{ height: 0, opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        onAnimationComplete={scrollToBottom}
                        className="flex flex-col space-y-1.5 p-4 origin-top text-xl font-semibold text-white bg-primary rounded-lg shadow-md"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <Label className="font-bold pb-4 text-center">
                            {CLUE_TEXT[index]}
                          </Label>
                          <Label htmlFor="heroName">{clue}</Label>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
