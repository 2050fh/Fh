# Fonts

Both typefaces are self-hosted, subset to Latin + Latin-1 punctuation, and kept as
variable fonts so a single file serves every weight used on the page. No external
font CDN request is made.

| File | Family | Axes kept | Subset | Size |
|---|---|---|---|---|
| `fraunces-var.woff2` | Fraunces | `opsz` 9–144, `wght` 100–900 | U+0020–00FF + punctuation | ~61 KB |
| `instrument-sans-var.woff2` | Instrument Sans | `wght` 400–700 | U+0020–00FF + punctuation | ~27 KB |

Build notes:

- Sources: `@fontsource-variable/fraunces`, `@fontsource-variable/instrument-sans` (Google Fonts releases).
- Fraunces was pinned to `SOFT=0`, `WONK=1` to remove two axes from the file and keep
  the crisper display cut; `Instrument Sans` was pinned to `wdth=100`.
- Subset with `pyftsubset --flavor=woff2 --layout-features=kern,liga,calt,ccmp,mark,mkmk,frac,onum,lnum,tnum,case`.

Both families are licensed under the SIL Open Font License 1.1 — see
`OFL-Fraunces.txt` and `OFL-InstrumentSans.txt`.
