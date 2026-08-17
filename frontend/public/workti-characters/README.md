# Work-TI character images

Drop one `.png` file per Work-TI code directly in this folder, named exactly
after the code (uppercase):

```
SEMG.png  SEMA.png  SEDG.png  SEDA.png
SYMG.png  SYMA.png  SYDG.png  SYDA.png
LEMG.png  LEMA.png  LEDG.png  LEDA.png
LYMG.png  LYMA.png  LYDG.png  LYDA.png
```

No code changes are needed — `WorkTICharacterImage`
(`src/components/workti/WorkTICharacterImage.tsx`) requests
`/workti-characters/{CODE}.png` for every result. Until a file exists (or if
it fails to load), that type's `characterIcon` emoji is shown in its place
inside the same frame.
