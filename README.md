<h1 align="center">
  <a href="https://v4ylo.github.io/portfolio/">🌐 Visit the site → v4ylo.github.io/portfolio</a>
</h1>

# README

A small site that looks like a classified case-file system. You get a list of "cases" (folders), pick one, and flip through the pages like a real dossier. One of them (00-000A) is set up as an actual portfolio/application thing; the rest are for the look.

**What’s in it**

- **About** — short intro and how to use the site
- **Case Files** — list of folders; click a folder, then pick a case and open it
- Inside a case: flip-through pages, dark/light theme, EN/CZ language switch
- One case has a "red string" board (photos with draggable pins and string). Images can be zoomed-in (you "take" the photo/file from the folder) when you click them.

**Tech**

Plain HTML, CSS, and JavaScript.he header is loaded from a partial via `fetch`. Case content lives in `cases/<id>/` as small HTML fragments (front/back per page). Language and theme are stored in `localStorage`. If JavaScript is off, you get redirected to a no-js page that tells you to turn it on.

**Run it**

Open `index.html` in a browser, or use any local server (e.g. XAMPP). The header and case content are loaded by path, so file:// might break the fetch.

**Folder layout**

- `index.html` — about page  
- `case-files.html` — folder list  
- `case-detail.html` — open dossier view  
- `partials/` — header snippet  
- `cases/<id>/` — one folder per case (e.g. `00-000A`); inside: `page_1_front.html`, `page_1_back.html`, etc.  
- `cases/00-000A/cz/` — Czech versions of that case  
- `js/` — behavior (header, lang, theme, case list, red string, etc.)  
- `css/` — layout and theme

Made as a portfolio/application project. If you reuse the idea, the case data and paths are in `js/case-data.js`; add or edit entries there and add the matching HTML under `cases/`.
