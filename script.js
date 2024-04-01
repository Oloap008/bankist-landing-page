'use strict';

///////////////////////////////////////
// Elements

const scrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);

const header = document.querySelector(`.header`);

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector(`.nav`);
const navLinksEl = document.querySelector(`.nav__links`);

const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`)

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scroll button

scrollTo.addEventListener(`click`, function(){
  section1.scrollIntoView({behavior: "smooth"});
});

// Scroll Links

navLinksEl.addEventListener(`click`, function(e){
  e.preventDefault();
  if(e.target.classList.contains(`nav__link`)){
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior:"smooth" });
  };
});

// Hover links 

const handleHover = function(e){
  if(e.target.classList.contains(`nav__link`)){
    const link = e.target;
    const logo = nav.querySelector('.nav__logo');
    const siblings = nav.querySelectorAll(`.nav__link`)
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    })
    logo.style.opacity =  this;
  };
}

nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

// Tabbed Component

tabsContainer.addEventListener(`click`, function(e){
  const button = e.target.closest(`.operations__tab`);
  
  if(!button) return;

  const siblingButtons = [...tabsContainer.children];
  siblingButtons.forEach(btn => btn.classList.remove(`operations__tab--active`));

  button.classList.add(`operations__tab--active`);

  tabsContent.forEach(tab => tab.classList.remove(`operations__content--active`));

  document
    .querySelector(`.operations__content--${button.dataset.tab}`)
    .classList.add(`operations__content--active`);
})

// Sticky nav

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;

  if(!entry.isIntersecting){
    nav.classList.add(`sticky`);
  } else {
    nav.classList.remove(`sticky`);
  };
};

const observer = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
})

observer.observe(header);

// Revealing Elements

const sections = document.querySelectorAll(`.section`);

const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(entry.isIntersecting){
    entry.target.classList.remove(`section--hidden`);

    observer.unobserve(entry.target);
  };
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  // section.classList.add(`section--hidden`)
  sectionObserver.observe(section);
})

// Lazy Loading Images

const lazyImages = document.querySelectorAll(`img[data-src]`);

const loadImage = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, () =>  {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

lazyImages.forEach(img => {
  imageObserver.observe(img);
})

// Slider 
const slider = function() {
  let currSlide = 0
  
  const slides = document.querySelectorAll(`.slide`);
  const sliderBtnRight = document.querySelector(`.slider__btn--right`);
  const sliderBtnLeft = document.querySelector(`.slider__btn--left`);
  const dotsContainer = document.querySelector(`.dots`);
  
  const changeSlide = function(currSlide){
    slides.forEach((slide, i) => slide.style.transform = `translateX(${(i - currSlide)  * 100}%)`)
  }
  
  const createDots = function() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        `beforeend`,
        `<div class="dots__dot" data-slide="${i}"></div>`
      )
    })
  }
  
  const activeDot = function(currSlide){
    document.querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));
      
    document.querySelector(`.dots__dot[data-slide="${currSlide}"]`)
      .classList.add(`dots__dot--active`);
  }
  
  const nextSlide = function() {
    if(currSlide === (slides.length - 1)){
      currSlide = 0;
    } else {
      currSlide++;
    }
  
    changeSlide(currSlide);
    activeDot(currSlide);
  };
  
  const prevSlide = function(){
    if(currSlide === 0){
      currSlide = slides.length - 1;
    } else {
      currSlide--;
    }
  
    changeSlide(currSlide);
    activeDot(currSlide);
  };
  
  const init = function() {
    createDots();
    activeDot(0);
  
    changeSlide(0);
  }
  
  init();
  
  sliderBtnRight.addEventListener(`click`, nextSlide);
  
  sliderBtnLeft.addEventListener(`click`, prevSlide);
  
  document.addEventListener(`keydown`, function(e){
    e.key === `ArrowRight` && nextSlide();
    e.key === `ArrowLeft` && prevSlide();
  });
  
  dotsContainer.addEventListener(`click`, function(e){
    const { slide } = e.target.classList.contains(`dots__dot`) && e.target.dataset;
  
    if(!slide) return;
  
    changeSlide(slide);
    activeDot(slide);
  })
};

slider();