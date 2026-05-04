document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MODALS
  ========================== */
  function openModal(modal) {
    modal.classList.add('active');

    modal.querySelectorAll('.swiper, .carousel').forEach(carousel => {
      if (carousel.swiper) {
        carousel.swiper.update();
      }
    });
  }

  function closeModal(modal) {
    modal.classList.remove('active');
  }

  // Event delegation (more reliable)
  document.addEventListener('click', (e) => {

    // OPEN MODAL
    const openBtn = e.target.closest('[data-modal-target]');
    if (openBtn) {
      const modalId = openBtn.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) openModal(modal);
    }

    // CLOSE MODAL (button)
    if (e.target.closest('[data-modal-close]')) {
      const modal = e.target.closest('.modal');
      if (modal) closeModal(modal);
    }

    // CLOSE MODAL (outside click)
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });


  /* =========================
     SWIPER CAROUSEL
  ========================== */
  let swiper;

  if (typeof Swiper !== "undefined") {
    swiper = new Swiper(".testimonial-swiper", {
      loop: true,
      centeredSlides: true,
      slidesPerView: 3,
      spaceBetween: 30,
      autoHeight: window.innerWidth < 768,

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },

      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1010: { slidesPerView: 3 }
      }
    });

    function updateAutoHeight() {
      swiper.params.autoHeight = window.innerWidth < 768;
      swiper.updateAutoHeight();
    }

    window.addEventListener("resize", updateAutoHeight);
  }


  /* =========================
     FORM + EMAILJS
  ========================== */
  const form = document.getElementById('contactForm');
  let timeoutId;

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const comment = document.getElementById('comment').value.trim();

      const submitBtn = document.querySelector('.submit_btn');

      let valid = true;

      document.getElementById('nameError').textContent = '';
      document.getElementById('emailError').textContent = '';
      document.getElementById('phoneError').textContent = '';
      document.getElementById('commentError').textContent = '';

      if (!name) {
        document.getElementById('nameError').textContent = 'Full name is required';
        valid = false;
      }

      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
      if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email';
        valid = false;
      }

      const phonePattern = /^[0-9+\-\s]{7,15}$/;
      if (!phonePattern.test(phone)) {
        document.getElementById('phoneError').textContent = 'Enter a valid phone number';
        valid = false;
      }

      if (!comment) {
        document.getElementById('commentError').textContent = 'Comment is required';
        valid = false;
      }

      if (!valid) return;

      // UX improvement
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";

      const templateParams = {
        name,
        email,
        phone,
        message: comment
      };

      emailjs.send("service_vfukudp", "template_c58ztbn", templateParams)
        .then(() => {
          const successMessage = document.getElementById('successMessage');

          if (successMessage) {
            successMessage.style.display = 'block';
          }

          form.reset();

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (successMessage) {
              successMessage.style.display = 'none';
            }
          }, 5000);
        })
        .catch(err => {
          console.error(err);
          alert("Failed to send message. Please try again.");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit";
        });
    });
  }


  /* =========================
     SCROLL ANIMATION
  ========================== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('go');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(
    '.fadeInUp, .fadeInLeft, .fadeInRight, .fadeInDown, .zoomIn, .bounceIn, .fadeInUpShort'
  ).forEach(el => observer.observe(el));

  /* =========================
    DROPDOWN TOGGLE (CLICK)
  ========================== */
  document.querySelectorAll('.bnr_btns > li, .btm2_btns > li').forEach(li => {
    li.addEventListener('click', (e) => {
      e.stopPropagation();

      // close other open dropdowns
      document.querySelectorAll('.bnr_btns > li.active, .btm2_btns > li.active')
        .forEach(item => {
          if (item !== li) item.classList.remove('active');
        });

      // toggle current
      li.classList.toggle('active');
    });
  });

  // close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.bnr_btns > li.active, .btm2_btns > li.active')
      .forEach(item => item.classList.remove('active'));
  });

});