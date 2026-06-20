export type QuestionType = "mc" | "open" | "tf" | "rating";

export interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  other?: boolean;
}

export interface SurveyConfig {
  title: string;
  questions: Question[];
}

export interface ParticipantInfo {
  participant_name: string;
  participant_email: string;
  participant_org: string;
}

export type SurveyAnswers = Record<string, string>;
