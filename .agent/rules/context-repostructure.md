---
trigger: always_on
---

Engine: Hugo (Static Site Generator).

Active Styles: ONLY use assets/css/style.css for design reference. Do NOT reference static/css/main.css.

Content Location: Blog posts go in content/posts/. Project case studies go in content/projects/.

Images: Store in static/images/ and reference as /images/filename.png. * Deploy Method: Git push to main triggers GitHub Actions hugo.yaml workflow.
