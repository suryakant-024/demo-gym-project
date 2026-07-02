// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Join Now / Get In Touch modal
const joinNowBtn = document.getElementById('joinNowBtn');
const joinModal = document.getElementById('joinModal');
const modalClose = document.getElementById('modalClose');
const modalFormWrap = document.getElementById('modalFormWrap');
const modalSuccess = document.getElementById('modalSuccess');
const modalSuccessClose = document.getElementById('modalSuccessClose');
const joinForm = document.getElementById('joinForm');

if (joinNowBtn && joinModal) {
  function openModal() {
    joinModal.classList.add('is-open');
    joinModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    joinModal.classList.remove('is-open');
    joinModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalFormWrap.hidden = false;
    modalSuccess.hidden = true;
  }

  joinNowBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modalSuccessClose.addEventListener('click', closeModal);

  joinModal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && joinModal.classList.contains('is-open')) closeModal();
  });

  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    modalFormWrap.hidden = true;
    modalSuccess.hidden = false;
    joinForm.reset();
  });
}

// Fade-up reveal on scroll, with staggered delay for card grids
const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right';

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = entry.target.parentElement.querySelectorAll(REVEAL_SELECTOR);
      const index = Array.from(siblings).indexOf(entry.target);

      setTimeout(() => entry.target.classList.add('is-visible'), index * 150);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => revealObserver.observe(el));

// Circular testimonials carousel
const testimonialsData = [
  {
    name: 'Daniel Reyes',
    role: 'Member Since 2023',
    quote:
      'Fit World completely changed how I train. The coaches actually pay attention, the equipment never feels crowded, and I have hit strength goals I never thought possible.',
  },
  {
    name: 'Priya Nair',
    role: 'Member Since 2022',
    quote:
      'The energy in this gym is unmatched. Between the functional training area and the group classes, every session feels different and I am never bored with my routine.',
  },
  {
    name: 'Marcus Webb',
    role: 'Member Since 2024',
    quote:
      'I joined for the cardio area and stayed for the community. The trainers push you just enough, and the results speak for themselves after only a few months.',
  },
];

const testimonialImages = document.querySelectorAll('#testimonialImages .testimonial-image');
const testimonialName = document.getElementById('testimonialName');
const testimonialRole = document.getElementById('testimonialRole');
const testimonialQuote = document.getElementById('testimonialQuote');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');

if (testimonialImages.length && testimonialName && testimonialQuote) {
  let activeIndex = 0;
  let autoplayId = null;
  const total = testimonialsData.length;
  const gap = 70;
  const stickUp = gap * 0.8;

  function imageTransform(index) {
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + total) % total === index;
    const isRight = (activeIndex + 1) % total === index;

    if (isActive) {
      return { zIndex: 3, opacity: 1, transform: 'translateX(0) translateY(0) scale(1) rotateY(0deg)' };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.85) rotateY(15deg)`,
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.85) rotateY(-15deg)`,
      };
    }
    return { zIndex: 1, opacity: 0, transform: 'translateY(0) scale(0.85)' };
  }

  function updateImages() {
    testimonialImages.forEach((img) => {
      const index = Number(img.dataset.index);
      const style = imageTransform(index);
      img.style.transition = 'all 0.8s cubic-bezier(.4,2,.3,1)';
      img.style.zIndex = style.zIndex;
      img.style.opacity = style.opacity;
      img.style.transform = style.transform;
      img.style.pointerEvents = style.opacity ? 'auto' : 'none';
    });
  }

  function renderQuote(text) {
    testimonialQuote.innerHTML = '';
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = `${word} `;
      span.style.animationDelay = `${i * 0.03}s`;
      testimonialQuote.appendChild(span);
    });
  }

  function renderTestimonial() {
    const t = testimonialsData[activeIndex];
    testimonialName.textContent = t.name;
    testimonialRole.textContent = t.role;
    renderQuote(t.quote);
    updateImages();
  }

  function startAutoplay() {
    autoplayId = setInterval(() => {
      activeIndex = (activeIndex + 1) % total;
      renderTestimonial();
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayId);
    startAutoplay();
  }

  function goNext() {
    activeIndex = (activeIndex + 1) % total;
    renderTestimonial();
    resetAutoplay();
  }

  function goPrev() {
    activeIndex = (activeIndex - 1 + total) % total;
    renderTestimonial();
    resetAutoplay();
  }

  testimonialPrev.addEventListener('click', goPrev);
  testimonialNext.addEventListener('click', goNext);

  renderTestimonial();
  startAutoplay();
}
