"use client";

import React, { useState } from "react";
import { Question } from "./question";
import { Background } from "./background";
import { ThemeProvider } from "next-themes";
import {
  questions as initialQuestions,
  type Question as QuestionType,
} from "./questions";
import { LifeCounter } from "./life-counter";

export default function Home() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const context = { setLives, setQuestions };
  const question = questions[currentQuestionIndex];
  const gameFailed = lives <= 0;

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleAnswer = (
    answer: Exclude<QuestionType, React.ReactElement>["answers"][number],
  ) => {
    answer.onSelect?.(context);
    if (answer.isCorrect) return;
    setLives((l) => l - 1);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setLives(3);
    setQuestions(initialQuestions);
  };

  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
      <main className="relative w-full bg-slate-950">
        <Background />
        <div className="relative z-10 flex min-h-screen justify-center p-4 pt-[20dvh]">
          {gameFailed ? (
            <div className="w-full max-w-2xl text-center animate-fade-in">
              <div className="mb-8">
                <h1 className="mb-4 text-5xl font-bold text-balance text-destructive">
                  Game Over!
                </h1>
                <p className="text-xl text-slate-400 text-pretty">
                  You ran out of lives. Try again to verify you&apos;re human!
                </p>
              </div>
              <button
                onClick={handleRestart}
                className="rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <div className="mb-8 flex items-center justify-center">
                <LifeCounter lives={lives} />
              </div>
              <div className="mb-6 flex justify-center text-xs font-medium text-slate-400 uppercase tracking-widest">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              {React.isValidElement(question) ? (
                question
              ) : (
                <Question
                  key={question.id}
                  question={question}
                  onNext={handleNextQuestion}
                  onAnswer={handleAnswer}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
