"use client";

import type { Question } from "@/types/survey";

const MC_LABELS = ["A", "B", "C", "D"];

interface QuestionFieldProps {
  index: number;
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionField({ index, question, value, onChange }: QuestionFieldProps) {
  const name = `q${index + 1}`;

  return (
    <div className="question">
      <div className="q-row">
        <span className="q-num">{index + 1}.</span>
        <div className="q-text">{question.text}</div>
      </div>

      {question.type === "open" && (
        <textarea
          name={name}
          rows={4}
          placeholder="Your answer..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "mc" && (
        <div className="mc-options">
          {(question.options ?? []).map((option, optionIndex) => (
            <label key={optionIndex} className="mc-label">
              <input
                type="radio"
                name={name}
                value={MC_LABELS[optionIndex]}
                checked={value === MC_LABELS[optionIndex]}
                onChange={(e) => onChange(e.target.value)}
              />
              {MC_LABELS[optionIndex]}. {option}
            </label>
          ))}
          {question.other && (
            <label className="mc-label">
              <input
                type="radio"
                name={name}
                value="Other"
                checked={value === "Other"}
                onChange={(e) => onChange(e.target.value)}
              />
              Other
            </label>
          )}
        </div>
      )}

      {question.type === "tf" && (
        <div className="tf-options">
          {(["True", "False"] as const).map((option) => (
            <label key={option} className="tf-label">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {question.type === "rating" && (
        <div className="rating-options">
          {["1", "2", "3", "4", "5"].map((rating) => (
            <label key={rating} className="rating-label">
              <input
                type="radio"
                name={name}
                value={rating}
                checked={value === rating}
                onChange={(e) => onChange(e.target.value)}
              />
              {rating}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
