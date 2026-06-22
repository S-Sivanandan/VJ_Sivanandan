# VJ_Sivanandan

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-apfb9gqu)

Preview (public): After you push to `main` the site will be published to GitHub Pages at:

- https://S-Sivanandan.github.io/VJ_Sivanandan/

To publish now from this workspace:

```bash
git add .
git commit -m "Add GitHub Pages deploy workflow"
git push origin main
```

The GitHub Actions workflow `.github/workflows/deploy-gh-pages.yml` will run on push and publish the production build from `dist/` to GitHub Pages. It may take a minute to appear.
