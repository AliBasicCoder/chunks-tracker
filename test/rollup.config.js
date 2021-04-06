import chunksTracker from "../index";

export default {
  input: "index.js",
  output: {
    format: "cjs",
    dir: "build",
    chunkFileNames: chunksTracker({
      dir: "build",
      storeIn: true,
      preventRepeat: true,
      fn: (...args) => console.log(args),
    }),
  },
};
