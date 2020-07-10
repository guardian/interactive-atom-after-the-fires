// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"

interactiveSecondary();

function interactiveSecondary() {
  let int;
  int = setInterval(() => {
    let keyEl = document.querySelector('.atf__wrapper .sheet');
    if (keyEl) {
      clearInterval(int);

      setScrollStatus();
      addSheetNav()
    }
  }, 200)
}

// --------------------------------
// Unlock .sheet_outer scroll at right moment
// --------------------------------
function setScrollStatus() {
  const atfWrapper = document.querySelector('.atf__wrapper');
  window.addEventListener('scroll', () => {
    const top = atfWrapper.getBoundingClientRect().top;
    if (top > 0) {
      document.body.dataset.scroll = 'top';
    } else {
      document.body.dataset.scroll = 'mid';
    }
  });
}


// --------------------------------
// Add secondary sheet nav elements
// --------------------------------
function addSheetNav() {

  const sheetAll = document.querySelectorAll('.sheet__outer');
  sheetAll.forEach((sheet) => {

    let navWrapper = document.createElement('div');
    navWrapper.classList.add('nav__wrapper');

    const prevEl = createNavEl(sheet.previousElementSibling);
    const nextEl = createNavEl(sheet.nextElementSibling);

    if (prevEl) {
      prevEl.classList.add('nav__prev');
      navWrapper.appendChild(prevEl);
      prevEl.addEventListener('click', (e) => {
        // navigate to previous here
        sheetStep(-1);
      })

    }
    if (nextEl) {
      nextEl.classList.add('nav__next');
      navWrapper.appendChild(nextEl);
      nextEl.addEventListener('click', (e) => {
        // navigate to next here
        sheetStep(1);
      })
    }

    sheet.querySelector('.sheet__inner').appendChild(navWrapper);
  });

}

function createNavEl(el) {
  if (!el) {
    return false;
  }

  let navEl = document.createElement('div');
  navEl.classList.add('nav__el');

  // Add title
  const title = el.querySelector('h2').innerText;
  let titleEl = document.createElement('div');
  titleEl.classList.add('nav__title');
  titleEl.innerText = title;
  navEl.appendChild(titleEl)

  // Add image
  const mainImage = el.querySelector('.element-image.element--immersive') || el.querySelector('.element-image.element--showcase');
  if (mainImage) {
    navEl.appendChild(mainImage.cloneNode(true));
  }

  return navEl;

}


// ----------
// Navigation
// ----------
function sheetStep(direction=1) {
  updateNextPrevPeek(direction);

  const wrapperEl = document.querySelector('.atf__wrapper');
  const scrollX = wrapperEl.scrollLeft;
  const scrollTarget = scrollX + (window.innerWidth * direction);
  scrollTo(wrapperEl, scrollTarget);
}


function updateNextPrevPeek(direction=1) {
  const wrapperEl = document.querySelector('.atf__wrapper');
  const currentIndex = parseInt(wrapperEl.dataset.currentSheet);
  const newIndex = currentIndex + direction;

  wrapperEl.dataset.currentSheet = newIndex;
  movePrevNextClass(wrapperEl, (newIndex - 1), 'is-prev');
  movePrevNextClass(wrapperEl, (newIndex + 1), 'is-next');

}

function movePrevNextClass(wrapper, index, className) {

  const sheetEl = wrapper.querySelector(`[data-index='${index}']`);
  const oldSheetEl = wrapper.querySelector(`.${className}`);

  if (oldSheetEl && oldSheetEl != sheetEl) {
    oldSheetEl.classList.remove(className);
  }
  if (sheetEl) {
    sheetEl.classList.add(className);
  }

}

function scrollTo(element, to) {
  let duration = 600;
  const start = (element && element.scrollLeft) || 0,
    change = to - start,
    increment = 20;
  let currentTime = 0;

  // duration = Math.max(600, (Math.sqrt(Math.abs(change)) * 4));

  const animateScroll = function () {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTo(val, 0);
    if (currentTime < duration) {
      window.setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}


Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
