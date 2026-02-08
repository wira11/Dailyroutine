# 🚀 Deploying to GitHub Pages

## Quick Setup (5 Steps)

### 1️⃣ Initialize Git Repository

```bash
cd "Daily Routine"
git init
git add .
git commit -m "Initial commit: Daily Routine Tracker v1.0"
```

### 2️⃣ Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `PythonLearning` (or any name you prefer)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we already have files)
5. Click "Create repository"

### 3️⃣ Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/PythonLearning.git
git branch -M main
git push -u origin main
```

### 4️⃣ Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: **GitHub Actions**
5. Save

### 5️⃣ Deploy!

The GitHub Action will automatically deploy on every push to `main` branch.

Your site will be live at:
```
https://YOUR_USERNAME.github.io/PythonLearning/
```

---

## 🔧 What I've Set Up For You

✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
✅ Vite base configuration for GitHub Pages
✅ Automatic deployment on push

---

## 📝 Step-by-Step Commands

Copy and paste these (replace YOUR_USERNAME):

```bash
# 1. Navigate to project
cd "Daily Routine"

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. First commit
git commit -m "Initial commit: Daily Routine Tracker v1.0"

# 5. Add GitHub remote (CHANGE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/PythonLearning.git

# 6. Rename branch to main
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

---

## ⚡ Future Updates

After initial setup, to deploy updates:

```bash
git add .
git commit -m "Update: description of changes"
git push
```

GitHub Actions will automatically rebuild and deploy!

---

## 🌐 Alternative: Use a Different Repository Name

If you want a different URL, change the `base` in `vite.config.ts`:

```typescript
base: '/YOUR-REPO-NAME/',
```

Then create a repo with that name on GitHub.

---

## 🐛 Troubleshooting

**Build fails on GitHub?**
- Check the Actions tab for error logs
- Make sure `package.json` has correct dependencies

**Blank page after deploy?**
- Verify `base` in `vite.config.ts` matches your repo name
- Check browser console for 404 errors

**404 on assets?**
- Ensure `base` path is correct (starts and ends with `/`)

---

## ✅ Checklist

- [ ] Git initialized
- [ ] GitHub repo created (public)
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Workflow ran successfully
- [ ] Site is live!

---

## 🎉 After Deployment

Your app will be publicly accessible at:
```
https://YOUR_USERNAME.github.io/PythonLearning/
```

Share it with anyone! All data stays local on each user's device.

---

**Need help?** Check GitHub Actions logs in the "Actions" tab of your repository.
