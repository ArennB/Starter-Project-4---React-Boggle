import React from "react";
import "./SummaryResults.css";

function SummaryResults({ words = [], totalTime = 0 }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    if (mins > 0) {
      return `${mins}:${secs.padStart(5, "0")}`;
    }
    return `${secs} secs`;
  };

  return (
    <div className="Summary-results-list">
      <h2>SUMMARY</h2>
      <div className="summary-item">Total Words Found: {words.length}</div>
      <div className="summary-item">Total Time: {formatTime(totalTime)}</div>
      <div className="Found-words-list">
        <span>Words You've Found</span>
        <div className="words">
          {words.length > 0 ? words.join(", ") : <em>None</em>}
        </div>
      </div>
    </div>
  );
}

export default SummaryResults;
