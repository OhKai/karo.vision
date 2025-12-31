import { ReactElement, ReactNode } from "react";

export type Question =
  | {
      id: number;
      question: ReactNode;
      answers: {
        content: ReactNode;
        isCorrect: boolean;
        context?: ReactNode;
        /** For some custom logic that does not require a full component. */
        onSelect?: (context: {
          setLives: React.Dispatch<React.SetStateAction<number>>;
          setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
        }) => void;
      }[];
      defaultContext: ReactNode;
    }
  | ReactElement;

export const questions: Question[] = [
  {
    id: 1,
    question: "Are you human?",
    answers: [
      { content: "Yes", isCorrect: true },
      {
        content: "No",
        isCorrect: false,
        onSelect: ({ setLives }) => setLives(0),
      },
    ],
    defaultContext:
      "These simple questions help us verify that you're a real person and not a bot.",
  },
  {
    id: 2,
    question: <>Is life deterministic?</>,
    answers: [
      { content: "Yes", isCorrect: true },
      { content: "No", isCorrect: true },
    ],
    defaultContext: "I knew you'd say that!",
  },
  {
    id: 3,
    question: (
      <>
        <p className="text-lg leading-relaxed mb-6 text-white/60 text-left border-l-muted-foreground border-l-4 pl-4">
          Clear thinking often comes from reducing complexity rather than adding
          more detail. By breaking a problem into smaller parts, patterns
          emerge, assumptions become visible, and decisions gain a stronger
          foundation. This approach applies equally to software design, writing,
          and everyday planning, where simplicity improves both correctness and
          long-term maintainability.
        </p>
        Where was this paragraph taken from?
      </>
    ),
    answers: [
      { content: "ChatGPT", isCorrect: true },
      { content: "LinkedIn Post", isCorrect: false },
    ],
    defaultContext: "E = mc² + AI",
  },
  {
    id: 4,
    question: (
      <>
        You can proof that one thing (A) being true always leads to another
        thing (B) also being true as a consequence of that first thing (A).
        <br />
        <br /> You then proof that the second thing (B) is true, must therefore
        the first thing (A) also be true?
      </>
    ),
    answers: [
      { content: "Yes", isCorrect: false },
      { content: "No", isCorrect: true },
    ],
    defaultContext:
      "Just because there is a valid implication A → B, B being true does not imply that A is true. You would have to proof B → A for that to get the bi-implication A ↔ B.",
  },
];
