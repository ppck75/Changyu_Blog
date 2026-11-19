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
    panels.forEach((panel) => { panel.hidden = panel.lang !== language; });
  };

  let initialLanguage = "ko";
  try {
    if (localStorage.getItem("aboutLanguage") === "en") initialLanguage = "en";
  } catch (error) {}
  selectLanguage(initialLanguage);

  const onLanguageClick = (event) => {
    const button = event.target.closest("[data-about-language]");
    if (!button || !root.contains(button)) return;
    const language = button.dataset.aboutLanguage;
    selectLanguage(language);
    try { localStorage.setItem("aboutLanguage", language); } catch (error) {}
  };
  root.addEventListener("click", onLanguageClick);
  aboutMePageCleanup = () => root.removeEventListener("click", onLanguageClick);
}
