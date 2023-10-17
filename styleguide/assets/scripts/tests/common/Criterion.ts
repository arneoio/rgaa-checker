export interface Criterion {
  // Run criterion test
  runTest(): void;

  // get the highlight selector to use in querySelector
  getHighlightSelector(): string;

  // get the highlight label to use in selector
  getHighlightLabel($element: HTMLElement): string;

  // Log results of criterion test
  logResults(title: string, log: any): void;
}
