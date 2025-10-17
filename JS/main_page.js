document.addEventListener('DOMContentLoaded', function() {
    console.log('Slider with dots functionality loaded');
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000;

    function goToSlide(n) {
        console.log('Going to slide:', n);
        
        // Скрываем текущий слайд
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Останавливаем видео если есть
        const currentVideo = slides[currentSlide].querySelector('.slider-video');
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }
        
        // Обновляем текущий слайд
        currentSlide = (n + slides.length) % slides.length;
        
        // Показываем новый слайд
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Запускаем видео если есть
        const newVideo = slides[currentSlide].querySelector('.slider-video');
        if (newVideo) {
            newVideo.play().catch(e => {
                console.log('Video play error:', e);
            });
        }
    }

    // Следующий слайд
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Предыдущий слайд
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Запуск автоматического переключения
    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    // Остановка автоматического переключения
    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Инициализация слайдера
    function initSlider() {
        console.log('Initializing slider with', slides.length, 'slides and', dots.length, 'dots');
        
        // ОБРАБОТКА КЛИКОВ ПО ТОЧКАМ
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Dot clicked:', index);
                stopSlideShow();
                goToSlide(index);
                startSlideShow();
            });
        });
        
        // Кнопки "назад" и "вперед"
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Prev button clicked');
                stopSlideShow();
                prevSlide();
                startSlideShow();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                stopSlideShow();
                nextSlide();
                startSlideShow();
            });
        }
        
        
        startSlideShow();
    }


    initSlider();
});