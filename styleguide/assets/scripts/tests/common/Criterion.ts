export interface Criterion {
  // Run criterion test
  runTest(): void;

  // get the highlight selector to use in querySelector
  getHighlightSelector(): string;

  // get the highlight selector to use in querySelector
  getHighlightText(): string;

  // reset highlight
  resetHighlight(): void;

  // activate highlight
  activateHighlight(): void;

  // get the highlight label to use in selector
  getHighlightLabel($element: HTMLElement): string;

  // Log results of criterion test
  logResults(title: string, log: any): void;
}
