// var el = document.createElement('script');
// el.src = '<%= atomPath %>/app.js';
// document.body.appendChild(el);

startInteractive();

function startInteractive() {
  let int;
  int = setInterval(() => {
    let keyEl = document.querySelector('.after-the-fires__wrapper');
    if (keyEl) {
      clearInterval(int);

      setTimeout(() => {
        shapeDom();

      }, 5000)

    }
  }, 10)
}


function shapeDom() {
  const interactiveBase = document.querySelector('.after-the-fires__wrapper');

  const interactiveRoot = interactiveBase.parentElement.parentElement;
  const endEl = document.querySelector('.l-footer.u-cf');
  const articleRoot = interactiveRoot.parentElement;

  let start = false,
    end = false;

  articleRoot.childNodes.forEach((el) => {
    console.log(el);

    if (el === endEl) {
      end = true;
    } else if (!end && start) {
      // Add this element
      interactiveBase.appendChild(el);

    } else if (el === interactiveRoot) {
      start = true;
    }
  })
  // // go up to find the article's root
  // const articleRoot = i.parentElement.parentElement.parentElement;

  // console.log(articleRoot, 'r');
}
