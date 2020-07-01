# tapper

Watches the working working directory and generates a TAP file from a configuration.

## To install

Required [deno](https://deno.land/), to install:

```
deno install --allow-read --allow-write https://remy.github.io/tapper/mod.js
```

## Example configuration

Must be called `tapper.yml` and found in the directory you run `tapper` from.

```yaml
---
filename: interrupt
source:
  - interrupt.bas:
      start: 10
      type: program
      filename: interrupt
  - iv2.bin:
      type: code
      start: 32767
```

With this in the same directory as `interrupt.bas` and `iv2.bin`, when these files change (and are regenerated) then the `interrupt.tap` file is generated.
