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
    const day = urlParams.get("zi");

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
        <a href="?zi=${dayNumber}" class="calendar-day${lockedClass}">
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
        <p>Advent 2025 cu <a href="https://www.unu-unu.ro/" target="_blank" rel="noopener">Biserica Unu Unu</a></p>
        <p>Material oferit de <a href="https://www.magnagratia.org/" target="_blank" rel="noopener">Magna Gratia</a> · <a href="https://www.magnagratia.org/carti/215-gngj-romanian-piper/" target="_blank" rel="noopener">"O Veste Bună, O Mare Bucurie" de John Piper</a></p>
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

        <div class="share-section">
          <p class="share-label">Trimite acest mesaj:</p>
          <div class="share-buttons">
            <button class="share-icon-btn share-facebook" id="shareFacebook" aria-label="Share pe Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button class="share-icon-btn share-whatsapp" id="shareWhatsapp" aria-label="Share pe WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button class="share-icon-btn share-native" id="shareNative" aria-label="Share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>

        <nav class="navigation">
          ${
            prevDay
              ? `<a href="?zi=${prevDay}" class="nav-btn">← Ziua ${prevDay}</a>`
              : '<span class="nav-btn disabled">← Anterioara</span>'
          }
          <a href="/" class="nav-btn nav-btn-home">Calendar</a>
          ${
            nextDay
              ? `<a href="?zi=${nextDay}" class="nav-btn">Ziua ${nextDay} →</a>`
              : '<span class="nav-btn disabled">Următoarea →</span>'
          }
        </nav>
        <footer class="attribution">
          <p>Advent 2025 cu <a href="https://www.unu-unu.ro/" target="_blank" rel="noopener">Biserica Unu Unu</a></p>
          <p>Material oferit de <a href="https://www.magnagratia.org/" target="_blank" rel="noopener">Magna Gratia</a></p>
        </footer>
      </div>
      <a href="#" class="back-to-top" id="backToTop" aria-label="Înapoi sus">↑</a>
    `;

    content.innerHTML = devotionalHTML;
    this.initBackToTop();
    this.initShareButtons(dayNumber, dayData.title);
  }

  initShareButtons(dayNumber, title) {
    const shareUrl = `${window.location.origin}?zi=${dayNumber}`;
    const shareText = `Advent 2025 - Ziua ${dayNumber}: ${title}`;

    // Facebook share
    const fbBtn = document.getElementById("shareFacebook");
    if (fbBtn) {
      fbBtn.addEventListener("click", () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
      });
    }

    // WhatsApp share
    const waBtn = document.getElementById("shareWhatsapp");
    if (waBtn) {
      waBtn.addEventListener("click", () => {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        window.open(waUrl, "_blank");
      });
    }

    // Native share
    const nativeBtn = document.getElementById("shareNative");
    if (nativeBtn) {
      nativeBtn.addEventListener("click", async () => {
        const shareData = {
          title: `Ziua ${dayNumber}: ${title}`,
          text: shareText,
          url: shareUrl,
        };

        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            const originalHTML = nativeBtn.innerHTML;
            nativeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => {
              nativeBtn.innerHTML = originalHTML;
            }, 2000);
          }
        } catch (err) {
          console.log("Share failed:", err);
        }
      });
    }
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
