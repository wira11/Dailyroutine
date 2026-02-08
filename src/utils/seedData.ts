/**
 * Sample Data Seeder
 * 
 * Use this to quickly populate the app with test data
 * Useful for:
 * - Testing analytics
 * - Demoing the app
 * - Development
 * 
 * To use:
 * 1. Open browser console
 * 2. Copy and paste this entire file
 * 3. Call seedSampleData()
 * 4. Refresh the page
 */

export const seedSampleData = () => {
  // Sample habits
  const habits = [
    {
      id: crypto.randomUUID(),
      name: "Morning Exercise",
      active: true,
      createdAt: new Date("2026-01-01").toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Read for 30 minutes",
      active: true,
      createdAt: new Date("2026-01-01").toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Drink 8 glasses of water",
      active: true,
      createdAt: new Date("2026-01-05").toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Meditate",
      active: true,
      createdAt: new Date("2026-01-10").toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Journal",
      active: true,
      createdAt: new Date("2026-01-15").toISOString(),
    },
  ];

  // Generate completion records for the past 30 days
  const completions = [];
  const today = new Date();
  
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];

    habits.forEach((habit, index) => {
      // Only create completions for habits that existed on that date
      const habitCreatedDate = new Date(habit.createdAt).toISOString().split('T')[0];
      if (dateStr >= habitCreatedDate) {
        // Randomly complete habits (70% completion rate with some variation)
        const randomChance = Math.random();
        const baseCompletionRate = 0.7 - (index * 0.05); // Each habit slightly less likely
        const completed = randomChance < baseCompletionRate;

        completions.push({
          habitId: habit.id,
          date: dateStr,
          completed: completed,
        });
      }
    });
  }

  // Store in localStorage
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('completions', JSON.stringify(completions));
  localStorage.setItem('appState', JSON.stringify({
    lastActiveDate: today.toISOString().split('T')[0],
    initialized: true,
  }));

  console.log('✅ Sample data seeded!');
  console.log(`📊 Created ${habits.length} habits`);
  console.log(`📊 Created ${completions.length} completion records`);
  console.log('🔄 Refresh the page to see the data');
};

// For console use
if (typeof window !== 'undefined') {
  (window as any).seedSampleData = seedSampleData;
}
