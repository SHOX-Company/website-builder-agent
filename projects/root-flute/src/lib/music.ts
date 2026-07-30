export interface MusicCopy {
  tagline: string;
  intro: string;
  stats: string;
  albumTitle: string;
  bio: string[];
  spotifyLink: { label: string; url: string };
  sections: { title: string }[];
  videoCaptions: { videoId: string; caption: string }[];
}
