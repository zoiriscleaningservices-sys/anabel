const fs = require('fs');

let html = fs.readFileSync('template.html', 'utf8');

// Replace standard texts
html = html.replace(/Cleaning Services in Bay Shore, NY/g, '{{SERVICE_NAME}} in {{LOCATION_NAME}}, NY');
html = html.replace(/House Cleaning in Bay Shore, NY/g, '{{SERVICE_NAME}} in {{LOCATION_NAME}}, NY');
html = html.replace(/Cleaning Services in Bay Shore/g, '{{SERVICE_NAME}} in {{LOCATION_NAME}}');
html = html.replace(/cleaning services in Bay Shore, NY/gi, '{{SERVICE_NAME_LOWER}} in {{LOCATION_NAME}}, NY');
html = html.replace(/cleaning services in Bay Shore NY/gi, '{{SERVICE_NAME_LOWER}} in {{LOCATION_NAME}} NY');
html = html.replace(/in Bay Shore, NY/g, 'in {{LOCATION_NAME}}, NY');
html = html.replace(/in Bay Shore NY/g, 'in {{LOCATION_NAME}} NY');
html = html.replace(/Bay Shore's #1/g, '{{LOCATION_NAME}}\'s #1');
html = html.replace(/Bay Shore, NY/g, '{{LOCATION_NAME}}, NY');
html = html.replace(/Bay Shore, New York/g, '{{LOCATION_NAME}}, New York');
html = html.replace(/Bay Shore/g, '{{LOCATION_NAME}}');
html = html.replace(/11706/g, '{{LOCATION_ZIP}}');
html = html.replace(/bay-shore/g, '{{LOCATION_SLUG}}');

// SEO Overrides for the template
html = html.replace(/House Cleaning, deep cleaning, move-in\/move-out, office &amp; post-construction cleaning/gi, '{{SERVICE_DESC}}');
html = html.replace(/Anabel Cleaning Service Corp offers a full range of cleaning services \[...\]/g, '{{SERVICE_DESC}}');

// Path Overrides
html = html.replace(/href="styles\.css"/g, 'href="{{ROOT_PATH}}styles.css"');
html = html.replace(/src="script\.js"/g, 'src="{{ROOT_PATH}}script.js"');
html = html.replace(/src="assets\//g, 'src="{{ROOT_PATH}}assets/');
html = html.replace(/url\('assets\//g, 'url(\'{{ROOT_PATH}}assets/');
html = html.replace(/href="assets\//g, 'href="{{ROOT_PATH}}assets/');

// Canonical
html = html.replace(/<link rel="canonical" href="https:\/\/anabelcleaningservices\.com\/">/g, '<link rel="canonical" href="https://anabelcleaningservices.com/{{LOCATION_SLUG}}/{{SERVICE_SLUG}}/">');
html = html.replace(/<meta property="og:url" content="https:\/\/anabelcleaningservices\.com\/">/g, '<meta property="og:url" content="https://anabelcleaningservices.com/{{LOCATION_SLUG}}/{{SERVICE_SLUG}}/">');

fs.writeFileSync('template.html', html, 'utf8');
console.log('template.html prepped with tokens.');
