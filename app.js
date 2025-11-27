// Advent Devotional App
// Handles routing, data loading, and dynamic content rendering

class AdventApp {
  constructor() {
    this.data = null;
    this.currentDay = null;
    this.init();
  }

  async init() {
    await this.loadData();
    this.handleRouting();
  }

  async loadData() {
    try {
      const response = await fetch("data/data.json");
      const rawData = await response.json();
      // Handle array format from data.json
      this.data = { days: rawData };
    } catch (error) {
      console.error("Error loading devotional data:", error);
      this.showError(
        "Nu s-a putut încărca conținutul devoțional. Te rugăm să reîncarci pagina."
      );
    }
  }

  handleRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const day = urlParams.get("day");

    if (day) {
      this.currentDay = parseInt(day);
      this.renderDay(this.currentDay);
    } else {
      this.renderCalendar();
    }
  }

  renderCalendar() {
    const content = document.getElementById("app-content");

    if (!this.data || !this.data.days) {
      content.innerHTML = '<div class="loading">Se încarcă calendarul...</div>';
      return;
    }

    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11 (December = 11)
    const currentDate = today.getDate();
    const currentYear = today.getFullYear();

    let calendarHTML = '<div class="calendar-grid">';

    this.data.days.forEach((day) => {
      const dayNumber = day.day;
      const isDecember = currentMonth === 11; // December
      // Allow all days to be clickable, just style locked ones differently
      const isAvailable = isDecember && currentDate >= dayNumber;
      const lockedClass = isAvailable ? "" : " locked";

      calendarHTML += `
        <a href="?day=${dayNumber}" class="calendar-day${lockedClass}">
          <span class="day-number">${dayNumber}</span>
          <span class="day-date">Decembrie </span>
          <span class="day-preview-title">${day.title}</span>
        </a>
      `;
    });

    calendarHTML += "</div>";
    // Add attribution footer
    calendarHTML += `
      <footer class="attribution">
        <p>Material oferit de <a href="https://www.magnagratia.org/" target="_blank" rel="noopener">Magna Gratia</a></p>
        <p><a href="https://www.magnagratia.org/carti/215-gngj-romanian-piper/" target="_blank" rel="noopener">"O Veste Bună, O Mare Bucurie" de John Piper</a></p>
      </footer>
    `;
    content.innerHTML = calendarHTML;
  }

  renderDay(dayNumber) {
    const content = document.getElementById("app-content");

    if (!this.data || !this.data.days) {
      content.innerHTML =
        '<div class="loading">Se încarcă devoționalul...</div>';
      return;
    }

    const dayData = this.data.days.find((d) => d.day === dayNumber);

    if (!dayData) {
      this.showError(`Devoționalul pentru ziua ${dayNumber} nu a fost găsit.`);
      return;
    }

    // Update page title
    document.title = `Ziua ${dayNumber}: ${dayData.title} - Devoțional de Advent`;

    const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
    const nextDay = dayNumber < 25 ? dayNumber + 1 : null;

    const devotionalHTML = `
      <div class="devotional-reading">
        <header class="reading-header">
          <span class="reading-day-label">Ziua ${dayNumber} • ${dayNumber} Decembrie</span>
          <h2 class="reading-title">${dayData.title}</h2>
        </header>

        <div class="bible-verse">
          <p class="verse-text">${dayData.verse}</p>
          <cite class="verse-reference">${dayData.verse_ref}</cite>
        </div>

        <div class="devotional-content">
          ${this.renderDevotionalText(dayData.text)}
        </div>

        <nav class="navigation">
          ${
            prevDay
              ? `<a href="?day=${prevDay}" class="nav-btn">← Ziua ${prevDay}</a>`
              : '<span class="nav-btn disabled">← Anterioara</span>'
          }
          <a href="/" class="nav-btn nav-btn-home">Calendar</a>
          ${
            nextDay
              ? `<a href="?day=${nextDay}" class="nav-btn">Ziua ${nextDay} →</a>`
              : '<span class="nav-btn disabled">Următoarea →</span>'
          }
        </nav>
        <footer class="attribution">
          <p>Material oferit de <a href="https://www.magnagratia.org/" target="_blank" rel="noopener">Magna Gratia</a></p>
        </footer>
      </div>
      <a href="#" class="back-to-top" id="backToTop" aria-label="Înapoi sus">↑</a>
    `;

    content.innerHTML = devotionalHTML;
    this.initBackToTop();
  }

  renderDevotionalText(text) {
    // Handle both string and array formats
    if (Array.isArray(text)) {
      return text.map((paragraph) => `<p>${paragraph}</p>`).join("");
    }
    // Split by double line breaks if it's a single string
    return text
      .split("\n\n")
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  showError(message) {
    const content = document.getElementById("app-content");
    content.innerHTML = `
      <div class="error">
        <h3>Eroare</h3>
        <p>${message}</p>
        <br>
        <a href="/" class="nav-btn">Înapoi la Calendar</a>
      </div>
    `;
  }

  initBackToTop() {
    const backToTopBtn = document.getElementById("backToTop");
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", toggleBackToTop);
    toggleBackToTop(); // Check initial position

    // Smooth scroll to top
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AdventApp();
});
