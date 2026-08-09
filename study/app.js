const examYears = [
  { year: 2026, files: 3 }, { year: 2025, files: 1 }, { year: 2020, files: 12 },
  { year: 2019, files: 12 }, { year: 2018, files: 18 }, { year: 2017, files: 12 },
  { year: 2016, files: 18 }, { year: 2015, files: 18 }, { year: 2014, files: 18 },
  { year: 2013, files: 18 }, { year: 2012, files: 17 }, { year: 2011, files: 18 },
  { year: 2010, files: 18 }, { year: 2009, files: 23 }, { year: 2008, files: 24 },
  { year: 2007, files: 24 }, { year: 2006, files: 24 }, { year: 2005, files: 20 },
  { year: 2004, files: 19 }, { year: 2003, files: 18 }, { year: 2002, files: 16 },
  { year: 2001, files: 14 },
];

const storageKey = "bwr-study-completed-years-v1";
const grid = document.querySelector("#yearGrid");
const template = document.querySelector("#yearCardTemplate");
const emptyState = document.querySelector("#emptyState");
const search = document.querySelector("#yearSearch");
const filterButtons = [...document.querySelectorAll(".filter")];
let activeFilter = "all";
let completed = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

function matchesFilter(year) {
  if (activeFilter === "recent") return year >= 2020;
  if (activeFilter === "2010s") return year >= 2010 && year <= 2019;
  if (activeFilter === "2000s") return year >= 2000 && year <= 2009;
  return true;
}

function updateProgress() {
  const count = examYears.filter(({ year }) => completed.has(year)).length;
  const percent = Math.round((count / examYears.length) * 100);
  document.querySelector("#completedCount").textContent = count;
  document.querySelector("#totalCount").textContent = examYears.length;
  document.querySelector("#progressPercent").textContent = `${percent}%`;
  document.querySelector("#progressRing").style.background =
    `conic-gradient(var(--lime) ${percent * 3.6}deg, rgba(255,255,255,.14) 0deg)`;
}

function renderYears() {
  const query = search.value.trim();
  const visible = examYears.filter(({ year }) => matchesFilter(year) && String(year).includes(query));
  grid.replaceChildren();

  visible.forEach(({ year, files }) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".year-card");
    const button = fragment.querySelector(".complete-button");
    const done = completed.has(year);

    fragment.querySelector("h3").textContent = year;
    fragment.querySelector(".file-count").textContent = `${files}개 자료`;
    card.dataset.year = year;
    card.classList.toggle("completed", done);
    button.setAttribute("aria-pressed", String(done));
    fragment.querySelector(".complete-text").textContent = done ? "학습 완료" : "학습 완료 표시";

    button.addEventListener("click", () => {
      if (completed.has(year)) completed.delete(year);
      else completed.add(year);
      localStorage.setItem(storageKey, JSON.stringify([...completed]));
      renderYears();
      updateProgress();
    });

    grid.append(fragment);
  });

  emptyState.hidden = visible.length !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderYears();
  });
});
search.addEventListener("input", renderYears);

document.querySelector("#resetProgress").addEventListener("click", () => {
  if (!completed.size || !window.confirm("저장된 학습 진도를 모두 초기화할까요?")) return;
  completed.clear();
  localStorage.removeItem(storageKey);
  renderYears();
  updateProgress();
});

let remainingSeconds = 40 * 60;
let timerId = null;
const timerDisplay = document.querySelector("#timerDisplay");
const timerToggle = document.querySelector("#timerToggle");

function paintTimer() {
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  timerToggle.textContent = "시작";
}

timerToggle.addEventListener("click", () => {
  if (timerId) {
    stopTimer();
    return;
  }
  timerToggle.textContent = "일시정지";
  timerId = setInterval(() => {
    remainingSeconds -= 1;
    paintTimer();
    if (remainingSeconds <= 0) {
      stopTimer();
      timerDisplay.textContent = "종료";
    }
  }, 1000);
});

document.querySelector("#timerReset").addEventListener("click", () => {
  stopTimer();
  remainingSeconds = 40 * 60;
  paintTimer();
});

renderYears();
updateProgress();
paintTimer();
