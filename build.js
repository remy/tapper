import * as path from 'https://deno.land/std/path/mod.ts';
import { Tapper, PROGRAM, CODE } from './tapper.js';

export default async function ({ config, cwd }) {
  const t = new Tapper();
  const files = await Promise.all(
    config.source.map((source) => {
      const name = Object.keys(source)[0];
      return Deno.readFile(path.join(cwd, name)).then((data) => ({
        res: { data, file: { name } },
        config: source[name],
      }));
    })
  );

  files.forEach(({ res, config }) => {
    const block = t.add(res);
    const name = res.file.name;
    block.dataType = config.type.toLowerCase() === 'program' ? PROGRAM : CODE;
    block.p1 = config.start;
    block.p2 = res.data.length;
    block.filename = config.filename || name;
  });

  const res = t.generate();

  Deno.writeFileSync(path.join(cwd, config.filename), res);
}
