import * as path from 'https://deno.land/std/path/mod.ts';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import Watcher from './watch.js';
import config from './config.js';
import build from './build.js';
let configName = 'tapper.yml';

const args = parse(Deno.args, { alias: { c: 'config', w: 'watch' } });
const cwd = Deno.args[0];

if (args.config) {
  configName = args.config;
} else {
  configName = path.join(cwd, configName);
}

let c = await config(path.join(cwd, configName));

if (args.watch) {
  const filenames = c.source
    .map((_) => Object.keys(_)[0])
    .map((_) => path.join(cwd, _));

  const watch = new Watcher(cwd, [...filenames, configName]);

  console.log('watching ' + filenames.join(', '));

  watch.on('watch', async (e) => {
    if (e.paths.find((_) => _.endsWith('/' + configName))) {
      c = await config(path.join(cwd, configName));
    }

    await build({ config: c, cwd });

    console.log('rebuilt ' + c.filename);
  });
} else {
  await build({ config: c, cwd });
  console.log(`generated ${c.filename}`);
}
