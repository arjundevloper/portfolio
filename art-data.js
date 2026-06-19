/* Dynamically load all art files from assets/art */
let ART_PIECES = [];

const defaultFiles = [
    'digital_cat.png',
    'doodle_chii.jpg',
    'doodle_dihpression.jpg',
    'doodle_meow.jpg',
    'doodle_skeli.jpg',
    'drawing_Zenitsu.jpg',
    'drawing_chainshaw.jpg',
    'drawing_chainshawman.jpg',
    'drawing_dino.jpg',
    'drawing_ganesh.png'
];

async function loadArtPieces() {
    try {
        // Fetch the directory listing; assumes the server provides an index page.
        const response = await fetch('assets/art/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .map(a => a.getAttribute('href'))
            .filter(h => h && (h.endsWith('.png') || h.endsWith('.jpg') || h.endsWith('.jpeg') || h.endsWith('.webp')));
        
        // Extract filenames from links
        const filenames = links.map(href => {
            const decodeHref = decodeURIComponent(href);
            const parts = decodeHref.split('/');
            return parts[parts.length - 1];
        }).filter(name => name.includes('_'));
        
        const finalLinks = filenames.length ? filenames : defaultFiles;
        ART_PIECES = finalLinks.map(filename => ({ filename, title: '' }));
    } catch (e) {
        console.warn('Failed to dynamically fetch art directory listing, using local fallback:', e);
        ART_PIECES = defaultFiles.map(filename => ({ filename, title: '' }));
    }
}

// Immediately start loading; other scripts can await this promise if needed.
const ART_PIECES_READY = loadArtPieces();
