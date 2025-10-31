import React, { useState, useEffect, useMemo } from "react";
import ToggleGameState from "./ToggleGameState";
import Board from "./Board";
import GuessInput from "./GuessInput";
import FoundSolutions from "./FoundSolutions";
import SummaryResults from "./SummaryResults";
import boggleData from "./Boggle_Solutions_Endpoint-2.json";
import logo from "./logo.svg";
import "./App.css";

const GAME_STATE = {
  INIT: "INIT",
  IN_PROGRESS: "IN_PROGRESS",
  ENDED: "ENDED",
};

function App() {
  const myMap = useMemo(() => new Map(Object.entries(boggleData || {})), []);

  // core state
  const [gameState, setGameState] = useState(GAME_STATE.INIT);
  const [gridSize, setGridSize] = useState(3);
  const [grid, setGrid] = useState([]); // actual game grid (used while IN_PROGRESS or ENDED)
  const [allSolutions, setAllSolutions] = useState([]); // remaining solutions
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);

  // preview grid based on selected size (updates immediately when size changes)
  const previewGrid = useMemo(() => {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: gridSize * gridSize }, (_, i) => alpha[i % alpha.length]);
  }, [gridSize]);

  // choose which board to show:
  // - while IN_PROGRESS or after ENDED show the actual game grid (grid may be 2D or flat)
  // - otherwise show the preview that updates as user changes size
  const boardToShow =
    gameState === GAME_STATE.IN_PROGRESS || gameState === GAME_STATE.ENDED ? grid : previewGrid;

  // load grid & solutions when a game starts (use local JSON map)
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      const entry = myMap.get(String(gridSize)) || {};
      if (entry && Array.isArray(entry.grid) && entry.grid.length > 0) {
        // JSON uses 2D arrays for grid; keep as-is
        setGrid(entry.grid);
        setAllSolutions(Array.isArray(entry.solutions) ? entry.solutions.slice() : []);
      } else {
        // fallback deterministic flat grid
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const letters = Array.from({ length: gridSize * gridSize }, (_, i) => alpha[i % alpha.length]);
        setGrid(letters);
        setAllSolutions([]);
      }
      setFoundSolutions([]);
      setStartTime(Date.now());
      setTotalTime(null);
    }
    // when resetting to INIT, clear grid/solutions
    if (gameState === GAME_STATE.INIT) {
      setGrid([]);
      setAllSolutions([]);
      setFoundSolutions([]);
      setStartTime(null);
      setTotalTime(null);
    }
  }, [gameState, gridSize, myMap]);

  // update totalTime when ToggleGameState calls setTotalTime (keeps UI in sync)
  // ToggleGameState already calls setTotalTime on end; no extra effect required here.

  function correctAnswerFound(answer) {
    if (!answer) return;
    // avoid duplicates
    if (foundSolutions.includes(answer)) return;
    setFoundSolutions((prev) => [...prev, answer]);
    setAllSolutions((prev) => prev.filter((w) => String(w).toLowerCase() !== String(answer).toLowerCase()));
  }

  return (
    <div className="App">
      <img src={logo} width="25%" height="25%" className="logo" alt="Bison Boggle Logo" />

      <ToggleGameState
        gameState={gameState}
        setGameState={(state) => setGameState(state)}
        setSize={(s) => setGridSize(s)}
        setTotalTime={(t) => setTotalTime(t)}
        size={gridSize}
        foundSolutions={foundSolutions}
      />

      <Board board={boardToShow} />

      {gameState === GAME_STATE.IN_PROGRESS && (
        <div>
          <GuessInput
            allSolutions={allSolutions}
            foundSolutions={foundSolutions}
            correctAnswerCallback={(answer) => correctAnswerFound(answer)}
          />
        </div>
      )}

      {gameState === GAME_STATE.ENDED && (
        <div>
          <SummaryResults words={foundSolutions} totalTime={totalTime} />
          <FoundSolutions
            headerText="Remaining Words"
            words={[...allSolutions].sort((a, b) => a.localeCompare(b))}
            commaList={true}
          />
        </div>
      )}
    </div>
  );
}

export default App;
