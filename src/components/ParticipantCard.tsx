"use client";

import type { ParticipantInfo } from "@/types/survey";

interface ParticipantCardProps {
  values: ParticipantInfo;
  onChange: (field: keyof ParticipantInfo, value: string) => void;
}

export default function ParticipantCard({ values, onChange }: ParticipantCardProps) {
  return (
    <div className="participant-card">
      <h3>Participant Information</h3>
      <div className="form-row">
        <label htmlFor="participant_name">Name</label>
        <input
          id="participant_name"
          type="text"
          name="participant_name"
          required
          placeholder="Your full name"
          value={values.participant_name}
          onChange={(e) => onChange("participant_name", e.target.value)}
        />
      </div>
      <div className="form-row">
        <label htmlFor="participant_email">Email Address</label>
        <input
          id="participant_email"
          type="email"
          name="participant_email"
          required
          placeholder="Please enter the email address where you would like to receive a copy of your feedback"
          value={values.participant_email}
          onChange={(e) => onChange("participant_email", e.target.value)}
        />
      </div>
      <div className="form-row">
        <label htmlFor="participant_org">Organization / Company</label>
        <input
          id="participant_org"
          type="text"
          name="participant_org"
          placeholder="Your organization"
          value={values.participant_org}
          onChange={(e) => onChange("participant_org", e.target.value)}
        />
      </div>
    </div>
  );
}
