"use client";

interface ThankYouOverlayProps {
  show: boolean;
  onClose: () => void;
}

export default function ThankYouOverlay({ show, onClose }: ThankYouOverlayProps) {
  return (
    <div className={`overlay${show ? " show" : ""}`}>
      <div className="overlay-box">
        <h2>Thank You!</h2>
        <p>
          Thank you for completing the survey. A copy of your responses has been emailed to you
          and to your coach. You will hear from them shortly!
        </p>
        <br />
        <button type="button" className="overlay-close-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
