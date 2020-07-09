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
  console.log('going', n)
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
  sheetAll.forEach((sheet) => {

    let navWrapper = document.createElement('div');
    navWrapper.classList.add('nav__wrapper');

    const prevEl = createNavEl(sheet.previousElementSibling);
    const nextEl = createNavEl(sheet.nextElementSibling);

    if (prevEl) {
      prevEl.classList.add('nav__prev');
      navWrapper.appendChild(prevEl);
      prevEl.addEventListener('click', (e) => {
        e.stopPropagation();
        slideSheet(-1);
      })

    }
    if (nextEl) {
      nextEl.classList.add('nav__next');
      navWrapper.appendChild(nextEl);
      nextEl.addEventListener('click', (e) => {
        e.stopPropagation();
        slideSheet(1);
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