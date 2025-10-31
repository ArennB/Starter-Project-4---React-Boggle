import React from "react";
import "./Board.css";

/*
  Board accepts:
    - board: either a flat array of length N*N, or an array of N arrays (rows),
             or an object whose values are row-objects/arrays.
    - optional prop `size` (not required) — if not provided we infer from board length.
*/
function Board({ board = [], size: propSize }) {
  let cells = [];
  let size = propSize;

  // Normalize board into flat array `cells` and determine `size`
  if (Array.isArray(board)) {
    if (board.length === 0) {
      size = size || 3;
      cells = Array(size * size).fill("");
    } else if (Array.isArray(board[0])) {
      // board is 2D array
      size = board.length;
      cells = board.flat();
    } else {
      // board is flat array
      cells = board.slice();
      if (!size) size = Math.round(Math.sqrt(cells.length)) || 3;
    }
  } else if (board && typeof board === "object") {
    // object map of rows -> convert to rows then flatten
    const rows = Object.values(board);
    size = rows.length || propSize || 3;
    cells = rows.flatMap((r) => (Array.isArray(r) ? r : Object.values(r)));
  } else {
    size = size || 3;
    cells = Array(size * size).fill("");
  }

  // Ensure cells length >= size*size
  if (cells.length < size * size) {
    const missing = size * size - cells.length;
    cells = cells.concat(Array(missing).fill(""));
  }

  const cellSize = Math.max(40, Math.floor(360 / Math.max(3, size))); // px

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
  };

  const cellStyle = {
    width: cellSize,
    height: cellSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: Math.max(16, Math.floor(cellSize / 2.8)),
    userSelect: "none",
  };

  return (
    <div className="Board-div">
      <div style={gridStyle}>
        {Array.from({ length: size * size }).map((_, idx) => (
          <div key={idx} className="Tile" style={cellStyle}>
            {cells[idx]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
