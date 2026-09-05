# Omapop landing page

The static site at **https://omapop.rocks**, hosted on GitHub Pages from the root
of `main` in `jondkinney/omapop-site`, matching the deployment setup used for
Vernier, Mousehop, and Tensaku. No package install or build step is needed.

The desktop plugin lives at https://github.com/jondkinney/omapop.

## Develop and check

```sh
python3 -m http.server 8765 --bind 127.0.0.1
node --test tests/*.test.mjs
```

Open http://127.0.0.1:8765. The demo operates only on its own text field, never
sends text to a service, and writes to the clipboard only after a Copy click.
Only the optional color-theme preference is saved in local storage. No analytics,
third-party scripts, remote fonts, or runtime dependencies are included.

## Assets and content

- `assets/omapop.svg` reuses the plugin's original `BarIcon.qml` path geometry.
- `assets/extensions-panel.png` is the real, scoped Nord-theme UI capture from
  the plugin repository. It contains no surrounding desktop or private content.
- `assets/preview.jpg` is the plugin's existing listing composition: an
  illustrated selection bar plus the real panel, used for social previews.
- The browser demo is explicitly labeled, not presented as a desktop screenshot.
- Keep installation commands and requirements aligned with the plugin README.
  Do not imply every PopClip extension is Linux-compatible or that the projects
  are affiliated.

## Deployment

Push changes to `main`. GitHub Pages publishes the repository root; `.nojekyll`
keeps it a plain static site and `CNAME` preserves `omapop.rocks`.

Name.com DNS for the apex uses GitHub Pages' four A records:
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
The `www` CNAME points directly to `jondkinney.github.io`, not a repository path.
Configure the custom domain in GitHub Pages before pointing DNS at it, then
enable HTTPS enforcement once GitHub has issued the certificate.

See GitHub's current custom-domain documentation before changing DNS:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Code and original Omapop assets: MIT, copyright 2026 Jon Kinney. Third-party
extension names and marks in the screenshot identify those extensions.
