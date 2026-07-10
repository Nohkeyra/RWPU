Wawasan Pak Usop — UI/UX Enhancement Layer
============================================

How to use
----------
1. Unzip at the ROOT of your Capacitor project
   (the folder that contains `android/`, `package.json`, etc.)
2. The two files land at the correct paths automatically.

What changed (minimal — surgical)
----------------------------------
- android/app/src/main/assets/public/index.html
    - + 1 line: <link rel="stylesheet" ... kp-enhancements.css>
    - + 2 lines: <a class="kp-skip"> + tabindex on #root
    - All original content, scripts, fonts, and modulepreloads PRESERVED

- android/app/src/main/assets/public/assets/kp-enhancements.css (NEW)
    - 18.7 KB design system layer
    - Loaded AFTER the original Tailwind bundle so it wins the cascade
    - Skip-link styles defined here (works only when the link is focused)

Original assets (index-BNyT8fGb.css, *.js bundles, images) are UNTOUCHED.

Cascade order
-------------
1. index-BNyT8fGb.css   (Tailwind, original)
2. kp-enhancements.css   (this delivery — wins cascade)
3. *.js bundles          (React mount — unchanged)

Warning
-------
`npx cap sync` will overwrite the assets/public/ folder from
your dist/ output. If you re-sync, re-copy these two files
OR add kp-enhancements.css to your source project's src/
and import it in main.tsx (see INTEGRATION.md, option A).
