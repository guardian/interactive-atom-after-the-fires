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
      fixedSideSheetsOnScroll()
    }
  }, 10)
}

function fixedSideSheetsOnScroll() {
  const atfWrapper = document.querySelector('.atf__wrapper');
  window.addEventListener('scroll', () => {
    const top = atfWrapper.getBoundingClientRect().top;
    console.log(top);
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
    if (el!==interactiveRoot) {
      if (el.tagName=='H2' || el === articleChildren[0]) {
        newArticleSheet(interactiveBase);
      }
      interactiveBase.querySelector('.sheet:last-child .sheet__inner').appendChild(el);
    }
  });

  interactiveBase.querySelectorAll('.sheet').forEach((sheet) => {
    sheet.addEventListener('click', () => {
      const i = sheet.dataset.index;
      if (i==-1 || i==1) {
        slideSheet(i);
      }
    })
  })
}


function slideSheet(n) {
  document.querySelectorAll('.sheet').forEach((s) => {
    s.dataset.index = (parseInt(s.dataset.index)+(-1*n));
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