document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("heroCarousel");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".hero-carousel-card"));
  if (!cards.length) return;

  function updateActiveCard() {
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;
    let secondClosestCard = null;
    let secondClosestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - trackCenter);

      card.classList.remove("is-active", "is-near");

      if (distance < closestDistance) {
        secondClosestDistance = closestDistance;
        secondClosestCard = closestCard;
        closestDistance = distance;
        closestCard = card;
      } else if (distance < secondClosestDistance) {
        secondClosestDistance = distance;
        secondClosestCard = card;
      }
    });

    if (closestCard) {
      closestCard.classList.add("is-active");
    }

    cards.forEach((card) => {
      if (card === closestCard) return;

      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - trackCenter);

      if (distance < trackRect.width * 0.42) {
        card.classList.add("is-near");
      }
    });
  }

  let ticking = false;

  function onScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveCard();
        ticking = false;
      });
      ticking = true;
    }
  }

  track.addEventListener("scroll", onScrollUpdate, { passive: true });
  window.addEventListener("resize", updateActiveCard);

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const left = card.offsetLeft - (track.clientWidth / 2) + (card.clientWidth / 2);
      track.scrollTo({ left, behavior: "smooth" });
    });
  });

  setTimeout(updateActiveCard, 100);
});