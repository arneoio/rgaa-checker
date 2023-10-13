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
