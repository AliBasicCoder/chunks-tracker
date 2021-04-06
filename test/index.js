const arrFn = [() => import("./my-file.js")];

function call() {
  arrFn.forEach((fn) => fn().then(console.log));
}

call();
