# Harmony API

A JSON API for querying music metadata from Harmony's aggregated provider data.

## Setup

### Environment Variables

```bash
HARMONY_API_PORT=5221       # Required: Port to run the API on
HARMONY_API_HOST=127.0.0.1  # Optional: Host to bind to (default: 127.0.0.1)
```

### Running

The API starts automatically when `HARMONY_API_PORT` is set:

```bash
# Via Fresh server (recommended)
deno task server

# Standalone
deno task api
```

---

## Endpoints

All release endpoints accept:

| Parameter | Description |
|-----------|-------------|
| `url` | Provider URL (Spotify, Deezer, iTunes, Bandcamp, Beatport, Tidal, etc.) |
| `gtin` or `barcode` | Barcode/GTIN number |
| `merge=true` | Optional: Query all providers and merge results (may fail if GTINs conflict) |

---

### `GET /api/health`

Health check endpoint.

```bash
curl http://localhost:5221/api/health
```

```json
{
  "ok": true,
  "version": "mvp-20",
  "timestamp": "2026-01-17T05:21:12.453Z"
}
```

---

### `GET /api/v1/barcode`

Quick lookup for barcode and basic release metadata.

```bash
curl "http://localhost:5221/api/v1/barcode?url=https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv"
curl "http://localhost:5221/api/v1/barcode?gtin=886445613261"
```

```json
{
  "mbid": null,
  "barcode": "886445613261",
  "title": "The Dark Side of the Moon",
  "artist": "Pink Floyd",
  "trackCount": 10,
  "mediaCount": 1,
  "source": "harmony"
}
```

---

### `GET /api/v1/match`

Candidate matching format — useful for matching workflows.

```bash
curl "http://localhost:5221/api/v1/match?url=https://open.spotify.com/album/..."
curl "http://localhost:5221/api/v1/match?gtin=886445613261"
```

```json
{
  "input_url": "https://open.spotify.com/album/...",
  "input_gtin": null,
  "candidates": [{
    "mbid": null,
    "barcode": "886445613261",
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "trackCount": 10,
    "mediaCount": 1,
    "score": 1.0,
    "evidence": ["harmony-lookup"]
  }],
  "best": {
    "mbid": null,
    "barcode": "886445613261",
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "trackCount": 10,
    "mediaCount": 1,
    "score": 1.0,
    "evidence": ["harmony-lookup"]
  },
  "providers": [
    { "service": "Spotify", "url": "https://open.spotify.com/album/..." }
  ],
  "source": "harmony"
}
```

---

### `GET /api/v1/tracks`

Detailed tracklist with ISRCs and durations.

```bash
curl "http://localhost:5221/api/v1/tracks?url=https://open.spotify.com/album/..."
curl "http://localhost:5221/api/v1/tracks?gtin=886445613261"
```

```json
{
  "mbid": null,
  "barcode": "886445613261",
  "title": "The Dark Side of the Moon",
  "artist": "Pink Floyd",
  "mediaCount": 1,
  "totalTracks": 10,
  "trackCounts": [10],
  "media": [{
    "number": 1,
    "format": "Digital Media",
    "title": null,
    "trackCount": 10,
    "tracks": [
      {
        "number": 1,
        "title": "Speak to Me",
        "length": 68000,
        "lengthFormatted": "1:08",
        "isrc": "GBN9Y1100085",
        "artists": "Pink Floyd"
      },
      {
        "number": 2,
        "title": "Breathe (In the Air)",
        "length": 169000,
        "lengthFormatted": "2:49",
        "isrc": "GBN9Y1100086",
        "artists": "Pink Floyd"
      }
    ]
  }],
  "source": "harmony"
}
```

---

### `GET /api/v1/providers`

Shows which providers were queried and their URLs or errors.

```bash
curl "http://localhost:5221/api/v1/providers?url=https://open.spotify.com/album/..."
curl "http://localhost:5221/api/v1/providers?gtin=886445613261"
```

**Single provider (default):**

```json
{
  "mbid": null,
  "barcode": "886445613261",
  "providers": [
    { "service": "Spotify", "url": "https://open.spotify.com/album/..." }
  ],
  "source": "harmony"
}
```

**With `merge=true` (cross-provider lookup):**

```json
{
  "mbid": "6987048f-faa9-404e-b6a9-ac0333bda669",
  "barcode": "723277017655",
  "providers": [
    { "service": "Deezer", "url": "https://www.deezer.com/album/480232895" },
    { "service": "MusicBrainz", "url": "https://musicbrainz.org/release/ab494448-1ad2-44fa-91a4-ba2b6d00458e" },
    { "service": "iTunes", "url": "https://music.apple.com/ae/album/1704230259" },
    { "service": "Spotify", "url": "https://open.spotify.com/album/3qKhqPPWMjqi8x8N6C2PXk" },
    { "service": "Tidal", "url": "https://tidal.com/album/312689838" },
    { "service": "Beatport", "error": "Search returned no matching results for '723277017655'" }
  ],
  "source": "harmony"
}
```

---

### `GET /api/v1/lookup`

Full release data — everything Harmony knows about the release.

```bash
curl "http://localhost:5221/api/v1/lookup?url=https://open.spotify.com/album/..."
curl "http://localhost:5221/api/v1/lookup?gtin=886445613261&merge=true"
```

```json
{
  "release": {
    "title": "Internet G",
    "artists": [
      { "name": "INFEKT", "creditedName": "INFEKT" }
    ],
    "gtin": "723277017655",
    "mbid": "6987048f-faa9-404e-b6a9-ac0333bda669",
    "releaseDate": { "year": 2023, "month": 9, "day": 29 },
    "labels": [
      { "name": "Disciple", "mbid": "a4153324-731e-47d5-a7f2-99c5b5229ede" }
    ],
    "types": ["EP"],
    "status": "Official",
    "packaging": "None",
    "media": [{
      "number": 1,
      "format": "Digital Media",
      "trackCount": 2,
      "tracks": [
        {
          "number": 1,
          "title": "Internet G",
          "length": 177103,
          "isrc": "CA5KR2379024",
          "artists": [{ "name": "INFEKT", "creditedName": "INFEKT" }]
        },
        {
          "number": 2,
          "title": "Chef's Kiss",
          "length": 172138,
          "isrc": "CA5KR2379025",
          "artists": [{ "name": "INFEKT", "creditedName": "INFEKT" }]
        }
      ]
    }],
    "mediaCount": 1,
    "totalTracks": 2,
    "trackCounts": [2],
    "externalLinks": [
      { "url": "https://www.deezer.com/album/480232895", "types": ["free streaming"] },
      { "url": "https://music.apple.com/ae/album/1704230259", "types": ["paid download", "paid streaming"] },
      { "url": "https://open.spotify.com/album/3qKhqPPWMjqi8x8N6C2PXk", "types": ["free streaming"] },
      { "url": "https://tidal.com/album/312689838", "types": ["paid streaming"] }
    ],
    "images": [{
      "url": "https://a1.mzstatic.com/us/r1000/063/Music116/v4/91/02/5d/91025d5a-c0ef-0899-0a63-8804df5cb9a2/cover.jpg",
      "thumbUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/91/02/5d/91025d5a-c0ef-0899-0a63-8804df5cb9a2/cover.jpg/250x250bb.jpg",
      "types": ["front"]
    }],
    "availableIn": ["US", "GB", "DE", "..."],
    "copyright": "℗ 2023 Disciple",
    "language": { "code": "eng" },
    "providers": [
      {
        "name": "Deezer",
        "internalName": "deezer",
        "id": "480232895",
        "url": "https://www.deezer.com/album/480232895",
        "apiUrl": "https://api.deezer.com/album/480232895"
      }
    ],
    "messages": [
      { "provider": "Bandcamp", "type": "warning", "text": "GTIN lookups are not supported" },
      { "provider": "Beatport", "type": "error", "text": "Search returned no matching results for '723277017655'" }
    ]
  },
  "providers": [
    { "service": "Deezer", "url": "https://www.deezer.com/album/480232895" },
    { "service": "MusicBrainz", "url": "https://musicbrainz.org/release/ab494448-1ad2-44fa-91a4-ba2b6d00458e" }
  ],
  "source": "harmony"
}
```

---

## Summary

| Endpoint | Use Case | Key Fields |
|----------|----------|------------|
| `/api/health` | Health check | `ok`, `version` |
| `/api/v1/barcode` | Quick barcode lookup | `barcode`, `trackCount`, `title`, `artist` |
| `/api/v1/match` | Matching workflows | `candidates`, `best`, `score` |
| `/api/v1/tracks` | Tracklist with ISRCs | `media[].tracks[]` with `isrc`, `length` |
| `/api/v1/providers` | See which providers responded | `providers[]` with `url` or `error` |
| `/api/v1/lookup` | Full release data | Complete `HarmonyRelease` object |

---

## Behavior Notes

### Single vs. Merged Lookups

| Input | Default Behavior | With `merge=true` |
|-------|------------------|-------------------|
| `url=...` | Query only that provider | Query provider → extract GTIN → query all providers |
| `gtin=...` | Query all providers that support GTIN | Same |

### Error Handling

Cross-provider merges may fail if providers return conflicting GTINs:

```json
{
  "error": "Providers have returned multiple different GTIN: 886445613261 (Spotify, MusicBrainz, Deezer), 196589805232 (iTunes)"
}
```

In this case, use single-provider lookups (omit `merge=true`).

### Supported Providers

- Spotify
- Deezer
- iTunes / Apple Music
- Bandcamp (URL lookup only, no GTIN)
- Beatport
- Tidal
- MusicBrainz
- mora (URL lookup only, no GTIN)
- OTOTOY (URL lookup only, no GTIN)
