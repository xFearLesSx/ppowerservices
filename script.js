const modalTriggers = document.querySelectorAll('[data-modal-target]');
const closeButtons = document.querySelectorAll('[data-modal-close]');

// Open modal
modalTriggers.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal-target');
    document.getElementById(modalId).classList.add('active');
  });
});

// Close modal (X button)
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').classList.remove('active');
  });
});

// Close on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});