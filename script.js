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

      // Fix carousel layout inside modal
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
  // CAROUSEL CLASS (3 PER VIEW)
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

      // 🔥 STATIC MODE (no sliding needed)
      if (this.isStatic) {
        this.disableControls();
        return;
      }

      this.cloneSlides();
      this.createDots();
      this.bindEvents();
      this.updatePosition();

      if (this.settings.autoplay) {
        this.startAutoplay();
      }
    }

    disableControls() {
      // hide buttons
      this.nextBtn && (this.nextBtn.style.display = 'none');
      this.prevBtn && (this.prevBtn.style.display = 'none');

      // hide dots
      if (this.dotsContainer) {
        this.dotsContainer.style.display = 'none';
      }

      // reset transform (no sliding)
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

    updatePosition() {
      this.track.style.transform =
        `translateX(-${(this.currentIndex * 100) / this.slidesToShow}%)`;
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

    handleLoop() {
      if (this.currentIndex >= this.slides.length - this.slidesToShow) {
        this.track.style.transition = 'none';
        this.currentIndex = this.slidesToShow;
        this.updatePosition();
      }

      if (this.currentIndex < this.slidesToShow) {
        this.track.style.transition = 'none';
        this.currentIndex =
          this.slides.length - (this.slidesToShow * 2);
        this.updatePosition();
      }
    }

    startAutoplay() {
      this.interval = setInterval(() => this.next(), this.settings.delay);
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

      // Touch
      this.track.addEventListener('touchstart', e =>
        this.handleSwipeStart(e.touches[0].clientX)
      );

      this.track.addEventListener('touchend', e =>
        this.handleSwipeEnd(e.changedTouches[0].clientX)
      );

      // Mouse
      this.track.addEventListener('mousedown', e =>
        this.handleSwipeStart(e.clientX)
      );

      this.track.addEventListener('mouseup', e =>
        this.handleSwipeEnd(e.clientX)
      );
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

    // store instance (for modal fix)
    carouselEl.__instance = instance;
  });

});