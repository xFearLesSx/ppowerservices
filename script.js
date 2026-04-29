document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // MODAL SYSTEM
  // =========================
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);

      if (!modal) return;

      modal.classList.add('active');

      modal.querySelectorAll('.carousel').forEach(carousel => {
        carousel.__instance?.updatePosition();
      });
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.classList.remove('active');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });


  // =========================
  // CAROUSEL CLASS (FIXED)
  // =========================
  class Carousel {
    constructor(element, options = {}) {
      this.carousel = element;
      this.track = element.querySelector('.carousel-track');
      this.originalSlides = Array.from(this.track.children);

      this.nextBtn = element.querySelector('.next');
      this.prevBtn = element.querySelector('.prev');
      this.dotsContainer = element.querySelector('.dots');

      this.slidesToShow = 3;
      this.totalSlides = this.originalSlides.length;

      this.isStatic = this.totalSlides <= this.slidesToShow;

      this.currentIndex = this.slidesToShow;
      this.interval = null;
      this.startX = 0;

      this.settings = {
        autoplay: options.autoplay ?? true,
        delay: options.delay ?? 3000
      };

      this.init();
    }

    init() {
      if (!this.track || this.totalSlides === 0) return;

      if (this.isStatic) {
        this.disableControls();
        return;
      }

      this.cloneSlides();
      this.createDots();
      this.bindEvents();

      this.setSizes();
      this.updatePosition();

      if (this.settings.autoplay) {
        this.startAutoplay();
      }
    }

    // =========================
    // FIX: ensure correct sizing
    // =========================
    setSizes() {
      this.slideWidth = this.track.offsetWidth / this.slidesToShow;
    }

    disableControls() {
      this.nextBtn && (this.nextBtn.style.display = 'none');
      this.prevBtn && (this.prevBtn.style.display = 'none');

      if (this.dotsContainer) {
        this.dotsContainer.style.display = 'none';
      }

      this.track.style.transform = 'translateX(0)';
    }

    cloneSlides() {
      const clonesBefore = [];
      const clonesAfter = [];

      for (let i = 0; i < this.slidesToShow; i++) {
        clonesBefore.push(
          this.originalSlides[this.originalSlides.length - 1 - i].cloneNode(true)
        );
        clonesAfter.push(this.originalSlides[i].cloneNode(true));
      }

      clonesBefore.reverse().forEach(clone => {
        this.track.insertBefore(clone, this.track.firstChild);
      });

      clonesAfter.forEach(clone => {
        this.track.appendChild(clone);
      });

      this.slides = Array.from(this.track.children);

      this.startIndex = this.slidesToShow;
      this.endIndex = this.slides.length - this.slidesToShow;
    }

    createDots() {
      if (!this.dotsContainer) return;

      this.originalSlides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');

        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
          this.currentIndex = i + this.slidesToShow;
          this.updateSlide();
        });

        this.dotsContainer.appendChild(dot);
      });
    }

    updateDots() {
      if (!this.dotsContainer) return;

      const dots = this.dotsContainer.querySelectorAll('.dot');
      dots.forEach(dot => dot.classList.remove('active'));

      let index = this.currentIndex - this.slidesToShow;

      if (index >= this.totalSlides) index = 0;
      if (index < 0) index = this.totalSlides - 1;

      dots[index]?.classList.add('active');
    }

    // =========================
    // FIX: pixel-based movement
    // =========================
    updatePosition() {
      this.track.style.transform =
        `translateX(-${this.currentIndex * this.slideWidth}px)`;
    }

    updateSlide() {
      this.track.style.transition = 'transform 0.4s ease-in-out';
      this.updatePosition();
      this.updateDots();
    }

    next() {
      this.currentIndex++;
      this.updateSlide();
    }

    prev() {
      this.currentIndex--;
      this.updateSlide();
    }

    // =========================
    // FIXED LOOP LOGIC
    // =========================
    handleLoop() {
      if (this.currentIndex >= this.endIndex) {
        this.track.style.transition = 'none';
        this.currentIndex = this.startIndex;
        this.updatePosition();
      }

      if (this.currentIndex < this.startIndex) {
        this.track.style.transition = 'none';
        this.currentIndex = this.endIndex - 1;
        this.updatePosition();
      }
    }

    startAutoplay() {
      // optional
      // this.interval = setInterval(() => this.next(), this.settings.delay);
    }

    stopAutoplay() {
      clearInterval(this.interval);
    }

    handleSwipeStart(x) {
      this.startX = x;
    }

    handleSwipeEnd(x) {
      const diff = x - this.startX;

      if (diff > 50) this.prev();
      if (diff < -50) this.next();
    }

    bindEvents() {
      this.nextBtn?.addEventListener('click', () => this.next());
      this.prevBtn?.addEventListener('click', () => this.prev());

      this.track.addEventListener('transitionend', () => this.handleLoop());

      this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      this.carousel.addEventListener('mouseleave', () => {
        if (this.settings.autoplay) this.startAutoplay();
      });

      this.track.addEventListener('touchstart', e =>
        this.handleSwipeStart(e.touches[0].clientX)
      );

      this.track.addEventListener('touchend', e =>
        this.handleSwipeEnd(e.changedTouches[0].clientX)
      );

      this.track.addEventListener('mousedown', e =>
        this.handleSwipeStart(e.clientX)
      );

      this.track.addEventListener('mouseup', e =>
        this.handleSwipeEnd(e.clientX)
      );

      // recompute on resize
      window.addEventListener('resize', () => {
        this.setSizes();
        this.updatePosition();
      });
    }
  }


  // =========================
  // INIT ALL CAROUSELS
  // =========================
  document.querySelectorAll('.carousel').forEach(carouselEl => {
    const instance = new Carousel(carouselEl, {
      autoplay: true,
      delay: 4000
    });

    carouselEl.__instance = instance;
  });

});

// SWIPER JS CAROUSEL
const swiper = new Swiper(".testimonial-swiper", {
  loop: true,
  centeredSlides: true,
  slidesPerView: 3, // 👈 exactly 3 visible
  spaceBetween: 30,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },

  breakpoints: {
    0: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 3
    }
  }
});