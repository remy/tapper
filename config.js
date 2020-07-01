import { load } from 'https://deno.land/x/js_yaml_port/js-yaml.js';

export default async (cwd) => {
  const config = await Deno.readTextFile(cwd).then(load);

  // TODO check structure

  let ext = '';
  if ((cwd, config.filename.split('.').pop().toLowerCase() !== 'tap')) {
    ext = '.tap';
  }

  config.filename = config.filename + ext;

  return config;
};
