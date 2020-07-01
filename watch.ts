import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";
import debounce from "https://deno.land/x/lodash/debounce.js";
import * as path from "https://deno.land/std/path/mod.ts";

class Watcher extends EventEmitter {
  constructor(cwd: string, files: string[]) {
    super();
    const watcher = Deno.watchFs(files.map((_) => path.join(cwd, _)));

    const emit = debounce(
      (event: any) => {
        this.emit("watch", event);
      },
      {},
      200,
    );

    (async () => {
      for await (const event of watcher) {
        emit(event);
      }
    })();
  }
}

export default Watcher;
