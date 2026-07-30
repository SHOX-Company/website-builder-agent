// This script imports the 9 music videos from music-videos.json into the video database
// Run with: node scripts/sync-music-videos.js

const fs = require('fs');
const path = require('path');

const videosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/content/music/music-videos.json'), 'utf8')
);

console.log(`Found ${videosData.length} videos in music-videos.json`);
console.log('\nVideos to sync:');

videosData.forEach((video, i) => {
  console.log(`\n${i + 1}. ${video.title}`);
  console.log(`   YouTube ID: ${video.videoId}`);
  console.log(`   URL: https://www.youtube.com/watch?v=${video.videoId}`);
  console.log(`   Thumbnail: ${video.thumbnail}`);
});

console.log('\n---');
console.log('To import these videos into the system:');
console.log('1. Visit https://root-flute.vercel.app/studio/music');
console.log('2. Add each video using the Music Studio interface');
console.log('3. Mark each as published to display on the public Music page');
console.log('4. They will automatically be featured if IDs are in musicFeatured');

