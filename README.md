# Virtual Sachin - Site Maintenance Guide

> **Philosophy**: You are an Architect. Your site should run like a well-architected system.
> This repository uses **Code-as-Configuration**. You don't "design" pages; you write content, and the system renders it.

## 🚀 Quick Start (Local Development)

To run the site on your machine to preview changes:

1. **Open Terminal** in this folder.
2. **Run**:

    ```bash
    npm run dev
    ```

3. **View**: Open `http://localhost:1313/`

## ✍️ Creating Content

I have set up "Archetypes" (templates) so you don't face an empty screen.

### 1. New Insight (Blog Post)

Use this for technical deep dives, opinion pieces, or tutorials.

**Command:**

```bash
hugo new content posts/my-topic-name.md
```

*(Replace `my-topic-name` with a URL-friendly slug, e.g., `kubernetes-scaling-strategies`)*

**What to write:**
The file will be created in `content/posts/`. Open it and fill in the sections:

- **Context**: The specific problem.
- **Solution**: Your unique approach.
- **Impact**: Measurable results.

### 2. New Project (Case Study)

Use this for major work you want to showcase.

**Command:**

```bash
hugo new content projects/project-name.md
```

**What to write:**
The file will be created in `content/projects/`.

- **The Challenge**: Why was this hard?
- **Tech Stack**: What tools did you use?
- **Outcome**: Why was it a success?

## 🚢 Deployment

The site is configured with **GitOps**. You do not need to manually deploy anything.

**Workflow:**

1. **Write** your content locally.
2. **Set `draft: false`** in the file header (frontmatter) when ready.
3. **Push** to GitHub:

    ```bash
    git add .
    git commit -m "feat: new post on chaos engineering"
    git push
    ```

4. **Wait**: GitHub Actions will automatically build and deploy the site in ~60 seconds.

## 🛠 Troubleshooting

**"I don't see my new post!"**

1. Did you save the file?
2. Did you change `draft: true` to `draft: false` in the file?
3. Did the GitHub Action complete successfully? (Check the "Actions" tab on GitHub).

**"The formatting looks weird"**

- Ensure you are using standard Markdown.
- Use `##` for section headers (H2).
- Use `*italics*` and `**bold**` for emphasis.
- Use backticks for code: ` ` `python` ` `.

---
*Maintained by: Virtual Sachin*
