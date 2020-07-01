import EventEmitter from 'https://deno.land/x/events@v1.0.0/mod.ts';
import debounce from 'https://deno.land/x/lodash/debounce.js';

class Watcher extends EventEmitter {
  constructor(files) {
    super();
    const watcher = Deno.watchFs(files);

    const emit = debounce(
      (event) => {
        this.emit('watch', event);
      },
      {},
      200
    );

    (async () => {
      for await (const event of watcher) {
        emit(event);
      }
    })();
  }
}

export default Watcher;
