// One-time migration: seeds the Blob-backed inventory store with the pieces
// that were previously hardcoded directly in the public Flutes/Jewelry/
// Instruments components. Run once with `node scripts/seed-inventory.mjs`
// (requires BLOB_READ_WRITE_TOKEN in the environment). Safe to re-run — it
// overwrites the same blob pathname (no duplicates), but will stomp any real
// inventory edits made in Studio since this was first run, so treat it as a
// bootstrap-only tool.

import { put, list, del } from "@vercel/blob";

const now = new Date().toISOString();

function img(url, alt) {
  return { url, alt };
}

/** @type {import("../src/lib/inventory").InventoryItem[]} */
const items = [
  // ─── Flutes ────────────────────────────────────────────────────────────
  {
    id: crypto.randomUUID(),
    category: "flute",
    name: "Woolly Mammoth Tusk Flute",
    price: 15000,
    status: "available",
    featured: true,
    shortDescription: "A material the world stopped producing when the Ice Age ended.",
    story:
      "Each instrument is carved from ancient Woolly Mammoth tusk — preserved beneath Arctic permafrost for millennia. Released one at a time. Each one is the only one that will ever exist. Shaped slowly by hand in response to the material itself — no two pieces are ever the same. What emerges is not just an instrument, but a voice from deep time.",
    materials: "Ancient Tusk · Hand-Carved · One of One",
    specifications: "Only 25 tusks remain for custom work.",
    featuredImage: img("/images/flute-1-full.png", "Antler flute on natural stand — full instrument"),
    additionalImages: [
      img("/images/flute-2-detail.png", "Crystal mouthpiece and carved wood — craftsmanship detail"),
      img("/images/flute-3-angle.png", "Antler flute — alternate angle showing finger holes"),
      img("/images/flute-4-mouthpiece.png", "Mouthpiece assembly — teal wrap and crystal inlay"),
    ],
    video: "/video/commission-web.mp4",
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },

  // ─── Jewelry ───────────────────────────────────────────────────────────
  {
    id: crypto.randomUUID(),
    category: "jewelry",
    name: "Pearl of Vision",
    price: 4600,
    status: "available",
    featured: true,
    shortDescription: "A luminous presence held close.",
    story:
      "A single pearl — luminous, still, singular. Not decorative. Worn by the one who has learned to hold clarity in a world of noise. This piece is quiet in the way that still water is quiet. It carries something.",
    materials: "Natural pearl · Handcrafted setting · One of one",
    specifications: "One piece. One owner. Made once — never again.",
    featuredImage: img("/images/jewelry/square-pendent.png", "Pearl of Vision — handcrafted pearl adornment"),
    additionalImages: [],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "jewelry",
    name: "Lavender Moonrise",
    price: 1200,
    status: "available",
    featured: false,
    shortDescription: "For those who move in the in-between.",
    story:
      "Born from the light between dusk and night — the color of something neither here nor there. The lavender holds a quality the eye recognizes before the mind does. An adornment for those who exist at the threshold.",
    materials: "Handcrafted setting · Natural stones · One of one",
    specifications: "Made once. The same arrangement of stones will not occur again.",
    featuredImage: img("/images/jewelry/lavender-pendant-1.png", "Lavender Moonrise — handcrafted adornment"),
    additionalImages: [
      img("/images/jewelry/circ-1.png", "Lavender Moonrise — handcrafted adornment"),
      img("/images/jewelry/circ-2.png", "Lavender Moonrise — alternate view"),
    ],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "jewelry",
    name: "Eye of Dragon",
    price: 1700,
    status: "available",
    featured: false,
    shortDescription: "Ancient sight. Present form.",
    story:
      "There are pieces that protect and pieces that see. This is both. A moody, powerful artifact — not a decoration but an intention made physical. For the one who moves through the unseen with awareness and without fear.",
    materials: "Handcrafted setting · Natural stones · One of one",
    specifications: "Singular. Unrepeatable. Made for one person.",
    featuredImage: img("/images/jewelry/eye-of-the-dragon-2.png", "Eye of Dragon — handcrafted adornment"),
    additionalImages: [
      img("/images/jewelry/eye-of-the-dragon-1.png", "Eye of Dragon — alternate view"),
      img("/images/jewelry/eye-of-dragon-1.png", "Eye of Dragon — detail view"),
    ],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },

  // ─── Instruments ───────────────────────────────────────────────────────
  {
    id: crypto.randomUUID(),
    category: "instrument",
    name: "Triton Violin",
    price: null,
    status: "available",
    featured: true,
    shortDescription: "Where the sea becomes song.",
    story:
      "Built from materials that carry the memory of ancient water — this violin does not simply play notes. It carries a current. For the player who wants the instrument to speak back.",
    materials: "Handcrafted · Natural materials · One of one",
    specifications: "Private acquisition. Priced on inquiry. Made once.",
    featuredImage: img("/images/instruments/triton-violin-1.png", "Triton Violin — handcrafted violin"),
    additionalImages: [],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "instrument",
    name: "Wearable Triton Cello",
    price: 3800,
    status: "available",
    featured: false,
    shortDescription: "The resonance you carry on your body.",
    story:
      "A cello that does not stand apart from you — it becomes part of you. Designed to be worn, played, and inhabited. The vibration moves through wood, then body. There is no separation between player and instrument.",
    materials: "Handcrafted · Wearable design · One of one",
    specifications: "One of one. No instrument like this exists anywhere.",
    featuredImage: img("/images/instruments/wearable-triton-cello-1.png", "Wearable Triton Cello — first view"),
    additionalImages: [
      img("/images/instruments/wearable-triton-cello-2.png", "Wearable Triton Cello — second view"),
      img("/images/instruments/wearable-triton-cello-3.png", "Wearable Triton Cello — third view"),
    ],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "instrument",
    name: "Lyre",
    price: 3200,
    status: "available",
    featured: false,
    shortDescription: "An instrument as old as the practice itself.",
    story:
      "The lyre is the oldest living music. This one was not built to imitate history — it was built to inhabit it. Strung for those who play music as ritual, not performance.",
    materials: "Handcrafted · Natural wood & string · One of one",
    specifications: "One of one. Ancient form. New voice.",
    featuredImage: img("/images/instruments/lyre-1.png", "Lyre — handcrafted lyre, first view"),
    additionalImages: [img("/images/instruments/lyre-2.png", "Lyre — handcrafted lyre, second view")],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "instrument",
    name: "Triton Harp",
    price: 3200,
    status: "available",
    featured: false,
    shortDescription: "Sound that rises from the deep.",
    story:
      "Harp strings carry frequencies the body feels before the mind processes them. This instrument was shaped to speak to that part of you. A meaningful object as much as a musical one — owned by those who treat sound as a transformative practice.",
    materials: "Handcrafted · Natural materials · One of one",
    specifications: "One of one. Handcrafted. Will not be made again.",
    featuredImage: img("/images/instruments/triton-harp-1.png", "Triton Harp — handcrafted harp, first view"),
    additionalImages: [img("/images/instruments/triton-harp-2.png", "Triton Harp — handcrafted harp, second view")],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "instrument",
    name: "Guitar",
    price: 2400,
    status: "available",
    featured: false,
    shortDescription: "Every line carved with intention.",
    story:
      "Not a production instrument. Not a replica. A guitar that exists because someone gave it time — the kind of time that cannot be purchased from a factory. Each curve is a decision. Each fret a conversation between maker and material.",
    materials: "Handcrafted · Natural tonewoods · One of one",
    specifications: "Made once. Every detail a decision. No two the same.",
    featuredImage: img("/images/instruments/guitar-1.png", "Guitar — handcrafted guitar, first view"),
    additionalImages: [
      img("/images/instruments/guitar-2.png", "Guitar — handcrafted guitar, second view"),
      img("/images/instruments/guitar-3.png", "Guitar — handcrafted guitar, third view"),
    ],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
  {
    id: crypto.randomUUID(),
    category: "instrument",
    name: "Shellivarious",
    price: 5400,
    status: "available",
    featured: false,
    shortDescription: "An instrument without precedent.",
    story:
      "There is no category for this instrument because none existed before it was built. The Shellivarious is a singular creation — a convergence of shell, string, and resonance that produces a sound you will not find anywhere else on earth. Available with or without the monochord extension. $4,500 without monochord.",
    materials: "Handcrafted · Shell & natural materials · One of one",
    specifications: "No category. No precedent. One of one.",
    featuredImage: img("/images/instruments/shellivarious-1.png", "Shellivarious — handcrafted instrument"),
    additionalImages: [],
    video: null,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  },
];

// Matches src/lib/inventoryStore.ts's versioned-write scheme — see that
// file's header comment for why this can't be a single overwritten URL.
const PREFIX = "data/inventory/";

const blob = await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(items, null, 2), {
  access: "public",
  contentType: "application/json",
  cacheControlMaxAge: 60,
});

const { blobs } = await list({ prefix: PREFIX, limit: 50 });
const stale = [...blobs]
  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  .slice(2);
if (stale.length > 0) await del(stale.map((b) => b.url));

console.log("Seeded", items.length, "inventory items.");
console.log("Blob URL:", blob.url);
console.log("Pruned", stale.length, "old version(s).");
