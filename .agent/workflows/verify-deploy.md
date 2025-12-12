---
description: "Verify the site build and deployment status"
---

# Deploy Verification Workflow

1.  **Local Build**: Run `npm run build` to ensure no compilation errors.
2.  **Lint Check**: Check console output for CSS or Content warnings (e.g., Duplicate IDs).
3.  **Git Status**: Ensure clean working directory.
4.  **Push**: `git push` to trigger GitHub Actions.
5.  **Monitor**: Watch the 'Actions' tab or use `gh run watch` if available.
