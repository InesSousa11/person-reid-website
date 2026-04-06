document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     HERO CAROUSEL
  ========================= */
  const track = document.getElementById("heroCarousel");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  const dotsWrap = document.getElementById("heroDots");

  if (track) {
    const cards = Array.from(track.querySelectorAll(".hero-carousel-card"));

    if (cards.length) {
      let activeIndex = 0;
      let ticking = false;

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        cards.forEach((_, index) => {
          const dot = document.createElement("button");
          dot.className = "hero-dot";
          dot.setAttribute("aria-label", `Go to teaser ${index + 1}`);
          dot.dataset.index = index;
          dot.addEventListener("click", () => centerCard(index, true));
          dotsWrap.appendChild(dot);
        });
      }

      function updateDots() {
        if (!dotsWrap) return;
        const dots = Array.from(dotsWrap.querySelectorAll(".hero-dot"));
        dots.forEach((dot, index) => {
          dot.classList.toggle("is-active", index === activeIndex);
        });
      }

      function getTrackCenter() {
        const rect = track.getBoundingClientRect();
        return rect.left + rect.width / 2;
      }

      function updateActiveCard() {
        const centerX = getTrackCenter();
        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - centerX);

          card.classList.remove("is-active", "is-near");

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        activeIndex = closestIndex;

        cards.forEach((card, index) => {
          if (index === activeIndex) {
            card.classList.add("is-active");
          } else if (Math.abs(index - activeIndex) === 1) {
            card.classList.add("is-near");
          }
        });

        updateDots();
      }

      function centerCard(index, smooth = true) {
        const card = cards[index];
        if (!card) return;

        const targetLeft =
          card.offsetLeft - track.clientWidth / 2 + card.clientWidth / 2;

        track.scrollTo({
          left: targetLeft,
          behavior: smooth ? "smooth" : "auto",
        });
      }

      function handleScroll() {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateActiveCard();
            ticking = false;
          });
          ticking = true;
        }
      }

      buildDots();

      cards.forEach((card, index) => {
        card.addEventListener("click", () => centerCard(index, true));
      });

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          centerCard(Math.max(0, activeIndex - 1), true);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          centerCard(Math.min(cards.length - 1, activeIndex + 1), true);
        });
      }

      track.addEventListener("scroll", handleScroll, { passive: true });

      let startX = 0;
      let endX = 0;

      track.addEventListener(
        "touchstart",
        (e) => {
          startX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );

      track.addEventListener(
        "touchend",
        (e) => {
          endX = e.changedTouches[0].clientX;
          const dx = endX - startX;

          if (Math.abs(dx) > 40) {
            if (dx < 0) {
              centerCard(Math.min(cards.length - 1, activeIndex + 1), true);
            } else {
              centerCard(Math.max(0, activeIndex - 1), true);
            }
          }
        },
        { passive: true }
      );

      setTimeout(() => {
        centerCard(0, false);
        updateActiveCard();
      }, 80);

      window.addEventListener("resize", () => {
        updateActiveCard();
        centerCard(activeIndex, false);
      });
    }
  }

  /* =========================
     NAVBAR ACTIVE TAB
  ========================= */
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
        rootMargin: "-35% 0px -45% 0px",
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