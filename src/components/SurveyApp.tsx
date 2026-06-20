"use client";

import { FormEvent, useState } from "react";
import AdminPanel from "@/components/AdminPanel";
import ParticipantCard from "@/components/ParticipantCard";
import QuestionField from "@/components/QuestionField";
import SurveyHeader from "@/components/SurveyHeader";
import ThankYouOverlay from "@/components/ThankYouOverlay";
import { SURVEY_ID } from "@/lib/constants";
import type { ParticipantInfo, SurveyAnswers, SurveyConfig } from "@/types/survey";

interface SurveyAppProps {
  initialConfig: SurveyConfig;
}

const emptyParticipant: ParticipantInfo = {
  participant_name: "",
  participant_email: "",
  participant_org: "",
};

function buildEmptyAnswers(count: number): SurveyAnswers {
  return Object.fromEntries(Array.from({ length: count }, (_, i) => [`q${i + 1}`, ""]));
}

export default function SurveyApp({ initialConfig }: SurveyAppProps) {
  const [config, setConfig] = useState(initialConfig);
  const [participant, setParticipant] = useState<ParticipantInfo>(emptyParticipant);
  const [answers, setAnswers] = useState<SurveyAnswers>(() =>
    buildEmptyAnswers(initialConfig.questions.length),
  );
  const [submitted, setSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);

  const handleParticipantChange = (field: keyof ParticipantInfo, value: string) => {
    setParticipant((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [`q${index + 1}`]: value }));
  };

  const handleConfigUpdate = (nextConfig: SurveyConfig) => {
    setConfig(nextConfig);
    setAnswers((prev) => {
      const next = buildEmptyAnswers(nextConfig.questions.length);
      for (let i = 0; i < nextConfig.questions.length; i++) {
        const key = `q${i + 1}`;
        if (prev[key] !== undefined) next[key] = prev[key];
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_name: participant.participant_name,
          participant_email: participant.participant_email,
          participant_org: participant.participant_org,
          survey_id: SURVEY_ID,
          survey_title: config.title,
          questions: config.questions,
          answers,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Submission failed.");
      }

      setSubmitted(true);
      setShowThankYou(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleThankYouClose = () => {
    window.close();
    setShowThankYou(false);
  };

  return (
    <>
      <SurveyHeader />

      <div className="survey-wrap">
        <div className="survey-title">{config.title}</div>
        <p className="survey-subtitle">Please complete all questions before submitting.</p>

        {submitted ? (
          <div className="completion-card">
            <h2>Thank You!</h2>
            <p>
              Thank you for completing the survey. A copy of your responses has been emailed to
              you and to your coach. You will hear from them shortly!
            </p>
          </div>
        ) : (
          <form id="survey-form" onSubmit={handleSubmit}>
            <ParticipantCard values={participant} onChange={handleParticipantChange} />

            {config.questions.map((question, index) => (
              <QuestionField
                key={`${index}-${question.text.slice(0, 20)}`}
                index={index}
                question={question}
                value={answers[`q${index + 1}`] ?? ""}
                onChange={(value) => handleAnswerChange(index, value)}
              />
            ))}

            {submitError && <div className="submit-error">{submitError}</div>}

            <div className="submit-area">
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Survey"}
              </button>
            </div>
          </form>
        )}

        <div className="footer-copy">© 2026 DISC-Connector. All Rights Reserved.</div>
      </div>

      <ThankYouOverlay show={showThankYou} onClose={handleThankYouClose} />

      <button type="button" className="admin-btn" onClick={() => setAdminOpen(true)}>
        🔐 Admin
      </button>

      <AdminPanel
        open={adminOpen}
        config={config}
        onClose={() => setAdminOpen(false)}
        onUpdateConfig={handleConfigUpdate}
      />
    </>
  );
}
