
updateMeta();

function updateMeta() {
  const metaEl = document.querySelector('.content__meta-container');
  updatePubDate(metaEl);
  if (!document.body.classList.contains('ios') && !document.body.classList.contains('android')) {
    updateShareLinks(metaEl);
  }
}

function updateShareLinks(metaEl) {
  const path = guardian.config.page.contentId;
  const link = `https://www.theguardian.com/${path}`;
  const encodedLink = encodeURIComponent(link)

  const headline = guardian.config.page.headline || "";
  const encodedHeadline = encodeURIComponent(headline);


  const socialLinks = {
    'facebook': `https://www.facebook.com/dialog/share?app_id=180444840287&href=${encodedLink}%3FCMP%3Dshare_btn_fb`,
    'twitter': `https://twitter.com/intent/tweet?text=After%20the%20fires&url=${encodedLink}%3FCMP%3Dshare_btn_tw`,
    'email': `mailto:?subject=${encodedHeadline}&body=${encodedLink}%3FCMP%3Dshare_btn_link`
  }

  const methods = ['facebook', 'twitter', 'email']

  methods.forEach((method) => {
    let el = metaEl.querySelector(`.social__item--${method} a`);
    el.href = socialLinks[method];
  })

}

function updatePubDate(metaEl) {
  let dateEl = metaEl.querySelector('.content__dateline');
  if (document.body.classList.contains('ios') || document.body.classList.contains('android')) {
    // dateEl.style.display = 'none';
  } else {
    const pubdate = new Date(guardian.config.page.webPublicationDate)

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timezone = { '-120': 'BST', '-60': 'GMT' };

    let dateLine = `${weekdays[pubdate.getDay()]} ${pubdate.getDate()} ${months[pubdate.getMonth()]} ${pubdate.getFullYear()} ${pubdate.getHours()}.${pubdate.getMinutes()} ${timezone[pubdate.getTimezoneOffset()]}`;


    // dateEl.innerText = `${dateEl.innerText} :: ${dateLine}`
    dateEl.innerText = dateLine;

  }


}
