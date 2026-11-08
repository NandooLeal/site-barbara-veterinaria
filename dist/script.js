/* Menu para celular. Os links de contato também funcionam sem JavaScript. */
document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navegacao");

if (menuButton && navigation) {
  menuButton.hidden = false;

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const year = document.querySelector("#ano");
if (year) year.textContent = new Date().getFullYear();

const photoCarousel = document.querySelector(".photo-carousel");

if (photoCarousel) {
  const photos = photoCarousel.querySelectorAll(".carousel-photo");
  const controls = photoCarousel.querySelector(".photo-controls");
  const previousButton = photoCarousel.querySelector(".photo-prev");
  const nextButton = photoCarousel.querySelector(".photo-next");
  const counter = photoCarousel.querySelector(".photo-count");

  let currentPhoto = 0;

  function changePhoto(direction) {
    currentPhoto =
      (currentPhoto + direction + photos.length) % photos.length;

    photos.forEach((photo, index) => {
      const isActive = index === currentPhoto;

      photo.classList.toggle("is-active", isActive);
      photo.setAttribute("aria-hidden", String(!isActive));
    });

    if (counter) counter.textContent = `${currentPhoto + 1} / ${photos.length}`;
  }

  if (photos.length > 0) {
    changePhoto(0);
  }

  if (controls) controls.hidden = photos.length < 2;

  if (photos.length > 1) {
    previousButton?.addEventListener("click", () => changePhoto(-1));
    nextButton?.addEventListener("click", () => changePhoto(1));

    photoCarousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        changePhoto(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        changePhoto(1);
      }
    });
  }
}

/* Coração e patinhas: movimento suave, proporcional à rolagem da página. */
(() => {
  const ornament = document.querySelector(".scroll-paw");
  if (!ornament) return;

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let animationFrame = 0;
  let currentProgress = null;

  function renderOrnament() {
    animationFrame = 0;
    if (motionPreference.matches) return;

    const viewportHeight = window.innerHeight;
    const scrollableHeight =
      document.documentElement.scrollHeight - viewportHeight;

    const targetProgress = scrollableHeight > 0
      ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
      : 0;

    // A interpolação suaviza também saltos maiores de rolagem.
    currentProgress = currentProgress === null
      ? targetProgress
      : currentProgress + (targetProgress - currentProgress) * 0.14;

    if (Math.abs(targetProgress - currentProgress) < 0.0005) {
      currentProgress = targetProgress;
    }

    const ornamentHeight = ornament.offsetHeight;
    const availableSpace = Math.max(0, viewportHeight - ornamentHeight);
    const margin = Math.min(24, availableSpace / 2);
    const bottomPosition = Math.max(margin, availableSpace - margin);
    const topPosition = Math.min(viewportHeight * 0.18, bottomPosition);

    const verticalPosition = topPosition
      + (bottomPosition - topPosition) * currentProgress;

    // O deslocamento lateral fica voltado para dentro da tela.
    const horizontalPosition = -Math.pow(
      Math.sin(currentProgress * Math.PI * 2), 2
    ) * 8;
    const rotation = Math.sin(currentProgress * Math.PI * 3) * 12;

    ornament.style.transform =
      `translate3d(${horizontalPosition}px, ${verticalPosition}px, 0) `
      + `rotate(${rotation}deg)`;

    ornament.classList.add("is-ready");

    // Só mantém a animação enquanto a posição estiver se ajustando.
    if (currentProgress !== targetProgress) scheduleOrnament();
  }

  function scheduleOrnament() {
    if (motionPreference.matches || animationFrame) return;
    animationFrame = window.requestAnimationFrame(renderOrnament);
  }

  function applyMotionPreference() {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    currentProgress = null;

    window.removeEventListener("scroll", scheduleOrnament);
    ornament.classList.remove("is-ready");

    if (!motionPreference.matches) {
      window.addEventListener("scroll", scheduleOrnament, { passive: true });
      scheduleOrnament();
    }
  }

  window.addEventListener("resize", scheduleOrnament);
  window.addEventListener("load", scheduleOrnament);
  window.addEventListener("pageshow", scheduleOrnament);
  motionPreference.addEventListener("change", applyMotionPreference);

  applyMotionPreference();
})();
