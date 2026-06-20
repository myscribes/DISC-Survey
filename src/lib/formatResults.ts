import type { Question, SurveyAnswers } from "@/types/survey";

const MC_LABELS = ["A", "B", "C", "D"];

export function formatAnswerDisplay(question: Question, answer: string): string {
  if (!answer.trim()) return "(No answer)";

  if (question.type === "mc" && question.options) {
    const index = MC_LABELS.indexOf(answer);
    if (index >= 0 && question.options[index]) {
      return `${answer}. ${question.options[index]}`;
    }
  }

  return answer;
}

interface ResultsContext {
  surveyTitle: string;
  surveyId: string;
  participantName: string;
  participantEmail: string;
  participantOrg: string;
  questions: Question[];
  answers: SurveyAnswers;
}

function buildResultRows(context: ResultsContext) {
  return context.questions.map((question, index) => {
    const key = `q${index + 1}`;
    const answer = context.answers[key] ?? "";
    return {
      number: index + 1,
      question: question.text,
      answer: formatAnswerDisplay(question, answer),
    };
  });
}

export function buildResultsEmailText(context: ResultsContext): string {
  const rows = buildResultRows(context);
  const lines = [
    context.surveyTitle,
    `Session: ${context.surveyId}`,
    "",
    "Participant Information",
    `Name: ${context.participantName}`,
    `Email: ${context.participantEmail}`,
    `Organization: ${context.participantOrg || "(not provided)"}`,
    "",
    "Responses",
    ...rows.flatMap((row) => [
      `${row.number}. ${row.question}`,
      `Answer: ${row.answer}`,
      "",
    ]),
  ];

  return lines.join("\n");
}

export function buildResultsEmailHtml(context: ResultsContext): string {
  const rows = buildResultRows(context);
  const responseRows = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;vertical-align:top;width:36px;font-weight:700;color:#660099;">${row.number}.</td>
          <td style="padding:12px;border-bottom:1px solid #eee;vertical-align:top;">
            <div style="font-weight:600;color:#333;margin-bottom:6px;">${escapeHtml(row.question)}</div>
            <div style="color:#444;line-height:1.5;">${escapeHtml(row.answer)}</div>
          </td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="font-family:Segoe UI,Arial,sans-serif;background:#f4f4f8;margin:0;padding:24px;">
    <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
      <div style="background:#660099;color:#fff;padding:20px 24px;">
        <h1 style="margin:0;font-size:22px;">${escapeHtml(context.surveyTitle)}</h1>
        <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Session: ${escapeHtml(context.surveyId)}</p>
      </div>
      <div style="padding:24px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#660099;">Participant Information</h2>
        <p style="margin:0 0 6px;color:#444;"><strong>Name:</strong> ${escapeHtml(context.participantName)}</p>
        <p style="margin:0 0 6px;color:#444;"><strong>Email:</strong> ${escapeHtml(context.participantEmail)}</p>
        <p style="margin:0 0 24px;color:#444;"><strong>Organization:</strong> ${escapeHtml(context.participantOrg || "(not provided)")}</p>
        <h2 style="margin:0 0 12px;font-size:16px;color:#660099;">Responses</h2>
        <table style="width:100%;border-collapse:collapse;">${responseRows}</table>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
