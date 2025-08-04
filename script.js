const planner = document.getElementById("planner");
const themeToggle = document.getElementById("themeToggle");
const daySelector = document.getElementById("daySelector");
const selectedDayDisplay = document.getElementById("selectedDay");
const todayDate = new Date().toDateString();
const hours = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];
const hourMap = { "8AM": 8, "9AM": 9, "10AM": 10, "11AM": 11, "12PM": 12, "1PM": 13, "2PM": 14, "3PM": 15, "4PM": 16, "5PM": 17 };
const currentHour = new Date().getHours();

// Theme setup
const body = document.body;
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
}
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Toast function
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Update Selected Day + Date
function updateDayAndDateDisplay() {
  const selectedDay = daySelector.value;
  document.getElementById("selectedDay").textContent = daySelector.value;
  const today = new Date();
  selectedDayDisplay.textContent = `Select Day: ${selectedDay}`;
  document.getElementById("date").textContent = today.toDateString();
}

// Render time cards
function renderPlanner(day) {
  planner.innerHTML = "";
  hours.forEach(hour => {
    const card = document.createElement("div");
    card.className = "time-card";

    if (hourMap[hour] === currentHour && day === new Date().toLocaleDateString('en-US', { weekday: 'long' })) {
      card.classList.add("current");
    }

    const label = document.createElement("span");
    label.textContent = hour;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add task...";
    input.value = localStorage.getItem(`${day}-${hour}`) || "";

    const button = document.createElement("button");
    button.textContent = "Add";
    button.className = "add-btn";

    button.addEventListener("click", () => {
      localStorage.setItem(`${day}-${hour}`, input.value);
      showToast(`✅ ${day} ${hour} saved`);
      button.textContent = "✅";
      setTimeout(() => button.textContent = "Add", 1000);
    });

    card.appendChild(label);
    card.appendChild(input);
    card.appendChild(button);
    planner.appendChild(card);
  });
}

// Init planner
const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
daySelector.value = todayName;
updateDayAndDateDisplay();
renderPlanner(todayName);

// Change selected day
daySelector.addEventListener("change", () => {
  updateDayAndDateDisplay();
  renderPlanner(daySelector.value);
});

// Clear current day's tasks
document.getElementById("clear").addEventListener("click", () => {
  if (confirm("Clear all tasks for this day?")) {
    hours.forEach(hour => localStorage.removeItem(`${daySelector.value}-${hour}`));
    renderPlanner(daySelector.value);
  }
});

// Weekly summary modal
const weeklyBtn = document.getElementById("weeklySummaryBtn");
const modal = document.getElementById("weeklyModal");
const closeModal = document.getElementById("closeModal");
const weeklyContent = document.getElementById("weeklyContent");

weeklyBtn.addEventListener("click", () => {
  weeklyContent.innerHTML = "";
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  days.forEach(day => {
    let hasData = false;
    const section = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = `📌 ${day}`;
    section.appendChild(heading);

    hours.forEach(hour => {
      const task = localStorage.getItem(`${day}-${hour}`);
      if (task) {
        const p = document.createElement("p");
        p.textContent = `${hour}: ${task}`;
        section.appendChild(p);
        hasData = true;
      }
    });

    if (hasData) weeklyContent.appendChild(section);
  });

  if (!weeklyContent.innerHTML.trim()) {
    weeklyContent.innerHTML = "<p>⚠️ No tasks saved this week.</p>";
  }

  modal.style.display = "block";
});

closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target == modal) modal.style.display = "none";
});
