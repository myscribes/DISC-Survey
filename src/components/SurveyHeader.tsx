"use client";

import Image from "next/image";

export default function SurveyHeader() {
  return (
    <div className="site-header">
      <Image
        src="/logo.png"
        alt="DISCconnector"
        width={800}
        height={200}
        priority
        style={{ maxWidth: "50%", height: "auto", display: "block", margin: "0 auto" }}
      />
      <div className="site-copyright">© 2026 DISC-Connector. All Rights Reserved.</div>
    </div>
  );
}
