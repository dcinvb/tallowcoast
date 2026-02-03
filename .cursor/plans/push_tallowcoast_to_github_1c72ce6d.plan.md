---
name: Push TallowCoast to GitHub
overview: Initialize Git in TallowCoast, create an initial commit with message "updated project files", connect to a GitHub remote, and push.
todos:
  - id: todo-1770144215405-3mqxc05cu
    content: ""
    status: pending
isProject: false
---

# Push TallowCoast to GitHub

The project currently has **no Git repository** (no `.git` folder). The following steps will initialize it, commit, and push to GitHub.

## Prerequisites

- **Git** installed and configured (name/email set).
- A **GitHub repository** for this project. Either:
  - Create one at [github.com/new](https://github.com/new) (e.g. named `TallowCoast`), leave it empty (no README/license), and note the repo URL (e.g. `https://github.com/YOUR_USERNAME/TallowCoast.git`), or
  - Use GitHub CLI: `gh repo create TallowCoast --private --source=. --remote=origin --push` (after the steps below, this can do remote + push in one go).

## Steps

1. **Initialize Git and create first commit** (from `c:\Projects\TallowCoast`):
  - `git init`
  - `git add .`
  - `git commit -m "updated project files"`
2. **Connect to GitHub and push**:
  - Add remote (replace with your actual repo URL):
    - `git remote add origin https://github.com/YOUR_USERNAME/TallowCoast.git`
  - Ensure branch name (GitHub default is `main`):
    - `git branch -M main`
  - Push:
    - `git push -u origin main`

## Notes

- Existing [.gitignore](.gitignore) at the root (and in `client/`, `server/`) will keep `node_modules`, `.env`, and other ignored paths out of the repo.
- If you use **GitHub CLI** and prefer it to create the repo and push for you, run step 1 (init, add, commit), then from the same directory:

