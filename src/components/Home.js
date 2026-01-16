import React, { useState } from 'react';
import { searchAlgorithmList, SEARCH_ALGO_INFO } from '../algorithms/search';
import { pathfindingAlgorithmList, PATHFINDING_ALGO_INFO } from '../algorithms/pathfinding';

// Sorting algorithm list (same as in SortingVisualizer)
const sortingAlgorithmList = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
  { value: 'shell', label: 'Shell Sort' },
  { value: 'counting', label: 'Counting Sort' },
  { value: 'radix', label: 'Radix Sort' },
  { value: 'bucket', label: 'Bucket Sort' },
  { value: 'timsort', label: 'Timsort' },
  { value: 'intro', label: 'Intro Sort' },
  { value: 'pdq', label: 'PDQ Sort' },
  { value: 'dualpivot', label: 'Dual-Pivot Quicksort' },
  { value: 'cocktail', label: 'Cocktail Shaker' },
  { value: 'comb', label: 'Comb Sort' },
  { value: 'gnome', label: 'Gnome Sort' },
  { value: 'oddeven', label: 'Odd-Even Sort' },
  { value: 'cycle', label: 'Cycle Sort' },
  { value: 'pancake', label: 'Pancake Sort' },
  { value: 'stooge', label: 'Stooge Sort' },
  { value: 'bogo', label: 'Bogo Sort' },
  { value: 'stupid', label: 'Stupid Sort' },
  { value: 'stalin', label: 'Stalin Sort' },
  { value: 'bitonic', label: 'Bitonic Sort' },
  { value: 'oddevenmerge', label: 'Odd-Even Merge Sort' },
  { value: 'pairwise', label: 'Pairwise Network' },
  { value: 'smooth', label: 'Smoothsort' },
  { value: 'tree', label: 'Tree Sort' },
  { value: 'tournament', label: 'Tournament Sort' },
  { value: 'patience', label: 'Patience Sort' },
  { value: 'strand', label: 'Strand Sort' },
  { value: 'library', label: 'Library Sort' },
  { value: 'block', label: 'Block Sort' },
  { value: 'blockmerge', label: 'Block Merge Sort' },
  { value: 'adaptivemerge', label: 'Adaptive Merge Sort' },
  { value: 'franceschini', label: 'Franceschini Sort' },
  { value: 'pigeonhole', label: 'Pigeonhole Sort' },
  { value: 'gravity', label: 'Gravity Sort' },
  { value: 'flash', label: 'Flash Sort' },
  { value: 'americanflag', label: 'American Flag Sort' },
  { value: 'proxmap', label: 'Proxmap Sort' },
  { value: 'spreadsort', label: 'Spreadsort' },
  { value: 'minmaxselection', label: 'Min-Max Selection' }
];

// Sorting algorithm info - best and worst complexity
const SORTING_ALGO_INFO = {
  bubble: { best: 'O(n)', worst: 'O(n²)' },
  selection: { best: 'O(n²)', worst: 'O(n²)' },
  insertion: { best: 'O(n)', worst: 'O(n²)' },
  merge: { best: 'O(n log n)', worst: 'O(n log n)' },
  quick: { best: 'O(n log n)', worst: 'O(n²)' },
  heap: { best: 'O(n log n)', worst: 'O(n log n)' },
  shell: { best: 'O(n log n)', worst: 'O(n²)' },
  counting: { best: 'O(n+k)', worst: 'O(n+k)' },
  radix: { best: 'O(nk)', worst: 'O(nk)' },
  bucket: { best: 'O(n+k)', worst: 'O(n²)' },
  timsort: { best: 'O(n)', worst: 'O(n log n)' },
  intro: { best: 'O(n log n)', worst: 'O(n log n)' },
  pdq: { best: 'O(n)', worst: 'O(n log n)' },
  dualpivot: { best: 'O(n log n)', worst: 'O(n²)' },
  cocktail: { best: 'O(n)', worst: 'O(n²)' },
  comb: { best: 'O(n log n)', worst: 'O(n²)' },
  gnome: { best: 'O(n)', worst: 'O(n²)' },
  oddeven: { best: 'O(n)', worst: 'O(n²)' },
  cycle: { best: 'O(n²)', worst: 'O(n²)' },
  pancake: { best: 'O(n)', worst: 'O(n²)' },
  stooge: { best: 'O(n^2.7)', worst: 'O(n^2.7)' },
  bogo: { best: 'O(n)', worst: 'O(∞)' },
  stupid: { best: 'O(n)', worst: 'O(∞)' },
  stalin: { best: 'O(n)', worst: 'O(n)' },
  bitonic: { best: 'O(log²n)', worst: 'O(log²n)' },
  oddevenmerge: { best: 'O(log²n)', worst: 'O(log²n)' },
  pairwise: { best: 'O(log²n)', worst: 'O(log²n)' },
  smooth: { best: 'O(n)', worst: 'O(n log n)' },
  tree: { best: 'O(n log n)', worst: 'O(n²)' },
  tournament: { best: 'O(n log n)', worst: 'O(n log n)' },
  patience: { best: 'O(n log n)', worst: 'O(n log n)' },
  strand: { best: 'O(n)', worst: 'O(n²)' },
  library: { best: 'O(n)', worst: 'O(n²)' },
  block: { best: 'O(n log n)', worst: 'O(n log n)' },
  blockmerge: { best: 'O(n log n)', worst: 'O(n log n)' },
  adaptivemerge: { best: 'O(n)', worst: 'O(n log n)' },
  franceschini: { best: 'O(n log n)', worst: 'O(n log n)' },
  pigeonhole: { best: 'O(n+k)', worst: 'O(n+k)' },
  gravity: { best: 'O(n)', worst: 'O(n·max)' },
  flash: { best: 'O(n)', worst: 'O(n²)' },
  americanflag: { best: 'O(nk)', worst: 'O(nk)' },
  proxmap: { best: 'O(n)', worst: 'O(n²)' },
  spreadsort: { best: 'O(n)', worst: 'O(n log n)' },
  minmaxselection: { best: 'O(n²)', worst: 'O(n²)' }
};

export default function Home({ onSelectAlgorithm }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 'sort',
      title: 'Sorting',
      description: '44 sorting algorithms visualized',
      algorithms: sortingAlgorithmList,
      algoInfo: SORTING_ALGO_INFO,
      icon: (
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9M3 12h5M3 16h9M3 20h13" />
        </svg>
      )
    },
    {
      id: 'search',
      title: 'Searching',
      description: '7 search algorithms visualized',
      algorithms: searchAlgorithmList,
      algoInfo: SEARCH_ALGO_INFO,
      icon: (
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'pathfind',
      title: 'Pathfinding',
      description: '7 pathfinding algorithms visualized',
      algorithms: pathfindingAlgorithmList,
      algoInfo: PATHFINDING_ALGO_INFO,
      icon: (
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    }
  ];

  const currentCategory = categories.find(c => c.id === selectedCategory);

  // Show algorithm submenu
  if (selectedCategory && currentCategory) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex flex-col">
        <div className="max-w-3xl mx-auto flex-1 w-full">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-8 px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            &larr; Back
          </button>

          <h1 className="text-4xl font-bold text-center mb-8">{currentCategory.title} Algorithms</h1>

          <div className="flex flex-col gap-2 w-full">
            {currentCategory.algorithms.map(algo => {
              const info = currentCategory.algoInfo[algo.value];
              return (
                <button
                  key={algo.value}
                  onClick={() => onSelectAlgorithm(selectedCategory, algo.value)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500 px-4 py-3 flex justify-between items-center transition-all duration-200"
                >
                  <span className="font-semibold text-white">{algo.label}</span>
                  <span className="text-xs text-zinc-500 flex">
                    {info?.best && <span className="w-28 text-right">Best: {info.best}</span>}
                    {info?.worst && <span className="w-32 text-right">Worst: {info.worst}</span>}
                  </span>
                </button>
              );
            })}
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

  // Show category selection
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col">
      <div className="max-w-4xl mx-auto text-center flex-1 flex flex-col justify-center">
        <h1 className="text-5xl font-bold mb-12">Algorithm Visualizer</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500 p-8 flex flex-col items-center transition-all duration-200"
            >
              {cat.icon}
              <span className="text-2xl font-semibold text-white mb-2">{cat.title}</span>
              <span className="text-sm text-zinc-500">{cat.description}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="text-center py-4">
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
