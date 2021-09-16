// hook up custom event
document.addEventListener('NavBeforeLoad', async (e) => {
  const { renderSchema } = e;

  if (!renderSchema) {
    return;
  }

  const SITE_SCHEMA = `
  ! Test Navigation
  @ 🧑

  # stock
  google finance stocklist | google.com/finance/portfolio/watchlist
  yahoo finance | finance.yahoo.com
  market watch | marketwatch.com
  cnbc | cnbc.com
  nasdaq | nasdaq.com
  zacks | zacks.com

  # general news
  google news | news.google.com/topstories
  nbc bay area | nbcbayarea.com
  lifehacker | lifehacker.com
  engadget | engadget.com
  verge | theverge.com
  tech crunch | techcrunch.com
  hacker news | hn.svelte.dev/top/1
  echojs | echojs.com
`
    .split('\n')
    .map((s) => s.trim())
    .join('\n');

  // construct and save the data to cache.
  renderSchema(SITE_SCHEMA);
});
