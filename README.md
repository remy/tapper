# tapper

Generates a TAP file from a configuration.

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
