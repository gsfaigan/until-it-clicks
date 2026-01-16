import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  bfsSteps,
  dfsSteps,
  dijkstraSteps,
  astarSteps,
  greedyBfsSteps,
  bidirectionalBfsSteps,
  jpsSteps,
  PATHFINDING_ALGO_INFO,
  PATHFINDING_ALGORITHM_DEFAULTS,
  pathfindingAlgorithmList
} from '../algorithms/pathfinding';
import { positionToFrequency, playTone } from '../utils/audio';

const GRID_ROWS = 20;
const GRID_COLS = 40;

// Cell states: 0 = empty, 1 = wall, 2 = start, 3 = end

export default function PathfindingVisualizer({ onBack, initialAlgorithm }) {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState([5, 5]);
  const [end, setEnd] = useState([14, 34]);
  const [speed, setSpeed] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState(initialAlgorithm || 'bfs');
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [exploreCells, setExploreCells] = useState(new Set());
  const [pathCells, setPathCells] = useState(new Set());
  const [currentCell, setCurrentCell] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState('wall'); // 'wall', 'start', 'end', 'erase'

  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const currentInfo = PATHFINDING_ALGO_INFO[algorithm] || PATHFINDING_ALGO_INFO.bfs;

  // Initialize grid
  const initGrid = useCallback(() => {
    const newGrid = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(0));
    newGrid[start[0]][start[1]] = 2;
    newGrid[end[0]][end[1]] = 3;
    setGrid(newGrid);
    setVisitedCells(new Set());
    setExploreCells(new Set());
    setPathCells(new Set());
    setCurrentCell(null);
    setSearchResult(null);
  }, [start, end]);

  useEffect(() => {
    initGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isRunning) {
      const defaults = PATHFINDING_ALGORITHM_DEFAULTS[algorithm];
      if (defaults) {
        setSpeed(defaults.speed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  // Clear walls only
  function clearWalls() {
    if (isRunning) return;
    const newGrid = grid.map(row => row.map(cell => (cell === 1 ? 0 : cell)));
    setGrid(newGrid);
    clearVisualization();
  }

  // Clear visualization (keep walls)
  function clearVisualization() {
    setVisitedCells(new Set());
    setExploreCells(new Set());
    setPathCells(new Set());
    setCurrentCell(null);
    setSearchResult(null);
  }

  // Generate random maze
  function generateMaze() {
    if (isRunning) return;
    const newGrid = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(0));

    // Add random walls (30% density)
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (Math.random() < 0.3) {
          newGrid[r][c] = 1;
        }
      }
    }

    // Ensure start and end are clear
    newGrid[start[0]][start[1]] = 2;
    newGrid[end[0]][end[1]] = 3;

    // Clear area around start and end
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const sr = start[0] + dr;
        const sc = start[1] + dc;
        const er = end[0] + dr;
        const ec = end[1] + dc;
        if (sr >= 0 && sr < GRID_ROWS && sc >= 0 && sc < GRID_COLS && newGrid[sr][sc] === 1) {
          newGrid[sr][sc] = 0;
        }
        if (er >= 0 && er < GRID_ROWS && ec >= 0 && ec < GRID_COLS && newGrid[er][ec] === 1) {
          newGrid[er][ec] = 0;
        }
      }
    }

    setGrid(newGrid);
    clearVisualization();
  }

  // Handle cell click/drag
  function handleCellMouseDown(row, col) {
    if (isRunning) return;
    setIsDrawing(true);
    handleCellInteraction(row, col);
  }

  function handleCellMouseEnter(row, col) {
    if (!isDrawing || isRunning) return;
    handleCellInteraction(row, col);
  }

  function handleCellMouseUp() {
    setIsDrawing(false);
  }

  function handleCellInteraction(row, col) {
    const newGrid = grid.map(r => [...r]);
    const currentValue = newGrid[row][col];

    if (drawMode === 'start') {
      // Clear old start
      newGrid[start[0]][start[1]] = 0;
      newGrid[row][col] = 2;
      setStart([row, col]);
    } else if (drawMode === 'end') {
      // Clear old end
      newGrid[end[0]][end[1]] = 0;
      newGrid[row][col] = 3;
      setEnd([row, col]);
    } else if (drawMode === 'wall') {
      if (currentValue === 0) {
        newGrid[row][col] = 1;
      }
    } else if (drawMode === 'erase') {
      if (currentValue === 1) {
        newGrid[row][col] = 0;
      }
    }

    setGrid(newGrid);
    clearVisualization();
  }

  function visualizePathfinding() {
    let steps = [];
    const gridCopy = grid.map(r => [...r]);

    switch (algorithm) {
      case 'dfs':
        steps = dfsSteps(gridCopy, start, end);
        break;
      case 'dijkstra':
        steps = dijkstraSteps(gridCopy, start, end);
        break;
      case 'astar':
        steps = astarSteps(gridCopy, start, end);
        break;
      case 'greedy':
        steps = greedyBfsSteps(gridCopy, start, end);
        break;
      case 'bidirectional':
        steps = bidirectionalBfsSteps(gridCopy, start, end);
        break;
      case 'jps':
        steps = jpsSteps(gridCopy, start, end);
        break;
      default:
        steps = bfsSteps(gridCopy, start, end);
    }

    let i = 0;
    setIsRunning(true);
    setVisitedCells(new Set());
    setExploreCells(new Set());
    setPathCells(new Set());
    setSearchResult(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        return;
      }

      const step = steps[i];

      if (step.type === 'visit' || step.type === 'visit_start' || step.type === 'visit_end') {
        setVisitedCells(prev => new Set([...prev, `${step.cell[0]},${step.cell[1]}`]));
        setCurrentCell(step.cell);
      } else if (step.type === 'explore' || step.type === 'explore_start' || step.type === 'explore_end') {
        setExploreCells(prev => new Set([...prev, `${step.cell[0]},${step.cell[1]}`]));
      } else if (step.type === 'path') {
        setPathCells(prev => new Set([...prev, `${step.cell[0]},${step.cell[1]}`]));
      } else if (step.type === 'found') {
        setSearchResult('found');
      } else if (step.type === 'not_found') {
        setSearchResult('not_found');
      }

      // Play audio
      try {
        if (!audioRef.current) {
          audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioRef.current;
        if (step.cell) {
          const freq = positionToFrequency(step.cell[0], step.cell[1], GRID_ROWS, GRID_COLS);
          playTone(ctx, freq, 0.08);
        }
      } catch (e) {
        // ignore
      }

      i++;
    }, speed);
  }

  function stopPathfinding() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    try {
      if (audioRef.current && audioRef.current.state === 'running') {
        audioRef.current.suspend();
      }
    } catch (e) {
      // ignore
    }
  }

  // Get cell color
  function getCellClass(row, col) {
    const key = `${row},${col}`;
    const cellValue = grid[row]?.[col];

    if (cellValue === 2) return 'bg-green-500'; // Start
    if (cellValue === 3) return 'bg-red-500';   // End
    if (cellValue === 1) return 'bg-zinc-700';  // Wall

    if (pathCells.has(key)) return 'bg-yellow-400';
    if (currentCell && currentCell[0] === row && currentCell[1] === col) return 'bg-purple-500';
    if (visitedCells.has(key)) return 'bg-blue-500';
    if (exploreCells.has(key)) return 'bg-blue-300';

    return 'bg-zinc-900';
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-4" onMouseUp={handleCellMouseUp}>
      <style>{`
        .algorithm-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .algorithm-scroll::-webkit-scrollbar-track {
          background: #09090b;
        }
        .algorithm-scroll::-webkit-scrollbar-thumb {
          background: #27272a;
        }
        .algorithm-scroll::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>

      <button
        onClick={onBack}
        disabled={isRunning}
        className={`absolute top-4 left-4 px-3 py-1 text-sm ${isRunning ? 'bg-zinc-700 text-zinc-500 pointer-events-none' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Pathfinding Algorithm Visualizer</h1>

      <div className="flex gap-2 mb-4 items-center flex-wrap justify-center">
        <button
          onClick={generateMaze}
          disabled={isRunning}
          className={`px-3 py-2 text-sm ${isRunning ? 'bg-zinc-700 text-zinc-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Generate Maze
        </button>
        <button
          onClick={clearWalls}
          disabled={isRunning}
          className={`px-3 py-2 text-sm ${isRunning ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-700 hover:bg-zinc-600 text-white'}`}
        >
          Clear Walls
        </button>
        <button
          onClick={clearVisualization}
          disabled={isRunning}
          className={`px-3 py-2 text-sm ${isRunning ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-700 hover:bg-zinc-600 text-white'}`}
        >
          Clear Path
        </button>

        <div className="h-6 w-px bg-zinc-700 mx-2"></div>

        <div className="flex gap-1">
          {[
            { mode: 'wall', label: 'Wall', color: 'bg-zinc-600' },
            { mode: 'erase', label: 'Erase', color: 'bg-zinc-800' },
            { mode: 'start', label: 'Start', color: 'bg-green-500' },
            { mode: 'end', label: 'End', color: 'bg-red-500' }
          ].map(({ mode, label, color }) => (
            <button
              key={mode}
              onClick={() => setDrawMode(mode)}
              disabled={isRunning}
              className={`px-3 py-1 text-sm flex items-center gap-2 ${drawMode === mode ? 'ring-2 ring-blue-400' : ''} ${isRunning ? 'opacity-50' : ''}`}
            >
              <span className={`w-3 h-3 ${color}`}></span>
              {label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-zinc-700 mx-2"></div>

        <button
          onClick={visualizePathfinding}
          disabled={isRunning}
          className={`px-4 py-2 ${isRunning ? 'bg-zinc-700 text-zinc-400' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          Start
        </button>
        <button
          onClick={stopPathfinding}
          disabled={!isRunning}
          className={`px-4 py-2 ${!isRunning ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          Stop
        </button>
      </div>

      {searchResult && (
        <div className={`mb-4 px-4 py-2 ${searchResult === 'found' ? 'bg-green-600' : 'bg-red-600'}`}>
          {searchResult === 'found' ? 'Path found!' : 'No path exists'}
        </div>
      )}

      <div className="flex flex-col items-center mb-4">
        <label>Speed (ms): {speed}</label>
        <input
          type="range"
          min="5"
          max="100"
          value={speed}
          disabled={isRunning}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className={`w-64 ${isRunning ? 'opacity-60' : ''}`}
        />
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row md:flex-wrap gap-4 items-start">
        <div className="w-full md:w-48 bg-zinc-900 p-2 flex flex-col relative order-3 md:order-1">
          <div className="text-sm text-zinc-400 font-semibold mb-2 text-center">Algorithms</div>
          <div className="space-y-1 algorithm-scroll">
            {pathfindingAlgorithmList.map(opt => (
              <button
                key={opt.value}
                onClick={() => { if (!isRunning) setAlgorithm(opt.value); }}
                disabled={isRunning}
                className={`w-full text-left px-3 py-2 text-sm ${algorithm === opt.value ? (isRunning ? 'bg-zinc-700 text-zinc-400' : 'bg-green-600 text-white') : (isRunning ? 'text-zinc-600' : 'text-zinc-300 hover:bg-zinc-800')}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 order-1 md:order-2 flex justify-center">
          <div
            className="border border-zinc-800 bg-zinc-950 p-1 inline-block select-none"
            style={{ cursor: isRunning ? 'default' : 'crosshair' }}
          >
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex">
                {row.map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className={`w-4 h-4 border border-zinc-800 ${getCellClass(rowIdx, colIdx)} transition-colors duration-75`}
                    onMouseDown={() => handleCellMouseDown(rowIdx, colIdx)}
                    onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-full text-sm text-zinc-400 px-4 order-2 md:order-3">
          <h3 className="font-semibold">How it works</h3>
          <div className="text-xs text-zinc-500 mb-2">{currentInfo.complexity}</div>
          <ol className="list-decimal ml-6 mb-4">
            {currentInfo.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className="flex flex-wrap gap-4 text-xs mt-4">
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500"></div> Start</div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-500"></div> End</div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-zinc-700"></div> Wall</div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-blue-300"></div> Exploring</div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-blue-500"></div> Visited</div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-yellow-400"></div> Path</div>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Click and drag to draw walls. Use the buttons above to set start/end points.
          </div>
        </div>
      </div>

      <footer className="text-center py-4 mt-8">
        <a
          href="https://faigan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-blue-400 transition-colors duration-200"
        >
          faigan.com
        </a>
      </footer>
    </div>
  );
}
