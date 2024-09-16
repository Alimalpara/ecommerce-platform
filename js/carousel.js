// Simple Image Carousel
document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;
  const nextBtn = document.querySelector(".carousel .next");
  const prevBtn = document.querySelector(".carousel .prev");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlideFunc() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlideFunc);
  }

  // Auto-slide
  setInterval(nextSlide, 5000);

  // Initialize
  showSlide(currentSlide);
});
