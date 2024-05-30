import React from "react";

interface BoardProps {
  tiles: number[];
  onTileClick: (index: number) => void;
  onStartPause: () => void;
  isGameActive: boolean;
  isGamePaused: boolean;
  solvable: boolean;
}

const gridSize = 4;
const emptyTile = gridSize * gridSize;

const Board: React.FC<BoardProps> = ({
  tiles,
  onTileClick,
  onStartPause,
  isGameActive,
  isGamePaused,
  solvable,
}) => {
  return (
    <div
      className={`grid ${!isGameActive ? "disabled" : ""} ${
        isGamePaused ? "paused" : ""
      }`}
    >
      {(!isGameActive || isGamePaused) && (
        <div className="grid-overlay">
          <a
            className={!solvable ? "not-solvable" : ""}
            onClick={solvable ? onStartPause : undefined}
          >
            {isGamePaused ? "paused" : !solvable ? "not solvable" : "play"}
          </a>
        </div>
      )}
      {tiles.map((tile, index) => (
        <div
          key={index}
          className={`tile ${tile === emptyTile ? "empty" : ""}`}
          onClick={() => onTileClick(index)}
        >
          {tile !== emptyTile && tile}
        </div>
      ))}
      <style jsx>{`
        .grid {
          grid-template-columns: repeat(${gridSize}, 1fr);
        }
      `}</style>
    </div>
  );
};

export default Board;
