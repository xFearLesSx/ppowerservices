document.addEventListener('DOMContentLoaded', async () => {

  /* =========================
     LOAD MODALS (FIRST)
  ========================== */
  const container = document.getElementById("modal-container");

  if (container) {
    try {
      const res = await fetch("modals.html");
      const html = await res.text();
      container.innerHTML = html;
    } catch (err) {
      console.error("Failed to load modals:", err);
    }
  }

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

    window.addEventListener("resize", () => {
      swiper.params.autoHeight = window.innerWidth < 768;
      swiper.updateAutoHeight();
    });
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

      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";

      emailjs.send("service_vfukudp", "template_c58ztbn", {
        name,
        email,
        phone,
        message: comment
      })
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
        alert("Failed to send message.");
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
     GLOBAL CLICK HANDLER
  ========================== */
  document.addEventListener("click", (e) => {

    /* ===== OPEN MODAL ===== */
    const modalTrigger = e.target.closest("[data-modal]");
    if (modalTrigger) {
      e.preventDefault();

      const modal = document.getElementById(modalTrigger.dataset.modal);
      if (modal) modal.classList.add("active");

      // close dropdowns
      document.querySelectorAll(".bnr_btns > li, .btm2_btns > li")
        .forEach(i => i.classList.remove("active"));

      return;
    }

    /* ===== CLOSE MODAL (X) ===== */
    const closeBtn = e.target.closest(".modal .close");
    if (closeBtn) {
      closeBtn.closest(".modal").classList.remove("active");
      return;
    }

    /* ===== CLOSE MODAL OUTSIDE ===== */
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("active");
      return;
    }

    /* ===== DROPDOWN TOGGLE ===== */
    const trigger = e.target.closest(".bnr_btns > li > a, .btm2_btns > li > a");
    if (trigger && !trigger.hasAttribute("data-modal")) {
      e.preventDefault();
      e.stopPropagation();

      const li = trigger.parentElement;

      document.querySelectorAll(".bnr_btns > li, .btm2_btns > li")
        .forEach(i => {
          if (i !== li) i.classList.remove("active");
        });

      li.classList.toggle("active");
      return;
    }

    /* ===== CLOSE DROPDOWNS ===== */
    document.querySelectorAll(".bnr_btns > li, .btm2_btns > li")
      .forEach(i => i.classList.remove("active"));

  });

});