// var el = document.createElement('script');
// el.src = '<%= atomPath %>/app.js';
// document.body.appendChild(el);

startInteractive();

function startInteractive() {
  let int;
  int = setInterval(() => {
    let keyEl = document.querySelector('.atf__wrapper');
    if (keyEl) {
      clearInterval(int);
      shapeDom();
      fixedSideSheetsOnScroll();
      addSheetNav();
    }
  }, 10)
}


function fixedSideSheetsOnScroll() {
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

// not checked
function shapeDom() {
  const interactiveBase = document.querySelector('.atf__wrapper'),
    interactiveRoot = interactiveBase.parentElement.parentElement,
    articleRoot = interactiveRoot.parentElement,
    selectedElements = ['p', 'h2', 'figure', 'blockquote'].map((el) => ':scope > ' + el).join(','),
    articleChildren = articleRoot.querySelectorAll(selectedElements);

  // Move content to sheets
  articleChildren.forEach((el) => {
    if (el !== interactiveRoot) {
      if (el.tagName == 'H2' || el === articleChildren[0]) {
        newArticleSheet(interactiveBase);
      }
      interactiveBase.querySelector('.sheet__outer:last-child .sheet__inner').appendChild(el);
    }
  });

  // Create meta area
  const metaEl = document.querySelector('.meta-source');
  const firstSheet = document.querySelector('.sheet__inner');
  const firstStandy = firstSheet.querySelector('blockquote');
  if (metaEl && firstSheet && firstStandy) {
    firstSheet.insertBefore(metaEl, firstStandy.nextElementSibling);
  }
}

function newArticleSheet(interactiveBase) {

  let sheetOuter = document.createElement('div');
  sheetOuter.classList.add('sheet__outer', 'atf__sheet__outer');
  let sheet = document.createElement('div');
  sheet.classList.add('sheet', 'atf__sheet');
  let sheetInner = document.createElement('div');
  sheetInner.classList.add('sheet__inner', 'atf__sheet__inner');

  sheetOuter.appendChild(sheet);
  sheet.appendChild(sheetInner);
  interactiveBase.appendChild(sheetOuter);

  const prevSheet = sheetOuter.previousElementSibling;
  let i;
  if (prevSheet == null) {
    i = 0;
  } else {
    i = parseInt(prevSheet.dataset.index) + 1;
  }

  sheetOuter.dataset.index = i;
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
      })

    }
    if (nextEl) {
      nextEl.classList.add('nav__next');
      navWrapper.appendChild(nextEl);
      nextEl.addEventListener('click', (e) => {
        // navigate to next here
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
