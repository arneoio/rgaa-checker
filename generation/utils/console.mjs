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

// Overrides the default console functions to add colors

console.error = function (text) {
  console.log('\x1b[31mERROR - ', text, '\x1b[0m');
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  if (args.length > 0) {
    [...args].forEach((arg) => {
      console.log(arg);
    });
  }
};

console.warn = function (text) {
  console.log('\x1b[36m', text, '\x1b[0m');
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  if (args.length > 0) {
    [...args].forEach((arg) => {
      console.log(arg);
    });
  }
};

export default console;
