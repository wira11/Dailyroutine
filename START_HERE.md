# 🎯 START HERE

Welcome to the **Daily Routine Tracker**!

This is your complete guide to getting up and running.

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Install Dependencies

```bash
# Navigate to this folder in terminal
cd "Daily Routine"

# Install dependencies
npm install
```

### 2️⃣ Start the App

```bash
# Run development server
npm run dev
```

The app will open at: **http://localhost:5173**

### 3️⃣ Create Your First Habit

1. Click **"Manage Habits"** tab
2. Type a habit name (e.g., "Morning Exercise")
3. Click **"Add Habit"**
4. Go to **"Today"** tab and check it off!

---

## 📚 What to Read Next

Choose your path:

### 🎨 **I want to USE the app**
→ Read [QUICKSTART.md](QUICKSTART.md)
- How to add habits
- How to track progress
- How to view analytics
- Tips for success

### 💻 **I want to UNDERSTAND the code**
→ Read [ARCHITECTURE.md](ARCHITECTURE.md)
- System design
- Data models
- Service layer
- Component structure

### 🛠 **I want to EXTEND/MODIFY it**
→ Read [DEV_NOTES.md](DEV_NOTES.md)
- Common modifications
- Code patterns
- Testing scenarios
- V2 roadmap

### 📖 **I want the BIG PICTURE**
→ Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- Complete overview
- Feature list
- Tech stack
- Deployment guide

---

## 🎯 What This App Does

**Daily Routine Tracker** helps you:

✅ Track daily habits (morning exercise, reading, meditation, etc.)
✅ See real-time completion percentage
✅ View analytics and trends over time
✅ Build consistency through awareness (not gamification)

**Key Features:**
- 📊 Beautiful charts (monthly & yearly)
- 🔄 Automatic daily reset
- 💾 Local storage (privacy-first)
- 📱 Mobile-friendly
- 🚫 No login required

---

## 📂 Project Structure

```
Daily Routine/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── services/           # Business logic
│   ├── store/              # State management
│   ├── types/              # TypeScript types
│   └── utils/              # Helper functions
│
├── QUICKSTART.md           # User guide
├── ARCHITECTURE.md         # Technical docs
├── DEV_NOTES.md            # Development guide
├── PROJECT_SUMMARY.md      # Complete overview
├── CHANGELOG.md            # Version history
├── README.md               # Project intro
└── setup.sh                # Quick setup script
```

---

## 🎨 Screenshot Preview

### Today Tab
- See all your habits for today
- Check them off as you complete them
- Watch progress ring update in real-time

### Analytics Tab
- Monthly line chart (daily progress)
- Yearly bar chart (monthly averages)
- Spot trends and patterns

### Manage Habits Tab
- Add new habits
- Edit existing ones
- Archive completed habits

---

## 🔧 Troubleshooting

### "Command not found: npm"
→ Install Node.js from https://nodejs.org (version 18+)

### "Port 5173 already in use"
→ Kill the process or use: `npm run dev -- --port 3000`

### "Module not found" errors
→ Delete `node_modules/` and run `npm install` again

### Charts not showing
→ You need a few days of data first. Use the sample data seeder:
1. Open browser console (F12)
2. Type: `window.seedSampleData()`
3. Refresh page

---

## 🧪 Try Sample Data

Want to see how it looks with data?

1. **Start the app**: `npm run dev`
2. **Open browser console**: Press F12
3. **Seed data**: Type `window.seedSampleData()` and press Enter
4. **Refresh page**: Press F5
5. **Explore**: Check out the Today tab and Analytics!

---

## 💡 Pro Tips

1. **Start Small**: Begin with 3-5 realistic habits
2. **Be Honest**: Check off only what you actually did
3. **Review Weekly**: Look at analytics every Sunday
4. **Adjust**: Remove habits that don't serve you
5. **Stay Calm**: This is about awareness, not perfection

---

## 🎓 Learning Opportunity

This project is also a great learning resource for:

- **React 18** patterns and best practices
- **TypeScript** strict mode usage
- **State management** with Zustand
- **Charts** with Recharts
- **Responsive design** with Tailwind CSS
- **Clean architecture** and separation of concerns

Feel free to explore the code and learn from it!

---

## 🚢 Next Steps After Setup

### For Users:
1. ✅ Complete Quick Start above
2. ✅ Add 3-5 habits
3. ✅ Use daily for 1 week
4. ✅ Check analytics
5. ✅ Adjust as needed

### For Developers:
1. ✅ Complete Quick Start above
2. ✅ Read ARCHITECTURE.md
3. ✅ Explore component code
4. ✅ Try modifying a component
5. ✅ Build your own features

---

## ❓ Need Help?

**Check these resources in order:**

1. **Quick errors**: See Troubleshooting section above
2. **Usage questions**: Read [QUICKSTART.md](QUICKSTART.md)
3. **Code questions**: Read [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Development**: Read [DEV_NOTES.md](DEV_NOTES.md)

**Still stuck?**
- Check browser console for errors
- Look for comments in the code
- Review TypeScript types for documentation

---

## 🎉 You're Ready!

That's it! You now know everything you need to:

✅ Install and run the app
✅ Use it for habit tracking
✅ Understand how it works
✅ Modify it for your needs

**Run this to get started:**

```bash
npm install && npm run dev
```

---

**Happy habit tracking! 🎯**

*Built for clarity and self-awareness, not gamification.*
