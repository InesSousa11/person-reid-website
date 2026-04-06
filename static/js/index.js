document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const observedSections = Array.from(document.querySelectorAll("section[id]"));

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isMatch = link.dataset.target === id;
      link.classList.toggle("active-link", isMatch);
    });
  }

  if (navLinks.length && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-32% 0px -46% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const targetId = link.dataset.target;
        if (targetId) setActiveLink(targetId);
      });
    });
  }
});