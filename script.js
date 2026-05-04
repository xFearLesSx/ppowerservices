document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     LOAD MODALS VIA FETCH
  ========================== */
  const modalContainer = document.getElementById("modal-container");

  const loadModal = (url) => {
    return fetch(url)
      .then(res => res.text())
      .then(html => {
        modalContainer.insertAdjacentHTML("beforeend", html);
      });
  };

  const modalsLoaded = Promise.all([
    loadModal("modals/privacy.html"),
    loadModal("modals/jurisdiction.html"),
    loadModal("modals/disclaimer.html"),
    loadModal("modals/modal4.html")
  ]);

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

  function bindModalEvents() {
    const triggers = document.querySelectorAll('[data-modal-target]');
    const closes = document.querySelectorAll('[data-modal-close]');

    triggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        if (modal) openModal(modal);
      });
    });

    closes.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) closeModal(modal);
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal(e.target);
      }
    });
  }

  modalsLoaded.then(() => {
    bindModalEvents();
  });


  /* =========================
     SWIPER CAROUSEL
  ========================== */
  const swiper = new Swiper(".testimonial-swiper", {
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

      // 1️⃣ Send to ADMIN
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

});