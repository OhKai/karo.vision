"use client";

import { useState } from "react";
import type { Question } from "./questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

type StandardQuestion = Exclude<Question, React.ReactElement>;

type QuizQuestionProps = {
  question: StandardQuestion;
  onAnswer: (answer: StandardQuestion["answers"][number]) => void;
  onNext: () => void;
};

export function Question({ question, onNext, onAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const showContext = selectedAnswer !== null;
  const context = showContext
    ? question.answers[selectedAnswer!].context || question.defaultContext
    : null;

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    onAnswer(question.answers[index]);
  };

  return (
    <>
      <Card className="gap-9 mb-6 border-0 bg-slate-900/80 backdrop-blur-sm p-8 shadow-2xl shadow-purple-900/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-center text-xl font-bold leading-tight text-white text-balance md:text-2xl">
          {question.question}
        </h2>
        <div className="flex flex-col gap-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={showContext}
              className={`group relative overflow-hidden rounded-2xl p-6 text-lg font-semibold transition-all duration-300 ${
                selectedAnswer === null
                  ? "bg-slate-800 text-slate-200 hover:scale-105 hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-500/50"
                  : selectedAnswer === index
                    ? answer.isCorrect
                      ? "bg-cyan-500 text-white scale-105 shadow-lg shadow-cyan-500/50"
                      : "bg-red-500 text-white scale-105 shadow-lg shadow-red-500/50"
                    : "bg-slate-800/50 text-slate-500 opacity-50"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {selectedAnswer === index &&
                  (answer.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 animate-in zoom-in shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 animate-in zoom-in shrink-0" />
                  ))}
                {answer.content}
              </span>
              {selectedAnswer === null && (
                <div className="absolute inset-0 -translate-x-full bg-purple-600 transition-transform duration-300 group-hover:translate-x-0 rounded-2xl will-change-transform" />
              )}
            </button>
          ))}
        </div>
      </Card>
      {showContext && (
        <Card className="mb-6 border-0 bg-purple-900/30 backdrop-blur-sm p-6 shadow-xl shadow-purple-900/20 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100 fill-mode-both">
          <p className="mb-4 text-center text-lg font-semibold leading-relaxed text-pretty text-slate-200">
            {context}
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => onNext()}
              size="lg"
              className="rounded-full px-8 font-semibold shadow-lg transition-all hover:scale-105"
            >
              Next Question →
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
