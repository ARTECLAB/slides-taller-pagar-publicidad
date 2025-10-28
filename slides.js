// ===================================
//  NAVEGACIÓN DE SLIDES - CURSO
//  Sistema de presentaciones
// ===================================

class SlideShow {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.init();
  }

  init() {
    // Mostrar primer slide
    this.showSlide(0);
    
    // Event listeners
    this.setupEventListeners();
    
    // Actualizar contador
    this.updateCounter();
    
    // Deshabilitar botones según corresponda
    this.updateButtons();
  }

  setupEventListeners() {
    // Botones de navegación
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.previousSlide();
      } else if (e.key === 'Home') {
        this.goToSlide(0);
      } else if (e.key === 'End') {
        this.goToSlide(this.totalSlides - 1);
      }
    });
    
    // Touch swipe para móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        this.nextSlide();
      }
      if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        this.previousSlide();
      }
    };
    
    this.handleSwipe = handleSwipe;
  }

  showSlide(index) {
    // Ocultar todos los slides
    this.slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Mostrar slide actual
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
      this.currentSlide = index;
    }
    
    this.updateCounter();
    this.updateButtons();
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.showSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
    }
  }

  updateCounter() {
    const counter = document.getElementById('slideCounter');
    if (counter) {
      counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }
  }

  updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentSlide === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const slideShow = new SlideShow();
  
  // Hacer disponible globalmente para debugging
  window.slideShow = slideShow;
  
  // Prevenir zoom en mobile con doble tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
});

// Función auxiliar para crear índice de navegación (opcional)
function createSlideIndex() {
  const slides = document.querySelectorAll('.slide');
  const indexContainer = document.createElement('div');
  indexContainer.className = 'slide-index';
  indexContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    gap: 5px;
  `;
  
  slides.forEach((slide, index) => {
    const dot = document.createElement('div');
    dot.className = 'index-dot';
    dot.style.cssText = `
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ccc;
      cursor: pointer;
      transition: all 0.3s;
    `;
    
    dot.addEventListener('click', () => {
      window.slideShow.goToSlide(index);
    });
    
    if (index === 0) {
      dot.style.background = '#2563eb';
      dot.style.width = '12px';
      dot.style.height = '12px';
    }
    
    indexContainer.appendChild(dot);
  });
  
  document.body.appendChild(indexContainer);
  
  // Actualizar dots activos
  const originalShowSlide = window.slideShow.showSlide.bind(window.slideShow);
  window.slideShow.showSlide = function(index) {
    originalShowSlide(index);
    const dots = document.querySelectorAll('.index-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.style.background = '#2563eb';
        dot.style.width = '12px';
        dot.style.height = '12px';
      } else {
        dot.style.background = '#ccc';
        dot.style.width = '10px';
        dot.style.height = '10px';
      }
    });
  };
}

// Modo presentación (pantalla completa)
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Atajos de teclado adicionales
document.addEventListener('keydown', (e) => {
  // F para fullscreen
  if (e.key === 'f' || e.key === 'F') {
    toggleFullScreen();
  }
  
  // Escape para salir de fullscreen
  if (e.key === 'Escape' && document.fullscreenElement) {
    document.exitFullscreen();
  }
});