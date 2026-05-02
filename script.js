document.addEventListener('DOMContentLoaded', () => {

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

});

// SWIPER JS CAROUSEL
const swiper = new Swiper(".testimonial-swiper", {
  loop: true,
  centeredSlides: true,
  slidesPerView: 3,
  spaceBetween: 30,
  autoHeight: true,

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
      slidesPerView: 2
    },
    1010: {
      slidesPerView: 3
    }
  }
});

// Form validation
const form = document.getElementById('contactForm');

let timeoutId;

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const comment = document.getElementById('comment').value.trim();

  let valid = true;

  // Clear errors
  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('phoneError').textContent = '';
  document.getElementById('commentError').textContent = '';

  if (name === '') {
    document.getElementById('nameError').textContent = 'Full name is required';
    valid = false;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
  if (!email.match(emailPattern)) {
    document.getElementById('emailError').textContent = 'Enter a valid email';
    valid = false;
  }

  const phonePattern = /^[0-9+\-\s]{7,15}$/;
  if (!phone.match(phonePattern)) {
    document.getElementById('phoneError').textContent = 'Enter a valid phone number';
    valid = false;
  }

  if (comment === '') {
    document.getElementById('commentError').textContent = 'Comment is required';
    valid = false;
  }

  if (valid) {
    emailjs.send("service_vfukudp", "template_c58ztbn", {
      name: name,
      email: email,
      phone: phone,
      message: comment
    }).then(function(response) {

      const successMessage = document.getElementById('successMessage');
      successMessage.style.display = 'block';
      form.reset();

      // Auto hide after 5s
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);

    }, function(error) {
      alert("Failed to send message. Please try again.");
      console.error(error);
    });
  }
});