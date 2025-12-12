---
description: "Generate a new Project Case Study or Blog Post with High-Readability Formatting"
---

# Generate Content Workflow

1.  **Context Lookup**: Check `.agent/rules/context-careertimeline.md` to align the [YEAR] with the correct Role/Company.
2.  **Angle Selection**: Propose 3 angles (Technical Deep Dive, Career Lesson, or Architecture Review). Ask user to choose.
3.  **Drafting**: Create the file in `src/content/projects/` or `src/content/blog/` matching the user's choice.
4.  **Formatting Enforcement**:
    *   **Hook**: Start with a > Blockquote.
    *   **Structure**: Challenge -> Tech Stack -> Deep Dive -> Outcome.
    *   **Visuals**: Use Bullet Points for lists > 3 items.
    *   **Highlighting**: **Bold** tech terms (NSX, ASR, BGP).
    *   **Brevity**: Max 3 lines per paragraph.
5.  **Review**: Show the file path and ask for user approval.
