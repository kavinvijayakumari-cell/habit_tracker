import "./App.css";
import { useState, useEffect } from "react";

function App() {

  // Habit Input
  const [habit, setHabit] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Category
  const [category, setCategory] = useState("Study");
  const [filterCategory, setFilterCategory] = useState("All");

  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // Streak
  const [streak, setStreak] = useState(0);

  // Completed Dates
  const [completedDates, setCompletedDates] = useState([]);

  // Reminder
  const [showReminder, setShowReminder] = useState(false);

  // Profile
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Kavin"
  );

  const [dailyGoal, setDailyGoal] = useState(
    Number(localStorage.getItem("dailyGoal")) || 5
  );

  const [showProfile, setShowProfile] = useState(false);

  // Habits
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  // Save Habits
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Save Profile
  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("dailyGoal", dailyGoal);
  }, [username, dailyGoal]);

  // Reminder Popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReminder(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Close Reminder
  const closeReminder = () => {
    setShowReminder(false);
  };
    // ===========================
  // Add Habit
  // ===========================

  const addHabit = () => {

    if (habit.trim() === "") {
      alert("Please enter a habit.");
      return;
    }

    const newHabit = {
      id: Date.now(),
      name: habit,
      category: category,
      date: new Date().toLocaleDateString(),
      completed: false,
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);

    setHabit("");
  };


  // ===========================
  // Delete Habit
  // ===========================

  const deleteHabit = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this habit?"
    );

    if (!confirmDelete) return;

    setHabits((prevHabits) =>
      prevHabits.filter((item) => item.id !== id)
    );
  };


  // ===========================
  // Edit Habit
  // ===========================

  const editHabit = (id) => {

    const selectedHabit = habits.find(
      (item) => item.id === id
    );

    if (!selectedHabit) return;

    const updatedName = prompt(
      "Edit Habit",
      selectedHabit.name
    );

    if (updatedName === null) return;

    if (updatedName.trim() === "") {
      alert("Habit name cannot be empty.");
      return;
    }

    setHabits((prevHabits) =>
      prevHabits.map((item) =>
        item.id === id
          ? {
              ...item,
              name: updatedName.trim(),
            }
          : item
      )
    );
  };
    // ===========================
  // Complete Habit
  // ===========================

  const toggleComplete = (id) => {

    const updatedHabits = habits.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          completed: !item.completed,
        };

      }

      return item;

    });

    setHabits(updatedHabits);

    // Completed Count
    const completedCount = updatedHabits.filter(
      (item) => item.completed
    ).length;

    setStreak(completedCount);

    // Save Today's Date
    const today = new Date().toLocaleDateString();

    if (!completedDates.includes(today)) {
      setCompletedDates((prev) => [...prev, today]);
    }

  };


  // ===========================
  // Search + Category Filter
  // ===========================

  const filteredHabits = habits.filter((item) => {

    const searchMatch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      filterCategory === "All" ||
      item.category === filterCategory;

    return searchMatch && categoryMatch;

  });


  // ===========================
  // Dashboard
  // ===========================

  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (item) => item.completed
  ).length;

  const pendingHabits =
    totalHabits - completedHabits;

  const progress =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedHabits / totalHabits) * 100
        );
          return (

    <div className={darkMode ? "container dark" : "container"}>

      {/* Reminder */}

      {showReminder && (

        <div className="reminder">

          <h3>🔔 Reminder</h3>

          <p>Don't forget your habits today!</p>

          <button onClick={closeReminder}>
            OK
          </button>

        </div>

      )}

      <h1>🏆 Habit Tracker</h1>

      <p className="subtitle">
        Build Better Habits Everyday
      </p>

      {/* Dark Mode */}

      <button
        className="theme-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode
          ? "☀️ Light Mode"
          : "🌙 Dark Mode"}
      </button>

      {/* Profile Button */}

      <button
        className="profile-btn"
        onClick={() =>
          setShowProfile(!showProfile)
        }
      >
        👤 Profile
      </button>

      {/* Profile Card */}

      {showProfile && (

        <div className="profile-card">

          <h2>
            👤 {username}
          </h2>

          <p>
            Role: Full Stack Developer
          </p>

          <p>
            🎯 Daily Goal : {dailyGoal} Habits
          </p>

          <input
            type="number"
            value={dailyGoal}
            onChange={(e) =>
              setDailyGoal(Number(e.target.value))
            }
          />

        </div>

      )}

      {/* Dashboard */}

      <div className="dashboard">

        <div className="card">
          <h2>{totalHabits}</h2>
          <p>Total</p>
        </div>

        <div className="card">
          <h2>{completedHabits}</h2>
          <p>Completed</p>
        </div>

        <div className="card">
          <h2>{pendingHabits}</h2>
          <p>Pending</p>
        </div>

        <div className="card">
          <h2>🔥 {streak}</h2>
          <p>Streak</p>
        </div>

      </div>

      {/* Progress */}

      <div className="progress-section">

        <div className="progress-header">

          <h3>Progress</h3>

          <span>{progress}%</span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`
            }}
          ></div>

        </div>

      </div>
            {/* Add Habit */}

      <div className="input-section">

        <input
          type="text"
          placeholder="Enter Habit"
          value={habit}
          onChange={(e) => setHabit(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Study">📚 Study</option>
          <option value="Health">💪 Health</option>
          <option value="Coding">💻 Coding</option>
        </select>

        <button onClick={addHabit}>
          Add
        </button>

      </div>

      {/* Search */}

      <input
        className="search"
        type="text"
        placeholder="Search Habit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category Filter */}

      <div className="filter-section">

        <button onClick={() => setFilterCategory("All")}>
          All
        </button>

        <button onClick={() => setFilterCategory("Study")}>
          📚 Study
        </button>

        <button onClick={() => setFilterCategory("Health")}>
          💪 Health
        </button>

        <button onClick={() => setFilterCategory("Coding")}>
          💻 Coding
        </button>

      </div>

      {/* Habit List */}

      <ul>

        {filteredHabits.length === 0 ? (

          <p>No Habits Found.</p>

        ) : (

          filteredHabits.map((item) => (

            <li key={item.id}>

              <div className="habit-info">

                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id)}
                />

                <div>

                  <h3>{item.name}</h3>

                  <small>
                    Category : {item.category}
                  </small>

                  <br />

                  <small>
                    Added : {item.date}
                  </small>

                </div>

              </div>

              <div>

                <button
                  className="edit-btn"
                  onClick={() => editHabit(item.id)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteHabit(item.id)}
                >
                  Delete
                </button>

              </div>

            </li>

          ))

        )}

      </ul>

    </div>

  );

}

export default App;