const fs = require('fs');
const path = require('path');
const db = require('./seoDb.js');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const DOCS_DIR = __dirname;

// We no longer recreate DOCS_DIR because it's our working directory.
// Instead we just generate files directly here.

// Copy static assets to docs - skipped because assets are already in the root!
// console.log('Copying static assets...');

// Read template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

const BASE_URL = 'https://anabelcleaningservices.com';
let sitemapUrls = [];

// Helper to generate a page
function generatePage(location, service, outputPath, relativeDepth, urlPath) {
  let depthPath = relativeDepth === 0 ? './' : '../'.repeat(relativeDepth);
  
  let content = template;
  content = content.replace(/\{\{LOCATION_NAME\}\}/g, location.name);
  content = content.replace(/\{\{LOCATION_ZIP\}\}/g, location.zip);
  content = content.replace(/\{\{LOCATION_SLUG\}\}/g, location.slug);
  content = content.replace(/\{\{SERVICE_NAME\}\}/g, service.name);
  content = content.replace(/\{\{SERVICE_NAME_LOWER\}\}/g, service.name.toLowerCase());
  content = content.replace(/\{\{SERVICE_SLUG\}\}/g, service.slug);
  content = content.replace(/\{\{SERVICE_DESC\}\}/g, service.desc);
  content = content.replace(/\{\{SERVICE_KEYWORDS\}\}/g, service.keywords || service.name);
  content = content.replace(/\{\{ROOT_PATH\}\}/g, depthPath);
  
  if (urlPath) {
    sitemapUrls.push(`${BASE_URL}${urlPath}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
}

console.log('Generating SEO Hubs and Silos...');

// Default service for hubs
const mainService = db.services.find(s => s.slug === 'house-cleaning') || db.services[0];
const mainLocation = db.locations.find(l => l.slug === 'bay-shore') || db.locations[0];

// Generate Main Root Homepage
generatePage(mainLocation, mainService, path.join(DOCS_DIR, 'index.html'), 0, '/');

for (const loc of db.locations) {
  // Generate Location Hub (docs/bay-shore/index.html)
  const hubFolder = path.join(DOCS_DIR, loc.slug);
  generatePage(loc, mainService, path.join(hubFolder, 'index.html'), 1, `/${loc.slug}/`);

  // Generate Service Silos (docs/bay-shore/deep-cleaning/index.html)
  for (const srv of db.services) {
    const siloFolder = path.join(hubFolder, srv.slug);
    generatePage(loc, srv, path.join(siloFolder, 'index.html'), 2, `/${loc.slug}/${srv.slug}/`);
  }
}

// Write the sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(DOCS_DIR, 'sitemap.xml'), sitemapContent, 'utf8');

console.log(`Successfully generated SEO pages for ${db.locations.length} locations and ${db.services.length} services.`);
console.log(`Successfully compiled sitemap.xml with ${sitemapUrls.length} targeted paths.`);
console.log(`All files are ready in the root folder for GitHub Pages deployment.`);
