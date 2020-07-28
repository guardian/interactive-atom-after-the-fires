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
      addNav();

      addEpic();

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
  document.querySelectorAll('.sheet__outer').forEach((s) => {
    s.addEventListener('scroll', () => {
      setScrollStatus(atfWrapper);
    });
  })
}

function setScrollStatus(atfWrapper) {
  const top = atfWrapper.getBoundingClientRect().top;
  const sheet = atfWrapper.querySelector('.sheet__outer.is-current');
  if (top > 0) {
    document.body.dataset.scroll = 'top';
    if (sheet && sheet.scrollTop !== 0) {
      resetSheetScroll(sheet);
    }
  } else {
    if (sheet && sheet.scrollTop == 0) {
      document.body.dataset.scroll = 'mid';
    } else {
      document.body.dataset.scroll = 'low';
    }
  }
}


// --------------------------------
// Add secondary sheet nav elements
// --------------------------------
function addNav() {
  addSheetNav();
  addPeekNav();
  addAutoNext();
  addPeekHover();
  addKeyboardNav();
}

function addPeekNav() {
  document.querySelectorAll('.sheet__outer').forEach((sheet) => {
    let prevPeek = sheet.querySelector('.sheet__peek-nav__prev');
    let nextPeek = sheet.querySelector('.sheet__peek-nav__next');

    prevPeek.addEventListener('click', () => {
      initiateNav(sheet, -1);
    })
    nextPeek.addEventListener('click', () => {
      initiateNav(sheet, 1);
    })
  })
}

function initiateNav(sheet, direction) {
  if (!document.body.classList.contains('will-navigate')) {
    document.body.classList.add('will-navigate');
    sheetStep(direction);
    resetSheetScroll(sheet);
  }
}

function registerNavEnd() {
  document.body.classList.remove('will-navigate');
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
        initiateNav(sheet, -1);
      })

    }
    if (nextEl) {
      nextEl.classList.add('nav__next');
      navWrapper.appendChild(nextEl);
      nextEl.addEventListener('click', (e) => {
        initiateNav(sheet, 1);
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

function addAutoNext() {
  document.querySelectorAll('.sheet__outer').forEach((sheet) => {
    sheet.addEventListener('scroll', throttle((e) => {
      const height = sheet.scrollHeight - window.innerHeight;
      const scroll = sheet.scrollTop;
      const lastPageStart = height - window.innerHeight;
      const pastLastPage = (scroll - lastPageStart);
      const lastPageRatio = Math.max(0, pastLastPage / window.innerHeight);

      if (lastPageRatio > 0.9) {
        if (sheet.dataset.autoNav !== 'trigger') {
          sheet.dataset.autoNav = 'trigger';
          triggerAutoNav(sheet);
        }
      } else if (lastPageRatio > .7) {
        sheet.dataset.autoNav = 'nearly';
      } else if (lastPageRatio > 0.2) {
        sheet.dataset.autoNav = 'start';
      } else {
        sheet.dataset.autoNav = 'base';
      }

    }), 1000);
  })
}

function triggerAutoNav(sheet) {
  if (sheet.nextElementSibling) {
    initiateNav(sheet, 1);
  }
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
  movePrevNextClass(wrapperEl, (newIndex), 'is-current');

}

function addPeekHover() {
  document.querySelectorAll('.sheet__peek-nav__prev').forEach((el) => {
    peekHover(el, 'is-prev');
  })
  document.querySelectorAll('.sheet__peek-nav__next').forEach((el) => {
    peekHover(el, 'is-next');
  })
}

function peekHover(el, className) {
  el.addEventListener('mouseover', () => {
    const peekee = document.querySelector(`.${className}`);
    if (peekee) {
      peekee.classList.add('peek-hover');
    }
  });
  el.addEventListener('mouseleave', () => {
    const peekee = document.querySelector(`.${className}`);
    if (peekee) {
      peekee.classList.remove('peek-hover');
    }
  });
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
    } else {
      registerNavEnd();
    }
  };
  setTimeout(function () {
    animateScroll();
  }, delay)

}


function resetSheetScroll(sheet) {
  const lastReset = sheet.dataset.lastReset;
  const now = Date.now();

  if (!(lastReset && (parseInt(lastReset) > (now - 2000)))) {
    sheet.dataset.lastReset = now;
    smoothScroll(sheet, 0, 'vertical', 800, 400);
  }
}

// Keyboard navigation
function addKeyboardNav() {

  document.addEventListener('keydown', (e) => {
    e = e || window.event;

    let sheet;
    if ((e.keyCode == '39') || (e.keyCode == '37')) {
      sheet = document.querySelector('.sheet__outer.is-current');
    }
    if (e.keyCode == '37' && sheet.previousElementSibling) {
      initiateNav(sheet, -1);
      // left arrow
    }
    else if (e.keyCode == '39' && sheet.nextElementSibling) {
      initiateNav(sheet, 1);
      // right arrow
    }
  });
}



// ------------------------
// Navigation: safety check
// ------------------------
function navSafetyCheck() {
  // don't do it mid navigation
  if (shouldNavSafetyCheck()) {
    const wrapper = document.querySelector('.atf__wrapper');
    const sheet = wrapper.querySelector('.sheet__outer.is-current');

    const wrapperScroll = wrapper.scrollLeft;
    let sheetPos;
    if (sheet) {
      sheetPos = sheet.offsetLeft;
    } else {
      sheetPos = 0;
    }

    if (!closeEnough(sheetPos, wrapperScroll)) {
      smoothScroll(wrapper, sheetPos);
    }
  }
}

function shouldNavSafetyCheck() {
  return (
    (window.innerWidth > 980) &&
    !document.body.classList.contains('will-navigate')
  )
}

function closeEnough(a, b) {
  const delta = a - b;
  return ((delta < 10) && (delta > -10));
}

setInterval(() => {
  navSafetyCheck();
}, 2000);


// ---------------------
// Commercial: adds epic
// ---------------------
function addEpic() {
  const sheetNum = 3;

  const sheet = document.querySelector(`.sheet__outer:nth-child(${sheetNum}) .sheet__inner`);
  let sheetNav = false;
  if (sheet) {
    sheetNav = sheet.querySelector('.nav__wrapper');
  }

  if (sheetNav) {
    const copyH = 'Open, independent journalism has never mattered more';
    const copyP = 'We need your support to sustain our ambitious, high-impact reporting on Australia and the climate emergency';
    const copyB = 'Support the Guardian';

    let epic = document.createElement('div');
    epic.classList.add('epic');
    epic.innerHTML = `<div class='headline'>${copyH}</div><div class='copy'>${copyP}</div><a class='btn' href='https://support.theguardian.com/contribute?acquisitionData=%7B%22source%22%3A%22GUARDIAN_WEB%22%2C%22componentType%22%3A%22ACQUISITIONS_INTERACTIVE_SLICE%22%2C%22componentId%22%3A%22bushfires_interactive_July28%22%2C%22campaignCode%22%3A%22bushfires_interactive_July28%22%7D&INTCMP=bushfires_interactive_July28
    '>${copyB}</a>`;

    sheet.insertBefore(epic, sheetNav);

  }

}

// ~~~~~~~~~~~~~~~~
// Helper functions
// ~~~~~~~~~~~~~~~~

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
gu
const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
