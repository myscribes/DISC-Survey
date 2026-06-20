import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  buildResultsEmailHtml,
  buildResultsEmailText,
} from "@/lib/formatResults";
import type { Question, SurveyAnswers } from "@/types/survey";

const ses = new SESClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

export interface SurveySubmission {
  surveyTitle: string;
  surveyId: string;
  participantName: string;
  participantEmail: string;
  participantOrg: string;
  questions: Question[];
  answers: SurveyAnswers;
}

function getFromEmail(): string {
  const fromEmail = process.env.SES_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("SES_FROM_EMAIL is not configured.");
  }
  return fromEmail;
}

function getAdminEmail(): string {
  return process.env.SURVEY_ADMIN_EMAIL ?? "surveys@discconnector.com";
}

async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  await ses.send(
    new SendEmailCommand({
      Source: getFromEmail(),
      Destination: {
        ToAddresses: [params.to],
      },
      Message: {
        Subject: { Data: params.subject, Charset: "UTF-8" },
        Body: {
          Text: { Data: params.text, Charset: "UTF-8" },
          Html: { Data: params.html, Charset: "UTF-8" },
        },
      },
    }),
  );
}

export async function sendSurveyResults(submission: SurveySubmission) {
  const context = {
    surveyTitle: submission.surveyTitle,
    surveyId: submission.surveyId,
    participantName: submission.participantName,
    participantEmail: submission.participantEmail,
    participantOrg: submission.participantOrg,
    questions: submission.questions,
    answers: submission.answers,
  };

  const text = buildResultsEmailText(context);
  const html = buildResultsEmailHtml(context);
  const subject = `${submission.surveyTitle} — ${submission.participantName}`;

  await sendEmail({
    to: getAdminEmail(),
    subject: `[Survey Submission] ${subject}`,
    text,
    html,
  });

  await sendEmail({
    to: submission.participantEmail,
    subject: `Your copy: ${submission.surveyTitle}`,
    text,
    html,
  });
}
