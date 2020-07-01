import * as path from "https://deno.land/std/path/mod.ts";
import { Tapper, PROGRAM, CODE } from "./tapper.js";
import Watcher from "./watch.ts";
import config from "./config.js";

const configName = "tapper.yml";

const cwd = Deno.args[0];

let c = await config(path.join(cwd, configName));

const filenames = c.source.map((_) => Object.keys(_)[0]);
const watch = new Watcher(cwd, [...filenames, configName]);

console.log("watching " + filenames.join(", "));

watch.on("watch", async (e) => {
  if (e.paths.find((_) => _.endsWith("/" + configName))) {
    c = await config(path.join(cwd, configName));
  }

  const t = new Tapper();
  const files = await Promise.all(
    c.source.map((source) => {
      const name = Object.keys(source)[0];
      return Deno.readFile(path.join(cwd, name)).then((data) => {
        return {
          res: {
            data,
            file: {
              name,
            },
          },
          config: source[name],
        };
      });
    }),
  );

  files.forEach(({ res, config }) => {
    const block = t.add(res);
    const name = res.file.name;
    block.dataType = config.type.toLowerCase() === "program" ? PROGRAM : CODE;
    block.p1 = config.start;
    block.p2 = block.type === PROGRAM ? res.data.length : 0x8000;
    block.filename = config.filename || name;
  });

  const res = t.generate();

  Deno.writeFileSync(path.join(cwd, c.filename), res);
  console.log("rebuilt " + c.filename);
});
