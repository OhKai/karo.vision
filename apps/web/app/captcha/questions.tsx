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
    question: "Is life deterministic?",
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
    defaultContext: (
      <a
        href="https://www.reddit.com/r/LinkedInLunatics/comments/13tbfqm/what/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400"
      >
        E = mc² + AI
      </a>
    ),
  },
  {
    id: 4,
    question: (
      <>
        You can prove that (A) being true always leads to (B) also being true.
        <br />
        <br /> You then prove that (B) is true, must therefore (A) also be true?
      </>
    ),
    answers: [
      { content: "Yes", isCorrect: false },
      { content: "No", isCorrect: true },
    ],
    defaultContext: (
      <>
        Just because there is a valid{" "}
        <a
          href="https://en.wikipedia.org/wiki/Material_conditional"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400"
        >
          material conditional
        </a>{" "}
        A → B does not imply that B being true implies that A is true. You would
        have to prove B → A for that to get the{" "}
        <a
          href="https://en.wikipedia.org/wiki/Logical_biconditional"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400"
        >
          biimplication
        </a>{" "}
        A ↔ B.
      </>
    ),
  },
  {
    id: 5,
    question: "Is this a trick question?",
    answers: [
      { content: "Yes", isCorrect: false },
      { content: "No", isCorrect: true },
    ],
    defaultContext: "I would never ask you a trick question!",
  },
  {
    id: 6,
    question: "Was Einstein's theory of relativity proven correct?",
    answers: [
      { content: "Yes", isCorrect: false },
      { content: "No", isCorrect: true },
    ],
    defaultContext: (
      <>
        In empirical sciences, no theory can ever be proven true, only{" "}
        <a
          href="https://en.wikipedia.org/wiki/Falsifiability"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400"
        >
          falsified
        </a>
        .
      </>
    ),
  },
  {
    id: 7,
    question: "How many humans are currently alive?",
    answers: [
      { content: "More than 2 million", isCorrect: true },
      { content: "More than 5 billion", isCorrect: true },
      { content: "More than 7 billion", isCorrect: true },
    ],
    defaultContext:
      "All the answers are correct, as there are currently over 8 billion humans alive.",
  },
  {
    id: 8,
    question:
      "Hey are you tired of working in a dead-end job for little money? Become your own boss and drive a leased lambo like myself. All you need to do is sign up for my totally free newsletter and I will teach you how to achieve financial freedom by creating passive income. Are you ready to make the next step in your life?",
    answers: [
      {
        content:
          "Yes!! I can't believe you buy ads to give these secrets away for free!",
        isCorrect: false,
      },
      { content: "No, I did not peak in high school", isCorrect: true },
    ],
    defaultContext:
      "It's not a pyramid, it's a multi-level building with slanted walls!",
  },
  {
    id: 9,
    question:
      "Did I switch the correct answer to this question since it was created?",
    answers: [
      {
        content: "Yes",
        isCorrect: true,
      },
      { content: "No", isCorrect: false },
    ],
    defaultContext: "I can't switch it back now.",
  },
  {
    id: 10,
    question: "Is the ABC conjecture considered proven?",
    answers: [
      {
        content: "Yes, I live in Japan",
        isCorrect: true,
      },
      { content: "No", isCorrect: true },
    ],
    defaultContext: (
      <>
        <a
          href="https://en.wikipedia.org/wiki/Abc_conjecture#Claimed_proofs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400"
        >
          Math drama
        </a>
      </>
    ),
  },
  {
    id: 11,
    question:
      "Does your browser tell websites that it is a version of Mozilla and Safari?",
    answers: [
      {
        content: "Yes",
        isCorrect:
          navigator.userAgent.includes("Mozilla/") &&
          navigator.userAgent.includes("Safari/"),
      },
      {
        content: "No",
        isCorrect:
          !navigator.userAgent.includes("Mozilla/") ||
          !navigator.userAgent.includes("Safari/"),
      },
    ],
    defaultContext: (
      <a
        href="https://webaim.org/blog/user-agent-string-history/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400"
      >
        History of the browser user-agent string
      </a>
    ),
  },
  {
    id: 12,
    question: "Are there questions where No is the correct answer?",
    answers: [
      {
        content: "Yes",
        isCorrect: true,
      },
      {
        content: "No",
        isCorrect: false,
        context: "But then this would mean Yes is correct...",
      },
    ],
    defaultContext: "True, just not this one.",
  },
  {
    id: 13,
    question: "Will the correctness of your answer be decided by a coin toss?",
    answers: [
      {
        content: "Yes",
        isCorrect: false,
      },
      {
        content: "No",
        isCorrect: true,
        context: "Correct, there is no coin toss.",
      },
    ],
    defaultContext: "Does this mean it was Tails?",
  },
  {
    id: 14,
    question: "YOLO means You Only Live Once and you should therefore ...",
    answers: [
      {
        content:
          "Be careful and wary with your decisions, you only get this one life",
        isCorrect: true,
      },
      {
        content: "Take whatever opportunity arises, you only get this one life",
        isCorrect: true,
      },
    ],
    defaultContext: "Sure it is not the other?",
  },
  {
    id: 15,
    question:
      "If No were the correct answer for this question, would you advance if you clicked it?",
    answers: [
      {
        content: "Yes",
        isCorrect: true,
      },
      {
        content: "No",
        isCorrect: false,
        context: "Yes, you would.",
      },
    ],
    defaultContext: "Correct, you would advance.",
  },
  {
    id: 16,
    question:
      "A fair coin has shown Heads 4 times in a row. How likely is it to show Tails next?",
    answers: [
      {
        content: "90%",
        isCorrect: false,
      },
      {
        content: "75%",
        isCorrect: false,
      },
      {
        content: "50%",
        isCorrect: true,
      },
    ],
    defaultContext:
      "A fair coin always has a 50% chance for Heads or Tails independent of previous flips.",
  },
  {
    id: 17,
    question: "Do you know the answer to this question?",
    answers: [
      {
        content: "Yes",
        isCorrect: true,
      },
      {
        content: "No",
        isCorrect: false,
        context: "But now you do!",
      },
    ],
    defaultContext: "That was easy.",
  },
  {
    id: 18,
    question: (
      <>
        Capitalism 101{" "}
        <p className="mt-2 text-white/60 text-xl leading-relaxed">
          Oh no, a new law makes it illegal to put lead into baby food. Your
          company is forced to react to secure shareholder value. What do you
          do?
        </p>
      </>
    ),
    answers: [
      {
        content: "Bribe food inspectors",
        isCorrect: true,
      },
      {
        content: "Lobby politicians to change the law",
        isCorrect: true,
      },
      {
        content: "Develop new safe baby formula",
        isCorrect: false,
        context: "Way too expensive!",
      },
      {
        content: "Fund research to question toxic lead effects",
        isCorrect: true,
      },
      {
        content: "Say the new law threatens lead jobs in a press release",
        isCorrect: true,
      },
      {
        content: "Point out Arsenic is worse",
        isCorrect: true,
      },
    ],
    defaultContext: "Well done.",
  },
  {
    id: 19,
    question: (
      <>
        <img
          className="w-3/4"
          alt=""
          src="data:image/png;base64,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"
        />
        Is this function considered computable?
      </>
    ),
    answers: [
      {
        content: "Yes",
        isCorrect: true,
      },
      {
        content: "No",
        isCorrect: false,
      },
    ],
    defaultContext: (
      <>
        A function is computable if there exists an algorithm that can produce
        the correct output,{" "}
        <a
          href="https://en.wikipedia.org/wiki/Computable_function#Examples"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400"
        >
          even if we don&apos;t know which one the correct one is
        </a>
        .
      </>
    ),
  },
  {
    id: 17,
    question: "What of the following is the heaviest?",
    answers: [
      {
        content: "1 kg of feathers",
        isCorrect: false,
      },
      {
        content: "1 kg of lead",
        isCorrect: false,
      },
      {
        content:
          "The inescapable dread of knowing there is a certain number of days you will have lived and with every passing day you get closer to that number",
        isCorrect: true,
      },
    ],
    defaultContext: ":)",
  },
  {
    id: 18,
    question: "What is 1 / x at x = 0?",
    answers: [
      {
        content: "Negative Infinity",
        isCorrect: false,
      },
      {
        content: "Undefined",
        isCorrect: true,
      },
      {
        content: "Positive Infinity",
        isCorrect: false,
      },
    ],
    defaultContext: (
      <a
        href="https://en.wikipedia.org/wiki/Division_by_zero"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400"
      >
        Division by zero
      </a>
    ),
  },
  {
    id: 19,
    question: "On opposite day, would Yes mean No and vice versa?",
    answers: [
      {
        content: "Yes",
        isCorrect: true,
      },
      {
        content: "No",
        isCorrect: false,
      },
    ],
    defaultContext: "Luckily, it's not opposite day.",
  },
  {
    id: 19,
    question: "Is No the correct answer to this question?",
    answers: [
      {
        content: "Yes",
        isCorrect: false,
        context: "Then why didn't you pick No?",
      },
      {
        content: "No",
        isCorrect: false,
        context: "Then why did you pick No?",
      },
    ],
    defaultContext: "",
  },
  {
    id: 19,
    question: "Let's try again. Is No the correct answer to this question?",
    answers: [
      {
        content: "Yes",
        isCorrect: false,
        context: "Then why didn't you pick No?",
      },
      {
        content: "No",
        isCorrect: false,
        context: "Then why did you pick No?",
      },
    ],
    defaultContext: "",
  },
  {
    id: 19,
    question: "Let's try again. Is No the correct answer to this question?",
    answers: [
      {
        content: "Yes",
        isCorrect: false,
        context: "Then why didn't you pick No?",
      },
      {
        content: "No",
        isCorrect: false,
        context: "Then why did you pick No?",
      },
    ],
    defaultContext: "",
  },
];
