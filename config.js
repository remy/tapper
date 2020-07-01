import { load } from "https://deno.land/x/js_yaml_port/js-yaml.js";

export default (cwd) => {
  return Deno.readTextFile(cwd).then(load);
};
