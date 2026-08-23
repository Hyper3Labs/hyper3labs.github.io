/**
 * Copy co-located blog post assets from `content/blog/<slug>/*` into
 * `public/blog/<slug>/*` so they are served as static files.
 *
 * This is the same pattern Astro / Gatsby / Jekyll / Hugo use: authors keep
 * images next to the markdown, and the build step publishes them to a static
 * route. Next.js's App Router has no built-in co-located asset pipeline for
 * plain markdown, so we do the copy here. The markdown loader rewrites any
 * `./assets/foo.png` references to `/blog/<slug>/assets/foo.png` at parse
 * time so the same source works in dev, build, RSS, and OG scrapers.
 */
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content', 'blog');
const outputDir = path.join(rootDir, 'public', 'blog');
const postIndexFileName = 'index.md';

function isIgnoredEntry(name) {
  return name.startsWith('.') || name.startsWith('_') || name === 'README.md';
}

function isIgnoredPostChild(name) {
  return name === postIndexFileName || name.startsWith('.') || name === 'work';
}

function copyRecursive(sourcePath, destinationPath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    fs.mkdirSync(destinationPath, { recursive: true });

    for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
      copyRecursive(
        path.join(sourcePath, entry.name),
        path.join(destinationPath, entry.name),
      );
    }

    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

function syncBlogAssets() {
  fs.rmSync(outputDir, { recursive: true, force: true });

  if (!fs.existsSync(contentDir)) {
    return;
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || isIgnoredEntry(entry.name)) {
      continue;
    }

    const postDir = path.join(contentDir, entry.name);
    const indexPath = path.join(postDir, postIndexFileName);

    if (!fs.existsSync(indexPath)) {
      continue;
    }

    for (const child of fs.readdirSync(postDir, { withFileTypes: true })) {
      if (isIgnoredPostChild(child.name)) {
        continue;
      }

      copyRecursive(
        path.join(postDir, child.name),
        path.join(outputDir, entry.name, child.name),
      );
    }
  }
}

syncBlogAssets();
console.log('Synced blog assets into public/blog');