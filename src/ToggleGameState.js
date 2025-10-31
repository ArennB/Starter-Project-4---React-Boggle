import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import "./ToggleGameState.css";

function ToggleGameState({
  gameState,
  setGameState,
  setSize,
  setTotalTime,
  size,
  foundSolutions = [],
}) {
  const [buttonText, setButtonText] = useState(
    gameState === "IN_PROGRESS" ? "End Game" : "Start Game"
  );
  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setButtonText(gameState === "IN_PROGRESS" ? "End Game" : "Start Game");
  }, [gameState]);

  useEffect(() => {
    if (gameState === "IN_PROGRESS" && startTime) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (gameState !== "IN_PROGRESS") setElapsedMs(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState, startTime]);

  const formatMs = (ms) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2).padStart(5, "0");
    return `${minutes}:${seconds}`;
  };

  function updateGameState() {
    if (gameState !== "IN_PROGRESS") {
      const now = Date.now();
      setStartTime(now);
      setElapsedMs(0);
      setGameState("IN_PROGRESS");
    } else {
      const endTime = Date.now();
      const deltaMs = startTime ? endTime - startTime : 0;
      const deltaSec = Number((deltaMs / 1000).toFixed(2));
      setTotalTime(deltaSec);
      setElapsedMs(deltaMs);
      setStartTime(null);
      setGameState("ENDED");
    }
  }

  const handleChange = (event) => {
    const newSize = Number(event.target.value);
    setSize(newSize);
  };

  return (
    <div className="Toggle-game-state">
      {/* Start/End button below logo, above dropdown */}
      <div className="StartButtonRow">
        <Button variant="contained" color="primary" onClick={updateGameState}>
          {buttonText}
        </Button>
      </div>

      <div className="Input-select-size">
        <FormControl>
          <Select
            labelId="sizelabel"
            id="sizemenu"
            value={size}
            onChange={handleChange}
            disabled={gameState === "IN_PROGRESS"}
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <MenuItem key={s} value={s}>
                {s} x {s}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Set Grid Size</FormHelperText>
        </FormControl>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Time:</strong>{" "}
        <span style={{ fontFamily: "monospace", marginLeft: 6 }}>{formatMs(elapsedMs)}</span>
      </div>

      {gameState === "IN_PROGRESS" && (
        <div style={{ marginTop: 12, textAlign: "left" }}>
          <strong>Found ({foundSolutions.length}):</strong>
          <ul style={{ margin: "6px 0", maxHeight: 120, overflowY: "auto" }}>
            {foundSolutions.length ? (
              foundSolutions.map((w, i) => <li key={i}>{w}</li>)
            ) : (
              <li style={{ fontStyle: "italic" }}>No words found yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ToggleGameState;
