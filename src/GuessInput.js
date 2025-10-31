import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "./GuessInput.css";

function GuessInput({ allSolutions = [], foundSolutions = [], correctAnswerCallback = () => {} }) {
  const [labelText, setLabelText] = useState("Make your first guess!");
  const [input, setInput] = useState("");

  function evaluateInput() {
    if (foundSolutions.includes(input)) {
      setLabelText(input + " has already been found!");
    } else if (allSolutions.includes(input)) {
      correctAnswerCallback(input);
      setLabelText(input + " is correct!");
    } else {
      setLabelText(input + " is incorrect!");
    }
  }

  function keyPress(e) {
    if (e.key === "Enter") {
      e.target.value = "";
      evaluateInput();
      setInput("");
    }
  }

  return (
    <div className="Guess-input">
      <div>{labelText}</div>
      <TextField
        onKeyPress={(e) => keyPress(e)}
        onChange={(event) => setInput(event.target.value)}
        value={input}
      />
    </div>
  );
}

export default GuessInput;
