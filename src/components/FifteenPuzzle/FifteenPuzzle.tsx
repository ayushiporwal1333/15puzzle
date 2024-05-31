import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Board from "../Board/Board";
import Instructions from "../Instructions/Instructions";
import Footer from "../Footer/Footer";

const gridSize: number = 4;
const emptyTile: number = gridSize * gridSize;

const shuffleArray = (array: number[]): number[] => {
  for (let i: number = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isSolvable = (tiles: number[]): boolean => {
  let inversions: number = 0;
  for (let i: number = 0; i < tiles.length; i++) {
    for (let j: number = i + 1; j < tiles.length; j++) {
      if (
        tiles[i] !== emptyTile &&
        tiles[j] !== emptyTile &&
        tiles[i] > tiles[j]
      ) {
        inversions++;
      }
    }
  }
  const emptyRow: number = Math.floor(tiles.indexOf(emptyTile) / gridSize);
  return gridSize % 2 === 0
    ? (inversions + emptyRow) % 2 === 0
    : inversions % 2 === 0;
};

const generateTiles = (solvable: boolean): number[] => {
  let tiles: number[] = Array.from(
    { length: gridSize * gridSize },
    (_, i) => i + 1
  );
  do {
    shuffleArray(tiles);
  } while (isSolvable(tiles) !== solvable);
  return tiles;
};

const FifteenPuzzle = () => {
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<string>("00:00");
  const [tiles, setTiles] = useState<number[]>(
    Array(gridSize * gridSize).fill(emptyTile)
  );
  const [solvable, setSolvable] = useState<boolean>(true);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<string>("");
  const [initialTiles, setInitialTiles] = useState<number[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isGameActive && !isGamePaused) {
          setIsGamePaused(true);
          clearTimer();
        } else {
          handleStartPause();
        }
      }
    };

    window.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      window.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [isGameActive, isGamePaused]);

  useEffect(() => {
    if (solvable && isGameActive && !isGamePaused) {
      startTimer();
    } else {
      clearTimer();
    }
  }, [solvable, isGameActive, isGamePaused]);

  useEffect(() => {
    const handleArrowKeyPress = (event: KeyboardEvent) => {
      if (!isGameActive || isGamePaused) return;

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
      }

      const emptyIndex: number = tiles.indexOf(emptyTile);
      let newIndex: number;
      switch (event.key) {
        case "ArrowUp":
          newIndex = emptyIndex + gridSize;
          break;
        case "ArrowDown":
          newIndex = emptyIndex - gridSize;
          break;
        case "ArrowLeft":
          newIndex = emptyIndex + 1;
          break;
        case "ArrowRight":
          newIndex = emptyIndex - 1;
          break;
        default:
          return;
      }
      if (newIndex >= 0 && newIndex < gridSize * gridSize) {
        const newTiles: number[] = [...tiles];
        [newTiles[emptyIndex], newTiles[newIndex]] = [
          newTiles[newIndex],
          newTiles[emptyIndex],
        ];
        setTiles(newTiles);
        setMoves(moves + 1);
      }
    };

    window.addEventListener("keydown", handleArrowKeyPress);

    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [tiles, isGameActive, isGamePaused, moves]);

  const startTimer = () => {
    if (timerId) {
      clearInterval(timerId);
    }

    const startTime: number = new Date().getTime() - elapsedTime * 1000;
    const id: NodeJS.Timeout = setInterval(() => {
      const currentTime = new Date().getTime();
      const newElapsedTime = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(newElapsedTime);
      setTime(formatTime(newElapsedTime));
    }, 1000);

    setTimerId(id);
  };

  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleShuffle = () => {
    const isSolvablePuzzle = Math.random() < 0.5;
    const newTiles: number[] = generateTiles(isSolvablePuzzle);
    setInitialTiles([...newTiles]);
    setTiles(newTiles);
    setMoves(0);
    setTime("00:00");
    setElapsedTime(0);
    setIsGameActive(false);
    setIsGamePaused(false);
    clearTimer();
    setSolvable(isSolvablePuzzle);
  };

  const handleHelp = () => {
    if (!isGameActive || isGamePaused) return;

    const emptyIndex: number = tiles.indexOf(emptyTile);
    const row: number = Math.floor(emptyIndex / gridSize);
    const col: number = emptyIndex % gridSize;
    const directions: string[] = ["up", "down", "left", "right"];

    const validDirections: string[] = directions.filter((direction) => {
      switch (direction) {
        case "up":
          return row > 0 && lastMove !== "down";
        case "down":
          return row < gridSize - 1 && lastMove !== "up";
        case "left":
          return col > 0 && lastMove !== "right";
        case "right":
          return col < gridSize - 1 && lastMove !== "left";
        default:
          return false;
      }
    });

    if (validDirections.length === 0) return;

    const randomDirection: string =
      validDirections[Math.floor(Math.random() * validDirections.length)];

    let newIndex: number;
    switch (randomDirection) {
      case "up":
        newIndex = emptyIndex - gridSize;
        break;
      case "down":
        newIndex = emptyIndex + gridSize;
        break;
      case "left":
        newIndex = emptyIndex - 1;
        break;
      case "right":
        newIndex = emptyIndex + 1;
        break;
      default:
        return;
    }

    const newTiles: number[] = [...tiles];
    [newTiles[emptyIndex], newTiles[newIndex]] = [
      newTiles[newIndex],
      newTiles[emptyIndex],
    ];

    setMoves(moves + 1);
    setTiles(newTiles);
    setLastMove(randomDirection);
  };

  const handleTileClick = (index: number) => {
    if (!isGameActive || isGamePaused) return;
    const newTiles: number[] = [...tiles];
    const emptyIndex: number = tiles.indexOf(emptyTile);
    const [row, col]: number[] = [
      Math.floor(index / gridSize),
      index % gridSize,
    ];
    const [emptyRow, emptyCol]: number[] = [
      Math.floor(emptyIndex / gridSize),
      emptyIndex % gridSize,
    ];

    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  const handleStartPause = () => {
    if (isGameActive && !isGamePaused) {
      setIsGamePaused(true);
      clearTimer();
    } else {
      if (!isGameActive) {
        const tilesToUse: number[] = initialTiles.length
          ? initialTiles
          : generateTiles(true);
        setTiles([...tilesToUse]);
        if (!initialTiles.length) {
          setInitialTiles([...tilesToUse]);
        }
        setSolvable(isSolvable(tilesToUse));
      }
      setIsGameActive(true);
      setIsGamePaused(false);
      startTimer();
    }
  };

  const handleReset = () => {
    clearTimer();
    setTiles([...initialTiles]);
    setMoves(0);
    setTime("00:00");
    setElapsedTime(0);
    setIsGameActive(false);
    setIsGamePaused(false);
  };

  return (
    <div>
      <Header
        onStartPause={handleStartPause}
        onReset={handleReset}
        onShuffle={handleShuffle}
        onHelp={handleHelp}
        moves={moves}
        time={time}
        isGameActive={isGameActive}
        isGamePaused={isGamePaused}
        solvable={solvable}
      />
      <Board
        tiles={tiles}
        onTileClick={handleTileClick}
        onStartPause={handleStartPause}
        isGameActive={isGameActive}
        isGamePaused={isGamePaused}
        solvable={solvable}
      />
      <Instructions />
      <Footer />
    </div>
  );
};

export default FifteenPuzzle;
