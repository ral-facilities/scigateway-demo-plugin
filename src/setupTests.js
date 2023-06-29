
// below required as work-around for enzyme/jest environment not implementing window.URL.createObjectURL method
function noOp() {}

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp });
}
