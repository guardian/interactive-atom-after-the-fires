
startInteractive();

function startInteractive() {
  let int;
  int = setInterval(() => {
    let keyEl = document.querySelector('.atf__wrapper');
    if (keyEl) {
      clearInterval(int);
      shapeDom();
    }
  }, 10)
}


// --------------------------------
// Restructure dom for this article
// --------------------------------
function shapeDom() {


  const interactiveBase = document.querySelector('.atf__wrapper'),
    interactiveRoot = interactiveBase.parentElement.parentElement;

  moveContentToSheets(interactiveBase, interactiveRoot);

  setTimeout(() => {
    moveContentToSheets(interactiveBase, interactiveRoot);

    const AppJsEl = document.createElement('script');
    AppJsEl.src = '<%= atomPath %>/app.js';
    interactiveRoot.appendChild(AppJsEl);
  }, 2000);


  const MetaJsEl = document.createElement('script');
  MetaJsEl.src = '<%= atomPath %>/autoupdate-meta.js';
  interactiveRoot.appendChild(MetaJsEl);


  // Create meta area
  const metaEl = document.querySelector('.meta-source');
  const firstSheet = document.querySelector('.sheet__inner');
  const firstStandy = firstSheet.querySelector('blockquote');
  if (metaEl && firstSheet && firstStandy) {
    firstSheet.insertBefore(metaEl, firstStandy.nextElementSibling);
  }

  // Show page
  document.body.classList.add('ready');
}

function moveContentToSheets(interactiveBase, interactiveRoot) {
  const articleRoot = interactiveRoot.parentElement,
    selectedElements = ['p', 'h2', 'figure', 'blockquote'].map((el) => ':scope > ' + el).join(','),
    articleChildren = articleRoot.querySelectorAll(selectedElements);


  // Move content to sheets
  articleChildren.forEach((el, i) => {
    if (el !== interactiveRoot) {
      if (el.tagName == 'H2' || el === articleChildren[0]) {
        newArticleSheet(interactiveBase);
      }
      processEmbed(el);
      interactiveBase.querySelector('.sheet__outer:last-child .sheet__inner').appendChild(el);
    }
  });

  return articleChildren.length;
}

function newArticleSheet(interactiveBase) {

  let sheetOuter = document.createElement('div');
  sheetOuter.classList.add('sheet__outer', 'atf__sheet__outer');
  let sheet = document.createElement('div');
  sheet.classList.add('sheet', 'atf__sheet');
  let sheetInner = document.createElement('div');
  sheetInner.classList.add('sheet__inner', 'atf__sheet__inner');

  let peekNav = document.createElement('div');
  peekNav.classList.add('sheet__peek-nav');
  peekNav.innerHTML = `<div class='sheet__peek-nav__prev'></div><div class='sheet__peek-nav__next'></div>`;
  sheet.appendChild(peekNav);

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

  if (i == 0) {
    sheetOuter.classList.add('is-current')
  } else if (i == 1) {
    sheetOuter.classList.add('is-next')
  }
  sheetOuter.dataset.index = i;
}


function processEmbed(el) {
  if (el.hasAttribute('data-canonical-url')) {
    const embedUrl = el.dataset.canonicalUrl;
    let embedFrame = document.createElement('iframe');
    embedFrame.src = embedUrl;
    el.appendChild(embedFrame);
  }
}
