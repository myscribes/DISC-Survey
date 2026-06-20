import { NextResponse } from "next/server";
import { sendSurveyResults } from "@/lib/email";
import type { Question, SurveyAnswers } from "@/types/survey";

interface SubmitBody {
  participant_name?: string;
  participant_email?: string;
  participant_org?: string;
  survey_id?: string;
  survey_title?: string;
  questions?: Question[];
  answers?: SurveyAnswers;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    const participantName = body.participant_name?.trim() ?? "";
    const participantEmail = body.participant_email?.trim() ?? "";
    const participantOrg = body.participant_org?.trim() ?? "";
    const surveyId = body.survey_id?.trim() ?? "Session 1";
    const surveyTitle = body.survey_title?.trim() ?? "DISC Survey";
    const questions = body.questions ?? [];
    const answers = body.answers ?? {};

    if (!participantName) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!participantEmail || !isValidEmail(participantEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required to send your results copy." },
        { status: 400 },
      );
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: "Survey questions are missing." }, { status: 400 });
    }

    await sendSurveyResults({
      surveyTitle,
      surveyId,
      participantName,
      participantEmail,
      participantOrg,
      questions,
      answers,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Survey submission failed:", error);
    return NextResponse.json(
      { error: "Unable to submit survey. Please try again or contact support." },
      { status: 500 },
    );
  }
}
