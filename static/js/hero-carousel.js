document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("heroCarousel");
  const dotsWrap = document.getElementById("heroDots");
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll(".hero-carousel-card"));
  const dots = Array.from(dotsWrap.querySelectorAll(".hero-dot"));

  let activeIndex = 0;

  function applyClasses() {
    const total = cards.length;

    cards.forEach((card, index) => {
      card.classList.remove("is-active", "is-left", "is-right", "is-hidden-left", "is-hidden-right");

      if (index === activeIndex) {
        card.classList.add("is-active");
      } else if (index === (activeIndex - 1 + total) % total) {
        card.classList.add("is-left");
      } else if (index === (activeIndex + 1) % total) {
        card.classList.add("is-right");
      } else if (index < activeIndex) {
        card.classList.add("is-hidden-left");
      } else {
        card.classList.add("is-hidden-right");
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }

  function goTo(index) {
    activeIndex = (index + cards.length) % cards.length;
    applyClasses();
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      goTo(index);
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
    });
  });

  let startX = 0;
  let endX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const dx = endX - startX;

    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        goTo(activeIndex + 1);
      } else {
        goTo(activeIndex - 1);
      }
    }
  }, { passive: true });

  let wheelLocked = false;
  track.addEventListener("wheel", (e) => {
    if (wheelLocked) return;
    if (Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return;

    wheelLocked = true;

    if (e.deltaY > 0 || e.deltaX > 0) {
      goTo(activeIndex + 1);
    } else {
      goTo(activeIndex - 1);
    }

    setTimeout(() => {
      wheelLocked = false;
    }, 350);
  }, { passive: true });

  applyClasses();
});