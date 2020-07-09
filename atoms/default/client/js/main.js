// var el = document.createElement('script');
// el.src = '<%= atomPath %>/app.js';
// document.body.appendChild(el);

console.log("HUIHHJJ");
console.log("HUIHHJJ");

startInteractive();

function startInteractive() {
  let int;
  let i = 0;
  int = setInterval(() => {
    let keyEl = document.querySelector('.atf__wrapper');
    if (keyEl) {
      clearInterval(int);

      console.log('starting', i++);
      shapeDom();
      fixedSideSheetsOnScroll();
      addSheetNav();
    }
  }, 1000)
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
      interactiveBase.querySelector('.sheet:last-child .sheet__inner').appendChild(el);
    }
  });

  interactiveBase.querySelectorAll('.sheet').forEach((sheet) => {
    sheet.addEventListener('click', () => {
      const i = sheet.dataset.index;
      if (i == -1 || i == 1) {
        slideSheet(i);
      }
    })
  });

  // Create meta area
  const metaEl = document.querySelector('.meta-source');
  const firstSheet = document.querySelector('.sheet__inner');
  const firstStandy = firstSheet.querySelector('blockquote');
  if (metaEl && firstSheet && firstStandy) {
    firstSheet.insertBefore(metaEl, firstStandy.nextElementSibling);
  }
}


function slideSheet(n) {
  document.querySelectorAll('.sheet').forEach((s) => {
    s.dataset.index = (parseInt(s.dataset.index) + (-1 * n));
  });
}

function newArticleSheet(interactiveBase) {

  let sheet = document.createElement('div');
  sheet.classList.add('sheet', 'atf__sheet');
  let sheetInner = document.createElement('div');
  sheetInner.classList.add('sheet__inner', 'atf__sheet__inner');
  sheet.appendChild(sheetInner);
  interactiveBase.appendChild(sheet);

  const prevSheet = sheet.previousElementSibling;
  let i;
  if (prevSheet == null) {
    i = 0;
  } else {
    i = parseInt(prevSheet.dataset.index) + 1;
  }

  sheet.dataset.index = i;
}

function addSheetNav() {

  const sheetAll = document.querySelectorAll('.sheet');
  console.log('will add now');
  sheetAll.forEach((sheet) => {
    console.log('adding to sheet', sheet);

    let navWrapper = document.createElement('div');
    navWrapper.classList.add('nav__wrapper');

    const prev = sheet.previousElementSibling;
    const next = sheet.nextElementSibling;

    if (prev) {
      let navPrev = document.createElement('div');
      navPrev.classList.add('nav__el', 'nav__prev');
      navPrev.innerHTML = 'PREV';
      navWrapper.appendChild(navPrev);
    }
    if (next) {
      let navNext = document.createElement('div');
      navNext.classList.add('nav__el', 'nav__next');
      navNext.innerHTML = 'NEXT';
      navWrapper.appendChild(navNext);
    }

    sheet.querySelector('.sheet__inner').appendChild(navWrapper);
  });

}
