// Shared About-page types — safe to import from both server and client code.
//
// A single curated document, not a collection — one flowing body of copy
// plus one hero image, mirroring the Materials Statement pattern.

export interface AboutImage {
  url: string;
  alt: string;
}

export interface AboutPageContent {
  copy: string;
  heroImage: AboutImage | null;
  updatedAt: string;
}

const DEFAULT_COPY = [
  "Daniel Hansen is a flute inventor and sound meditation facilitator.",
  "As a boy growing up in rural Wisconsin, Hansen’s mother played him her record collection, which captured his vibrant imagination. From his father, Hansen learned resourcefulness and problem-solving skills, fixing everything and anything around their home together. At the age of 10, he picked up the saxophone, which he played in school and later in various bands around the world. Looking for adventure, Hansen moved to Colorado after high school and began teaching himself guitar and song-writing. At 22, Hansen traveled to Kauai, where he met a flute maker who peaked his interest in exotic, handmade flutes.",
  "Starting in 2005, Hansen traveled all over the Americas and parts of Asia, absorbing local cultures and traditions, initially searching for unique flutes that were functional pieces of art. He never found what he imagined to exist, so he began creating his own instruments after a crash course in bamboo harvesting in the jungles of Kauai in 2009. Thus began the quest for collecting ancient and unusual materials ranging from bamboo, crystals, and fossils, to elk antler sheds and exotic woods. Hansen harvested these materials to create his one-of-a-kind instruments as he traveled through Mexico, Guatemala, Columbia, Ecuador, Peru, India, Bali, Hawaii, Alaska, and more.",
  "Hansen is a self-taught artist inspired by ancient traditions of flute making and new possibilities of the craft. His teachers have been the works he has studied, the cultures he has experienced, and his few brief encounters with master flute makers during his travels. Hansen’s level of curiosity, his commitment to the craftsmanship of ancient music, and his hunger to create and convey meaning through this unique medium, drive him to continue his quest of crafting beautiful tools of sonic vibration.",
  "Hansen practices an art almost wholly lost in his generation. That deep honoring is evident in every piece and performance he makes. The act of playing these sacred flutes necessitates deep awareness of breath, drawing the player into the present. Conscious breath becomes sound, a kind of potent medicine. A vibration that reconnects us to our bodies and beings. To listen to Hansen play his handmade multi-tone flutes is to bear witness to a fundamental human undertaking: a ritual so pure and so absent from our modern, plugged in life.",
  "Daniel Hansen is a sound meditation facilitator who has offered over 200 events across the U.S. and other parts of the world such as India, Bali, and Guatemala. This sound healing fusion will bathe you in sacred frequencies, hypnotic rythms, and celestial harmonies as you follow your natural impulses for movement and dance.",
  "His music offers an inspirational approach to world fusion, ranging from deep hypnotic soundscapes to cathartic high energy dance from the far reaches of the earth.",
  "His intention is to entrance and inspire with new vehicles for sound & an expansive view into the self.",
].join("\n\n");

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  copy: DEFAULT_COPY,
  heroImage: {
    url: "/images/about/daniel-hansen-elephant-hero-wide.jpg",
    alt: "Daniel Hansen playing a handmade flute as an elephant wraps its trunk around his head",
  },
  updatedAt: new Date(0).toISOString(),
};
