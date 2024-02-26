/**
Copyright 2024 - Arneo.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export interface Criterion {
  // Run criterion test
  runTest(): string;

  // get the highlight selector to use in querySelector
  getHighlightedElements(): Array<HTMLElement>;

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
