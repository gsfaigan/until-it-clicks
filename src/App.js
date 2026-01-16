import React, { useState } from "react";
import Home from "./components/Home";
import SortingVisualizer from "./components/SortingVisualizer";
import SearchVisualizer from "./components/SearchVisualizer";
import PathfindingVisualizer from "./components/PathfindingVisualizer";

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [initialAlgorithm, setInitialAlgorithm] = useState(null);

  const handleSelectAlgorithm = (category, algorithm) => {
    setInitialAlgorithm(algorithm);
    setCurrentView(category);
  };

  const handleBack = () => {
    setCurrentView('home');
    setInitialAlgorithm(null);
  };

  switch (currentView) {
    case 'sort':
      return <SortingVisualizer onBack={handleBack} initialAlgorithm={initialAlgorithm} />;
    case 'search':
      return <SearchVisualizer onBack={handleBack} initialAlgorithm={initialAlgorithm} />;
    case 'pathfind':
      return <PathfindingVisualizer onBack={handleBack} initialAlgorithm={initialAlgorithm} />;
    default:
      return <Home onSelectAlgorithm={handleSelectAlgorithm} />;
  }
}
