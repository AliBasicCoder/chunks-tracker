# chunks-tracker

a small library to track chunks the [rollup](https://rollupjs.org/guide/en/) generates

## Why?

you could this prevent rollup from creating new files for chunks and filling you build directory

## Usage

```js
import chunksTracker from "chunks-tracker";

export default {
  input: "index.js",
  output: {
    // ...
    chunkFileNames: chunksTracker({ ...yourOptions }),
    // if you to prevent rollup from creating new files for chunks and filling you build directory
    chunkFileNames: chunksTracker({
      dir: "<your-build-folder>",
      storeIn: "chunks.json",
      preventRepeat: true,
    }),
  },
};
```

## Options

all options are optional

### dir

default: undefined

the path to your build directory relative to the current working directory (cwd)

### format

default: undefined

the format for your build files

### schema

default: "[name]-[hash].js"

the schema for your chunks names for example: if your schema is the default chunksTracker will replace "[name]" with the file name and replace "[hash]" with random letters and numbers

[name]: the file name
[hash]: some random letters and numbers
[format]: the format for the file (eg. cjs) you need to pass [format](#format)

### storeIn

default: false

a path to a json file relative to the build folder

the json file will be an object where

- the keys are the path of the source files of the chunks relative to cwd
- the values are the path of the chunks relative to the build folder

for example:

if dynamically you import a file called (for example) "my-file.js" in cwd
the json file will look like this:

```json
{ "my-file.js": "my-file-2a8e18e.js" }
```

### preventRepeat

default: false

need [storeIn](#storein) to be specified

a boolean if true will prevent rollup from creating new files for the same source files

for example:

if you're in watch mode

and you dynamically import a file called "my-file.js"

in the first run `chunks-tracker` will store it's source file path and it's generated chunks path (as shown in [storeIn](#storeIn)) and return generated chunks path to rollup

if you then update it

`chunks-tracker` will read the json file and return generated chunks path to rollup so rollup will update that file
instead of creating a new one

### hashLen

default: 20

the length of the hash(s) in generated chunks
