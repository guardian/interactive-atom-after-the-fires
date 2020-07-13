// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"

interactiveSecondary();

function interactiveSecondary() {
  let int;
  int = setInterval(() => {
    let keyEl = document.querySelector('.atf__wrapper .sheet');
    if (keyEl) {
      clearInterval(int);

      unlockScroll();
      addNav()
    }
  }, 200)
}


// --------------------------------
// Unlock .sheet_outer scroll at right moment
// --------------------------------
function unlockScroll() {
  const atfWrapper = document.querySelector('.atf__wrapper');
  setScrollStatus(atfWrapper);
  window.addEventListener('scroll', () => {
    setScrollStatus(atfWrapper);
  });
}

function setScrollStatus(atfWrapper) {
  const top = atfWrapper.getBoundingClientRect().top;
  if (top > 0) {
    document.body.dataset.scroll = 'top';
  } else {
    document.body.dataset.scroll = 'mid';
  }
}


// --------------------------------
// Add secondary sheet nav elements
// --------------------------------
function addNav() {
  addSheetNav();
  addPeekNav();
}

function addPeekNav() {
  document.querySelectorAll('.sheet__outer').forEach((sheet) => {
    let prevPeek = sheet.querySelector('.sheet__peek-nav__prev');
    let nextPeek = sheet.querySelector('.sheet__peek-nav__next');

    prevPeek.addEventListener('click', () => {
      sheetStep(-1);
      resetSheetScroll(sheet);
    })
    nextPeek.addEventListener('click', () => {
      sheetStep(1);
      resetSheetScroll(sheet);
    })
  })
}

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
        resetSheetScroll(sheet);
      })

    }
    if (nextEl) {
      nextEl.classList.add('nav__next');
      navWrapper.appendChild(nextEl);
      nextEl.addEventListener('click', (e) => {
        // navigate to next here
        sheetStep(1);
        resetSheetScroll(sheet);
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
function sheetStep(direction = 1) {
  updateNextPrevPeek(direction);

  const wrapperEl = document.querySelector('.atf__wrapper');
  const scrollX = wrapperEl.scrollLeft;
  const scrollTarget = scrollX + (window.innerWidth * direction);
  smoothScroll(wrapperEl, scrollTarget);
}


function updateNextPrevPeek(direction = 1) {
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

function smoothScroll(element, to, axis = 'horizontal', duration = 600, delay = 0) {
  let start = 0;
  if (axis == 'horizontal') {
    start = (element && element.scrollLeft) || 0;
  } else {
    start = (element && element.scrollTop) || 0;
  }
  const change = to - start,
    increment = 20;
  let currentTime = 0;

  const animateScroll = function () {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    if (axis == 'horizontal') {
      element.scrollTo(val, 0);
    } else {
      element.scrollTo(0, val);
    }
    if (currentTime < duration) {
      window.setTimeout(animateScroll, increment);
    }
  };
  setTimeout(function () {
    animateScroll();
  }, delay)

}


function resetSheetScroll(sheet) {
  smoothScroll(sheet, 0, 'vertical', 800, 400);
}

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
