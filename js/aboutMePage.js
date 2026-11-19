let aboutMePageCleanup = null;

function cleanupCustomPageBehaviors() {
  if (typeof aboutMePageCleanup === "function") aboutMePageCleanup();
  aboutMePageCleanup = null;
}

function initializeCustomPageBehaviors(container = document) {
  cleanupCustomPageBehaviors();
  const root = container.querySelector("[data-about-me-page]");
  if (!root) return;

  const buttons = [...root.querySelectorAll("[data-about-language]")];
  const panels = [...root.querySelectorAll(".language-section[lang]")];
  const selectLanguage = (language) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.aboutLanguage === language));
    });
    panels.forEach((panel) => {
      const inactive = panel.lang !== language;
      panel.hidden = false;
      panel.classList.toggle("is-inactive-language", inactive);
      panel.inert = inactive;
      panel.setAttribute("aria-hidden", String(inactive));
    });
  };

  let initialLanguage = "ko";
  try {
    if (localStorage.getItem("aboutLanguage") === "en") initialLanguage = "en";
  } catch (error) {}
  selectLanguage(initialLanguage);

  const englishProfile = root.querySelector('#about-language-en .about-profile');
  const englishText = englishProfile?.querySelector('p');
  const photos = [...root.querySelectorAll('.about-profile-photo')];
  const fitPortrait = () => {
    if (!englishText) return;
    if (window.matchMedia('(max-width: 600px)').matches) {
      photos.forEach(photo => { photo.style.width = ''; });
      return;
    }
    // Text wraps as the portrait width changes, so settle both dimensions together.
    let width = 156;
    for (let pass = 0; pass < 12; pass++) {
      photos.forEach(photo => { photo.style.width = `${width}px`; });
      const next = englishText.getBoundingClientRect().height * 425 / 567;
      if (Math.abs(next - width) < 0.5) break;
      width = next;
    }
  };
  let previousWidth = 0;
  const observer = new ResizeObserver(() => {
    const width = root.getBoundingClientRect().width;
    if (width === previousWidth) return;
    previousWidth = width;
    fitPortrait();
  });
  observer.observe(root);
  document.fonts.ready.then(() => { if (root.isConnected) fitPortrait(); });
  fitPortrait();

  const onLanguageClick = (event) => {
    const button = event.target.closest("[data-about-language]");
    if (!button || !root.contains(button)) return;
    const language = button.dataset.aboutLanguage;
    selectLanguage(language);
    try { localStorage.setItem("aboutLanguage", language); } catch (error) {}
  };
  root.addEventListener("click", onLanguageClick);
  aboutMePageCleanup = () => {
    root.removeEventListener("click", onLanguageClick);
    observer.disconnect();
  };
}
