import React from "react";
import "./FoundSolutions.css";

function FoundSolutions({ words = [], headerText = "Found Words", commaList = false }) {
  return (
    <div className="Found-solutions-list">
      {words.length > 0 && <h4>{headerText}: {words.length}</h4>}
      {commaList ? (
        <div style={{ fontSize: "14pt", lineHeight: "20pt" }}>
          {words.length > 0 ? words.join(", ") : <span>None</span>}
        </div>
      ) : (
        <ul>
          {words.map((solution) => {
            return <li key={solution}>{solution}</li>;
          })}
        </ul>
      )}
    </div>
  );
}

export default FoundSolutions;