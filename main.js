/* =============================================
   MOBILE NAV
   ============================================= */
const hamburger = document.querySelector('.hamburger');
const navDrawer = document.querySelector('.nav-drawer');

if (hamburger && navDrawer) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navDrawer.classList.toggle('open');
        document.body.style.overflow = navDrawer.classList.contains('open') ? 'hidden' : '';
    });

    navDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navDrawer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* =============================================
   PREMIUM GLOW ENGINE (hero page only)
   ============================================= */
const glowLayers = document.querySelectorAll('.glow-layer');
const heroImg = document.querySelector('.hero-image img');

if (glowLayers.length && heroImg) {
    // Detect touch / mobile
    const isMobile = window.matchMedia('(max-width: 900px)').matches;

    let mouse = {
        x: window.innerWidth * (isMobile ? 0.8 : 0.311),
        y: window.innerHeight * 0.39
    };
    let current = { ...mouse };
    let tick = 0;

    // Mouse tracking
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Touch tracking
    window.addEventListener('touchmove', e => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }, { passive: true });

    // Glow configs: [lag, pulse freq, opacity base, scale base]
    const configs = [
        { lag: 0.038, pulseFreq: 1.0, opacityBase: 0.78, scaleBase: 1.0 },  // core — fastest
        { lag: 0.022, pulseFreq: 0.65, opacityBase: 0.52, scaleBase: 1.35 }, // mid
        { lag: 0.013, pulseFreq: 0.42, opacityBase: 0.35, scaleBase: 1.7 },  // outer
        { lag: 0.048, pulseFreq: 1.4, opacityBase: 0.62, scaleBase: 0.75 }  // accent
    ];

    // Each layer has its own interpolated position
    const positions = configs.map(() => ({ ...mouse }));

    function animate() {
        tick += 0.009;

        glowLayers.forEach((glow, i) => {
            const cfg = configs[i] || configs[0];

            // Independent lag per layer
            positions[i].x += (mouse.x - positions[i].x) * cfg.lag;
            positions[i].y += (mouse.y - positions[i].y) * cfg.lag;

            // Organic breathing — different phase per layer
            const phase = tick + i * 1.1;
            const breathe = 1 + Math.sin(phase * cfg.pulseFreq) * 0.09;
            const shimmer = 1 + Math.sin(phase * cfg.pulseFreq * 2.3) * 0.05;
            const scale = cfg.scaleBase * breathe * shimmer;

            // Soft twirl — very subtle rotation
            const rotate = Math.sin(phase * 0.38) * 12;

            // Opacity flicker: layered sines for organic feel
            const flicker = cfg.opacityBase
                + Math.sin(phase * cfg.pulseFreq) * 0.08
                + Math.sin(phase * cfg.pulseFreq * 3.1) * 0.04;

            const cx = positions[i].x;
            const cy = positions[i].y;

            glow.style.left = cx + 'px';
            glow.style.top = cy + 'px';
            glow.style.transform = `translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`;
            glow.style.opacity = Math.max(0.06, Math.min(1, flicker));
        });

        // Subtle parallax on panther (disabled on mobile/reduced-motion)
        if (!isMobile && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const px = (mouse.x - window.innerWidth / 2) * 0.010;
            const py = (mouse.y - window.innerHeight / 2) * 0.010;
            heroImg.style.transform = `translate(${px}px, ${py}px) scale(1.025)`;
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        const m = window.matchMedia('(max-width: 900px)').matches;
        mouse.x = window.innerWidth * (m ? 0.5 : 0.72);
        mouse.y = window.innerHeight * 0.5;
    });
}

/* =============================================
   AMBIENT STATIC GLOW (inner pages)
   ============================================= */
const pageGlow = document.querySelector('.page-glow');
if (pageGlow && !glowLayers.length) {
    let t = 0;
    function breatheGlow() {
        t += 0.008;
        const s = 1 + Math.sin(t) * 0.06;
        const o = 0.8 + Math.sin(t * 1.3) * 0.12;
        pageGlow.style.transform = `scale(${s})`;
        pageGlow.style.opacity = o;
        requestAnimationFrame(breatheGlow);
    }
    breatheGlow();
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
(function markActive() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a, .nav-drawer a').forEach(a => {
        const href = a.getAttribute('href') || '';
        const page = href.split('/').pop();
        if (page === path || (path === 'index.html' && (href === '#' || href === 'index.html'))) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
})();

/* =============================================
   GITHUB PROJECTS LOADER
   ============================================= */
const projectsGrid = document.getElementById('projects-grid');
if (projectsGrid) {
    const fallbackHTML = projectsGrid.innerHTML;
    fetchGithubProjects(projectsGrid, fallbackHTML);
}

async function fetchGithubProjects(grid, fallbackHTML) {
    // Show skeleton loaders first
    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="card skeleton">
            <div class="card-thumb">
                <div class="card-thumb-placeholder">
                    <div class="skeleton-icon skeleton-shimmer"></div>
                </div>
            </div>
            <div class="card-body">
                <div class="skeleton-tag skeleton-shimmer"></div>
                <div class="skeleton-title skeleton-shimmer"></div>
                <div class="skeleton-desc-line skeleton-shimmer"></div>
                <div class="skeleton-desc-line skeleton-shimmer"></div>
                <div class="skeleton-desc-line short skeleton-shimmer"></div>
            </div>
            <div class="card-footer">
                <div class="skeleton-date skeleton-shimmer"></div>
                <div class="skeleton-link skeleton-shimmer"></div>
            </div>
        </div>
    `).join('');

    try {
        const response = await fetch('https://api.github.com/users/arjundevloper/repos?sort=updated&per_page=100');
        if (!response.ok) {
            throw new Error(`GitHub API returned status ${response.status}`);
        }

        let repos = await response.json();

        // Filter out forks, the user's config repo, and the blogs repo
        repos = repos.filter(repo => !repo.fork && repo.name !== 'arjundevloper' && repo.name !== 'blogs');

        // Sort by stargazers_count desc, then updated_at desc
        repos.sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        if (repos.length === 0) {
            grid.innerHTML = `<div class="error-msg">No public projects found on GitHub.</div>`;
            return;
        }

        grid.innerHTML = ''; // Clear skeletons

        const gradients = [
            'linear-gradient(135deg, #0c0820 0%, #1a0d35 50%, #0a1525 100%)',
            'linear-gradient(135deg, #0a1020 0%, #0d1830 50%, #0a0e20 100%)',
            'linear-gradient(135deg, #100820 0%, #1a1030 50%, #081520 100%)',
            'linear-gradient(135deg, #0a0d20 0%, #0f1a2a 50%, #120820 100%)',
            'linear-gradient(135deg, #0e0c20 0%, #1a0e28 50%, #0a1020 100%)',
            'linear-gradient(135deg, #080f20 0%, #0a1a28 50%, #140a20 100%)'
        ];

        const getIconClass = (lang) => {
            if (!lang) return 'fa-solid fa-code';
            const l = lang.toLowerCase();
            if (l.includes('javascript') || l.includes('js')) return 'fa-brands fa-js';
            if (l.includes('typescript') || l.includes('ts')) return 'fa-brands fa-js';
            if (l.includes('python')) return 'fa-brands fa-python';
            if (l.includes('html')) return 'fa-brands fa-html5';
            if (l.includes('css')) return 'fa-brands fa-css3-alt';
            if (l.includes('rust')) return 'fa-brands fa-rust';
            if (l.includes('java')) return 'fa-brands fa-java';
            return 'fa-solid fa-code';
        };

        const getIconColor = (lang) => {
            if (!lang) return 'rgba(123, 111, 255, .3)';
            const l = lang.toLowerCase();
            if (l.includes('javascript') || l.includes('js')) return 'rgba(247, 223, 30, .3)';
            if (l.includes('typescript') || l.includes('ts')) return 'rgba(49, 120, 198, .3)';
            if (l.includes('python')) return 'rgba(55, 115, 166, .3)';
            if (l.includes('html')) return 'rgba(227, 76, 38, .3)';
            if (l.includes('css')) return 'rgba(38, 77, 228, .3)';
            if (l.includes('rust')) return 'rgba(222, 165, 132, .3)';
            if (l.includes('java')) return 'rgba(248, 152, 29, .3)';
            return 'rgba(123, 111, 255, .3)';
        };

        repos.forEach((repo, index) => {
            const grad = gradients[index % gradients.length];
            const icon = getIconClass(repo.language);
            const iconColor = getIconColor(repo.language);
            const year = new Date(repo.created_at).getFullYear();
            const desc = repo.description || 'No description provided. Click below to explore the repository on GitHub.';
            const langTag = repo.language ? repo.language : 'Repository';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-thumb">
                    <img class="repo-img" src="https://raw.githubusercontent.com/arjundevloper/${repo.name}/${repo.default_branch}/project.png" alt="${repo.name}" style="display: none;" onload="this.style.display='block';" onerror="this.style.display='none';">
                    <div class="card-thumb-placeholder" style="background: ${grad};">
                        <i class="${icon}" style="font-size:2.5rem;color:${iconColor}"></i>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-tag">${langTag}</div>
                    <div class="card-title">${repo.name}</div>
                    <div class="card-desc">${desc}</div>
                </div>
                <div class="card-footer">
                    <span class="card-date">${year}</span>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="card-link">GitHub →</a>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    window.open(repo.html_url, '_blank');
                }
            });

            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        grid.innerHTML = fallbackHTML;
    }
}

/* =============================================
   GITHUB BLOG LOADER
   ============================================= */
const BLOG_REPO = 'arjundevloper/blogs';
const BLOG_RAW = `https://raw.githubusercontent.com/${BLOG_REPO}/main`;
const BLOG_INDEX = `${BLOG_RAW}/index.json`;

const featuredContainer = document.getElementById('featured-post-container');
const blogList = document.getElementById('blog-list');

if (featuredContainer && blogList) {
    fetchGithubBlogs();
}

async function fetchGithubBlogs() {
    try {
        const res = await fetch(BLOG_INDEX);
        if (!res.ok) throw new Error(`index.json fetch failed: ${res.status}`);
        const posts = await res.json(); // Array of post objects

        // Separate featured from the rest
        const featured = posts.find(p => p.featured) || posts[0];
        const rest = posts.filter(p => p !== featured);

        // ── Featured card ──────────────────────────────────
        if (featured) {
            const iconMap = {
                dev: 'fa-solid fa-pen-nib',
                design: 'fa-solid fa-wand-magic-sparkles',
                gaming: 'fa-solid fa-gamepad',
                motion: 'fa-solid fa-film',
                process: 'fa-solid fa-compass-drafting',
                default: 'fa-solid fa-pen-nib'
            };
            const iconClass = iconMap[(featured.category || '').toLowerCase()] || iconMap.default;

            featuredContainer.innerHTML = `
                <a class="featured-post" href="post.html?slug=${encodeURIComponent(featured.slug)}">
                    <div class="featured-thumb" style="background-image: url('https://raw.githubusercontent.com/arjundevloper/blogs/main/${featured.slug}/blog.png');"></div>
                    <div class="featured-body">
                        <div class="featured-label">Featured · ${featured.category || 'Post'}</div>
                        <div class="featured-title">${featured.title}</div>
                        <div class="featured-excerpt">${featured.excerpt || ''}</div>
                        <div class="featured-meta">
                            <span>${featured.date || ''}</span>
                            <span class="dot">·</span>
                            <span>${featured.readTime || ''} read</span>
                        </div>
                    </div>
                </a>`;
        } else {
            featuredContainer.innerHTML = '';
        }

        // ── All Posts list ─────────────────────────────────
        if (rest.length === 0) {
            blogList.innerHTML = `<div class="error-msg">No posts yet — check back soon.</div>`;
            return;
        }

        blogList.innerHTML = rest.map(post => `
            <a class="blog-item" href="post.html?slug=${encodeURIComponent(post.slug)}">
                <div>
                    <div class="blog-item-cat">${post.category || ''}</div>
                    <div class="blog-item-title">${post.title}</div>
                    <div class="blog-item-desc">${post.excerpt || ''}</div>
                </div>
                <div class="blog-item-meta">
                    <div class="blog-item-date">${post.date || ''}</div>
                    <div class="blog-item-read">${post.readTime || ''}</div>
                </div>
            </a>`).join('');

    } catch (err) {
        console.error('Blog loader error:', err);
        // Show a friendly error in both zones
        featuredContainer.innerHTML = `<div class="error-msg">Couldn't load featured post — check back soon.</div>`;
        blogList.innerHTML = `<div class="error-msg">Couldn't load posts from GitHub. Make sure <code>${BLOG_REPO}</code> is public and <code>index.json</code> exists.</div>`;
    }
}

// Scroll progress bar (smooth animation using requestAnimationFrame)
const progressBar = document.querySelector('.scroll-progress .progress');
let targetProgress = 0; // Desired progress based on scroll
let currentProgress = 0; // Smoothed progress displayed

// Update target progress on scroll – calculations only
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    targetProgress = (scrollTop / scrollHeight) * 100;
});

// Animation loop: lerp toward target for fluid motion
function animateProgress() {
    // Ease factor 0.08 – adjust for smoothness
    currentProgress += (targetProgress - currentProgress) * 0.08;
    // Snap when close to avoid endless tiny diff
    if (Math.abs(targetProgress - currentProgress) < 0.1) currentProgress = targetProgress;
    if (progressBar) progressBar.style.width = `${currentProgress.toFixed(2)}%`;
    requestAnimationFrame(animateProgress);
}
animateProgress();
