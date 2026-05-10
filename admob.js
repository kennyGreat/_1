name: Deploy DataBulge Web to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Validate required web files
        run: |
          test -f index.html              || (echo "MISSING: index.html"              && exit 1)
          test -f databulge-auth.html     || (echo "MISSING: databulge-auth.html"     && exit 1)
          test -f reset-password.html     || (echo "MISSING: reset-password.html"     && exit 1)
          test -f landing.html            || (echo "MISSING: landing.html"            && exit 1)
          test -f robots.txt              || (echo "MISSING: robots.txt"              && exit 1)
          test -f sitemap.xml             || (echo "MISSING: sitemap.xml"             && exit 1)
          test -f CNAME                   || (echo "MISSING: CNAME"                   && exit 1)
          echo "All required web files present."

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload site to Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
