export interface Criterion {
  // Run criterion test
  runTest(): void;

  // Log results of criterion test
  logResults(title: string, log: any): void;
}
