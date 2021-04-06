import path from "path";
import fs from "fs";

function hash(len) {
  let text = "";
  const possible = "abcdef0123456789";

  for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const defaultOptions = {
  dir: undefined,
  format: undefined,
  storeIn: false,
  preventRepeat: false,
  schema: "[name]-[hash].js",
  hashLen: 20,
  fn: () => {},
};

export default function chunksTracker(options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const cwd = process.cwd();

  if (options.dir) {
    const dirPath = path.join(cwd, options.dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
  }

  return (chunksInfo) => {
    const result = options.schema
      .replace(/\[name\]/g, chunksInfo.name)
      .replace(/\[hash\]/g, hash(options.hashLen))
      .replace(/\[format\]/, options.format);

    if (options.storeIn) {
      const storeInPath =
        options.storeIn === true
          ? path.join(cwd, options.dir, "chunks.json")
          : options.storeIn;
      if (!fs.existsSync(storeInPath)) fs.writeFileSync(storeInPath, "{}");
      const obj = JSON.parse(fs.readFileSync(storeInPath, "utf8"));
      const rp = path.relative(cwd, chunksInfo.facadeModuleId);
      if (options.preventRepeat && obj[rp]) {
        options.fn(chunksInfo, obj[rp], true);
        return obj[rp];
      }
      obj[rp] = result;
      fs.writeFileSync(storeInPath, JSON.stringify(obj));
    }

    options.fn(chunksInfo, result, false);
    return result;
  };
}
