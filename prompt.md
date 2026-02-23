I need you to create a complete Astro static site for my professional portfolio. This should be production-ready with all files included, optimized for GitHub Pages deployment with GitHub Actions.

AESTHETIC & DESIGN PHILOSOPHY:
"California Executive" - Premium sophistication meets human warmth. Think high-end architectural photography of California homes: warm light, natural materials, precise execution. References: Kinfolk magazine, Monocle editorial layouts, Case Study House photography.

Here are some basics, but there's an extended section on aesthetics below.

COLOR PALETTE:
- Background: Deep charcoal with warm undertone #2B2826
- Text primary: Warm cream #F5F1E8
- Text secondary: #C9C0B3
- Accent: Deep amber #D4822B (hover: #E69138)
- Dividers: Terracotta #BD6B4A at 20% opacity

TYPOGRAPHY:
- Headings: Use Noto Serif Display, but you can use system serif stack (Georgia, Times, serif) as fallback
- Body: Use Google's Hind, but you can use system sans stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif) as a fallback. 
- H1: 52px, line-height 1.1, letter-spacing 0.01em
- H2: 36px, line-height 1.2
- H3: 26px, line-height 1.3
- Body: 19px, line-height 1.65
- Max content width: 760px

INTERACTIONS (CSS/JS only, no frameworks):
- Fixed nav on scroll with blur background
- Smooth scroll enabled
- Link underlines animate from left (200ms ease)
- Hover states: subtle color shifts, no shadows/elevation
- Section fade-in on scroll (Intersection Observer)
- Contact form modal with subtle "edit" button for canned message

SITE STRUCTURE:
1. Homepage (index.astro):
   - Hero section (full viewport, will add custom gradient image later)
   - Opening statement (strategist/builder/researcher intro)
   - Three transformation showcases (scroll down, with dividers)
   - Each showcase: title, 2-3 sentences, "Read more →" link

2. Three transformation story pages:
   - /quantum-gaming
   - /ml-education  
   - /docs-as-code
   - Each follows same template: title, The Problem, The Insight, What We Built, How It Propagated, What It Demonstrates

3. CV page (/cv):
   - Experience (reverse chronological)
   - Publications
   - Awards & Recognition

4. Footer with contact form modal (not separate page)

GITHUB ACTIONS:
Include complete .github/workflows/deploy.yml that:
- Triggers on push to main
- Installs dependencies
- Runs Astro build
- Deploys to GitHub Pages
- Uses Node 20.x

CONTENT STRUCTURE:
Use Markdown frontmatter for easy content editing. I'll provide the actual copy separately - just use placeholder content that shows the structure clearly.

LAYOUT ARCHITECTURE (Apple-inspired horizontal rhythm):

HOMEPAGE SHOWCASES:
- Showcase 1: Content left-aligned, 70% width, 30% breathing room right
- Showcase 2: Content right-aligned, 70% width, 30% breathing room left  
- Showcase 3: Content centered, 80% width
- Use CSS Grid for these layouts
- Mobile: All stack to single column, full width

TRANSFORMATION STORY PAGES:
- Alternate section alignment: Problem (left), Insight (right), Built (center/wide)
- Each section max 60% width when aligned left/right
- Empty space is intentional - don't fill it
- Mobile: All sections full width, stacked

CV PAGE:
- Job titles and dates on opposite ends (flexbox: space-between)
- Descriptions max 70% width, left-aligned
- Dates right-aligned, lighter weight
- Section headers (Experience, Publications, Awards) full width with divider below

GENERAL PRINCIPLES:
- Not everything should be 760px centered
- Use empty horizontal space as a design element
- Content should "breathe" left and right, not just vertically
- Asymmetry creates visual interest without decoration
- Mobile: Simplify to single column (don't try to preserve horizontal layouts)

DELIVERABLES:
Provide complete, copy-paste ready files for:
1. package.json with Astro dependencies
2. astro.config.mjs (configured for GitHub Pages)
3. /src/layouts/Base.astro (shared layout with nav, footer, meta tags)
4. /src/pages/index.astro (homepage)
5. /src/pages/quantum-gaming.astro (transformation story template)
6. /src/pages/ml-education.astro
7. /src/pages/docs-as-code.astro
8. /src/pages/cv.astro
9. /src/styles/global.css (all styles, organized by section)
10. /src/scripts/main.js (scroll animations, contact form modal, smooth scroll)
11. .github/workflows/deploy.yml
12. README.md with setup instructions

TECHNICAL REQUIREMENTS:
- Zero JavaScript shipped except for necessary interactivity (scroll animations, modal, smooth scroll)
- Semantic HTML5
- Accessible (proper ARIA labels, focus states)
- Mobile responsive (single column on mobile, ~760px max width on desktop)
- Fast loading (minimal dependencies)
- Works with JavaScript disabled (graceful degradation for modal and animations)

CONTACT FORM MODAL:
- Triggered by "Contact" link in footer
- Overlay with blur backdrop
- Fields: email input, editable message textarea (pre-filled with: "Hey Ricardo, I read your profile, and I'd like to chat. Please reach out to me.")
- Subtle "edit" pencil icon on message (opacity 0.35, becomes 1.0 on hover with amber glow)
- Submit button (can just log to console for now - I'll wire up actual form handling later)
- ESC key and click-outside to close

Generate all files with clear comments explaining structure. Use placeholder content that demonstrates the intended layout and hierarchy.


EXTENDED AESTHETIC GUIDANCE:

Layout & Spacing (Refined)
Max width: 760px for text

Slightly wider than my initial suggestion
Accommodates the more generous line-height

Vertical rhythm:

Sections: 140px spacing
Paragraphs: 32px spacing
Very generous—feels unhurried, confident

Transformation showcases:

Not cards with shadows (too corporate)
Clean sections with subtle terracotta divider lines
Each section: title, 2-3 sentences, "Read more →"
Divider: 1px, #BD6B4A at 20% opacity, 80% width centered


Interactions (Refined)
Navigation (on scroll):

Background: charcoal with 80% opacity + 20px blur
Very subtle—you barely notice it engage
Links: Warm cream, underline grows from left on hover (accent color, 2px thick)

Showcase sections:

On hover: entire section background lightens very slightly (#33302E)
"Read more →" arrow: slides 4px right
No shadows, no elevation—just subtle color shift
Transition: 300ms ease-out

Contact form "edit" button:

Default: opacity: 0.35, cream color, 14px, light weight
Hover: opacity: 1, shifts to amber accent, slight glow (box-shadow: 0 0 12px rgba(212, 130, 43, 0.3))
Transition: 250ms ease
Cursor: pointer
Icon: small pencil or "edit" text in parentheses

Links in body text:

Underline: 1px amber, 40% opacity
Hover: 100% opacity, slightly thicker (1.5px)
No color change on text itself

Scroll behavior:

Smooth scroll enabled
Section headers: very subtle fade-in + slight upward motion (20px) as they enter viewport
Threshold: 80% visible before triggering
Animation: 600ms ease-out (slower = more premium)


Page-Specific Refinements
Homepage:

Hero (as described above)
Opening statement: centered, max 600px width
Three showcases: stacked vertically, terracotta dividers between

Transformation story pages:

No hero image (let homepage do that work)
Title at top with generous top padding (80px)
Clean text sections with H2 headers
Pull quotes or key stats could use larger type in amber color (sparingly)

CV page:

Same aesthetic
Section headers (Experience, Publications, Awards): H2 size, amber color
Dates: secondary text color, tabular figures (monospace numbers for alignment)
Links: same underline treatment
Very clean, scannable


Special Touches
Cursor:

Consider custom cursor (just slightly larger dot, amber trail on click)
Very subtle—only if you want that extra 2% of craft

Loading state:

If needed: simple fade-in on page load
Or: staggered fade-in of sections (hero first, then content)
No spinners, no progress bars

Footnotes/references (if needed):

Smaller text, secondary color
Superscript numbers in amber
Very editorial/academic energy


Vibe Check: References
Your site should feel like:

Kinfolk magazine (before it got too minimal)
Monocle editorial layouts
Case Study House photography
Yves Béhar product pages
A24 Films credits

NOT like:

Generic SaaS landing pages
Portfolio template sites
Anything with geometric patterns or tech gradients
Overly playful/whimsical
