import SurveyApp from "@/components/SurveyApp";
import surveyConfig from "@/data/survey.json";
import type { SurveyConfig } from "@/types/survey";

export default function Home() {
  return <SurveyApp initialConfig={surveyConfig as SurveyConfig} />;
}
