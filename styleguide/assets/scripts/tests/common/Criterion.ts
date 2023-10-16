export interface Criterion {
  // Run criterion test
  runTest(): void;

  // set the highlight string to use in selector
  setHighLightSelector(criteriaNumber: string ,querySelector: string): void;

  // Log results of criterion test
  logResults(title: string, log: any): void;
}
