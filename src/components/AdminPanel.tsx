"use client";

import { useEffect, useState } from "react";
import { ADMIN_PASSWORD } from "@/lib/constants";
import type { Question, QuestionType, SurveyConfig } from "@/types/survey";

interface AdminPanelProps {
  open: boolean;
  config: SurveyConfig;
  onClose: () => void;
  onUpdateConfig: (config: SurveyConfig) => void;
}

const EMPTY_MC = ["", "", "", ""];

export default function AdminPanel({ open, config, onClose, onUpdateConfig }: AdminPanelProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<QuestionType>("open");
  const [newText, setNewText] = useState("");
  const [mcOptions, setMcOptions] = useState<string[]>(EMPTY_MC);
  const [includeOther, setIncludeOther] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
      setError("");
      setUnlocked(false);
      setShowAddForm(false);
    }
  }, [open]);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  };

  const updateQuestionText = (index: number, text: string) => {
    const questions = config.questions.map((q, i) => (i === index ? { ...q, text } : q));
    onUpdateConfig({ ...config, questions });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const questions = [...config.questions];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= questions.length) return;
    [questions[index], questions[target]] = [questions[target], questions[index]];
    onUpdateConfig({ ...config, questions });
  };

  const deleteQuestion = (index: number) => {
    if (!confirm(`Delete Q${index + 1}?`)) return;
    onUpdateConfig({
      ...config,
      questions: config.questions.filter((_, i) => i !== index),
    });
  };

  const confirmAdd = () => {
    const text = newText.trim();
    if (!text) {
      alert("Enter question text.");
      return;
    }

    let question: Question;
    if (newType === "open") {
      question = { type: "open", text };
    } else if (newType === "tf") {
      question = { type: "tf", text };
    } else if (newType === "rating") {
      question = { type: "rating", text };
    } else {
      const options = mcOptions.map((o) => o.trim()).filter(Boolean);
      if (options.length < 2) {
        alert("Enter at least two multiple choice options.");
        return;
      }
      question = { type: "mc", text, options, other: includeOther };
    }

    onUpdateConfig({ ...config, questions: [...config.questions, question] });
    setShowAddForm(false);
    setNewText("");
    setMcOptions(EMPTY_MC);
    setIncludeOther(false);
    setNewType("open");
  };

  const downloadConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "survey-updated.json";
    anchor.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={`admin-overlay${open ? " open" : ""}`}>
      <div className="admin-box">
        <div className="admin-header">
          <h2>Survey Admin</h2>
          <button type="button" className="admin-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="admin-body">
          {!unlocked ? (
            <div style={{ padding: 30, textAlign: "center" }}>
              <p style={{ marginBottom: 12, fontSize: 14, color: "#555" }}>
                Enter admin password:
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                style={{
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 15,
                  width: 200,
                  marginRight: 8,
                }}
              />
              <button type="button" className="admin-unlock-btn" onClick={handleUnlock}>
                Unlock
              </button>
              {error && <div className="admin-err">{error}</div>}
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                Edit questions below. ▲▼ to reorder.
              </p>
              {config.questions.map((question, index) => (
                <div key={index} className="admin-q-row">
                  <div className="admin-q-num">Q{index + 1}</div>
                  <textarea
                    className="admin-q-textarea"
                    value={question.text}
                    onChange={(e) => updateQuestionText(index, e.target.value)}
                  />
                  <div className="admin-q-actions">
                    {index > 0 && (
                      <button
                        type="button"
                        className="admin-btn-sm admin-btn-up"
                        onClick={() => moveQuestion(index, "up")}
                      >
                        ▲
                      </button>
                    )}
                    {index < config.questions.length - 1 && (
                      <button
                        type="button"
                        className="admin-btn-sm admin-btn-dn"
                        onClick={() => moveQuestion(index, "down")}
                      >
                        ▼
                      </button>
                    )}
                    <button
                      type="button"
                      className="admin-btn-sm admin-btn-del"
                      onClick={() => deleteQuestion(index)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {showAddForm && (
                <div className="admin-add-form">
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as QuestionType)}
                  >
                    <option value="open">Open-Ended</option>
                    <option value="mc">Multiple Choice</option>
                    <option value="tf">True/False</option>
                    <option value="rating">Rating 1-5</option>
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Question text..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                  {newType === "mc" && (
                    <div className="admin-mc-options">
                      <div className="admin-mc-label">MULTIPLE CHOICE OPTIONS</div>
                      {["A", "B", "C", "D"].map((label, i) => (
                        <input
                          key={label}
                          type="text"
                          placeholder={`Option ${label}${i >= 2 ? " (optional)" : ""}`}
                          value={mcOptions[i]}
                          onChange={(e) => {
                            const next = [...mcOptions];
                            next[i] = e.target.value;
                            setMcOptions(next);
                          }}
                        />
                      ))}
                      <label
                        style={{
                          fontSize: 12,
                          color: "#444",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 6,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={includeOther}
                          onChange={(e) => setIncludeOther(e.target.checked)}
                        />
                        Include &quot;Other&quot; option
                      </label>
                    </div>
                  )}
                  <div className="admin-add-btns">
                    <button
                      type="button"
                      style={{
                        padding: "8px 16px",
                        background: "#660099",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      onClick={confirmAdd}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: "8px 16px",
                        background: "#e8e8f0",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="admin-actions">
                <button type="button" className="admin-btn-add" onClick={() => setShowAddForm(true)}>
                  + Add Question
                </button>
                <button type="button" className="admin-btn-download" onClick={downloadConfig}>
                  ⬇ Download Updated Survey
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
