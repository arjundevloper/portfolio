/* =============================================
   POST.JS — Blog post renderer
   Each post lives in its own folder:
   blogs/<slug>/index.md  (or <slug>.md / post.md)
   ============================================= */

(async function () {
    const BLOG_RAW   = 'https://raw.githubusercontent.com/arjundevloper/blogs/main';
    const BLOG_INDEX = `${BLOG_RAW}/index.json`;
    const postRoot   = document.getElementById('post-root');

    // ── 1. Read ?slug= from URL ───────────────────────────
    const params = new URLSearchParams(location.search);
    const slug   = params.get('slug');

    if (!slug) {
        renderError('No post specified.', 'Head back to the blog to pick a post.');
        return;
    }

    try {
        // ── 2. Load index.json for metadata (optional) ────────
        let meta = null;
        try {
            const idxRes = await fetch(BLOG_INDEX);
            if (idxRes.ok) {
                const posts = await idxRes.json();
                meta = posts.find(p => p.slug === slug) || null;
            }
        } catch (_) { /* metadata is optional — post still renders */ }

        // ── 3. Fetch markdown — try filenames in order ────────
        // Priority: index.md → <slug>.md → post.md → readme.md
        const candidates = [
            `${BLOG_RAW}/${slug}/index.md`,
            `${BLOG_RAW}/${slug}/${slug}.md`,
            `${BLOG_RAW}/${slug}/post.md`,
            `${BLOG_RAW}/${slug}/readme.md`,
            `${BLOG_RAW}/${slug}/README.md`,
        ];

        let markdown = null;
        for (const url of candidates) {
            const res = await fetch(url);
            if (res.ok) {
                markdown = await res.text();
                break;
            }
        }

        if (markdown === null) {
            throw new Error(`No markdown file found in folder "${slug}"`);
        }

        // ── 4. Extract frontmatter if present ─────────────────
        // Supports YAML-ish block: --- key: value --- at top of file
        let frontmatter = {};
        const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---\n/);
        if (fmMatch) {
            fmMatch[1].split('\n').forEach(line => {
                const [key, ...rest] = line.split(':');
                if (key && rest.length) {
                    frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
                }
            });
            markdown = markdown.slice(fmMatch[0].length); // strip frontmatter from body
        }

        // Merge: index.json metadata wins over frontmatter
        const postMeta = {
            title:    meta?.title    || frontmatter.title    || slug.replace(/-/g, ' '),
            category: meta?.category || frontmatter.category || 'Post',
            date:     meta?.date     || frontmatter.date     || '',
            readTime: meta?.readTime || frontmatter.readTime || '',
            featured: meta?.featured || false,
        };

        // ── 5. Update <title> ─────────────────────────────────
        document.title = `${postMeta.title} — Arjun Bhadauria`;

        // ── 6. Load marked.js from CDN then render ────────────
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js');

        marked.setOptions({ breaks: true, gfm: true });

        // Strip leading H1 if it matches the title (avoid duplication)
        let body = markdown.replace(/^\s*#\s+.+\n?/, '');

        const htmlBody = marked.parse(body);

        // ── 7. Inject rendered post ───────────────────────────
        postRoot.innerHTML = `
            <div class="post-meta-top">
                <span>${postMeta.category}</span>
                ${postMeta.featured ? '<span class="dot">·</span><span>Featured</span>' : ''}
            </div>
            <h1 class="post-title">${postMeta.title}</h1>
            <div class="post-meta-bottom">
                <span>${postMeta.date}</span>
                ${postMeta.readTime ? `<span class="dot">·</span><span>${postMeta.readTime} read</span>` : ''}
            </div>
            <article class="post-body">${htmlBody}</article>`;

    } catch (err) {
        console.error('post.js error:', err);
        renderError(
            'Post not found',
            `Couldn't load <code>${slug}</code>.<br>
             Expected a folder <code>${slug}/</code> in the
             <a href="https://github.com/arjundevloper/blogs" target="_blank" rel="noopener">blogs repo</a>
             containing <code>index.md</code> (or <code>${slug}.md</code> / <code>post.md</code>).`
        );
    }

    // ── Helpers ───────────────────────────────────────────

    function renderError(title, message) {
        postRoot.innerHTML = `
            <div class="post-error">
                <h2>${title}</h2>
                <p>${message}</p>
                <a href="blog.html" style="display:inline-block;margin-top:20px;color:var(--accent);
                   font-size:.85rem;letter-spacing:2px;text-transform:uppercase;">← Back to Blog</a>
            </div>`;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = src;
            s.onload  = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }
})();
