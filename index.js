function getStrongPassword() {
  function _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function _getUpperCase() {
    return `
      ABCDEFGHJKMNPQRSTUVWXYZ
    `.replace(/[ \n\t]/g, '');
  }

  function _getLowerCase() {
    return _getUpperCase().toLowerCase();
  }

  function _getSpecialChars() {
    return `
      -=
      @#$%^&*()+
      [],./
      {}|<>?
    `.replace(/[ \n\t]/g, '');
  }

  function _getNumbers() {
    return `
      234567890
    `.replace(/[ \n\t]/g, '');
  }

  function _getRandomOption(choices){
    return choices[_getRandomInt(0, choices.length)] || '';
  }
  
  function _getPassword(minLength = 20) {
    let password = '';
    const choices = [...new Set([
      ..._getUpperCase(),
      ..._getLowerCase(),
      ..._getSpecialChars(),
      ..._getNumbers(),
    ])];

    password += _getRandomOption(_getUpperCase());
    password += _getRandomOption(_getLowerCase());
    password += _getRandomOption(_getSpecialChars());
    password += _getRandomOption(_getNumbers());

    while (password.length < minLength) {
      try {
        password += _getRandomOption(choices);
      } catch (err) {}
    }
    return password;
  }

  // dispatch event to copy text to clipboard
  const eventAppCopyTextToClipboard = new Event('AppCopyTextToClipboard');
  eventAppCopyTextToClipboard.text = _getPassword();
  document.dispatchEvent(eventAppCopyTextToClipboard);
}

// hook up custom event
document.addEventListener('NavBeforeLoad', async (e) => {
  const { renderSchema } = e;

  if (!renderSchema) {
    return;
  }

  const SITE_SCHEMA = `
  ! Sy's Favorites
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

  # shopping and deals
  amazon | amazon.com
  costco | costco.com
  woot | woot.com
  slickdeals | slickdeals.net
  dealnews | dealnews.com

  # movies
  plex | app.plex.tv
  netflix | netflix.com
  disney +| disneyplus.com
  prime video | amazon.com/gp/video
  youtube | youtube.com

  # personal
  synle | /
  github repositories | github.com/synle?tab=repositories
  email | mail.google.com/mail
  calendar | calendar.google.com/calendar
  code spaces | github.com/codespaces

  # utils and misc
  ip location | whatismyipaddress.com
  bashrc | /bashrc/
  port forwarding | /app/port-forwarding.html
  fix link | /fix-tracking-link/
  nav bookmark generator ||| synle.github.io/nav-generator/index.html?newNav
  prettier playground | prettier.io/playground
  home router config | 192.168.1.1
  torrent | bit.ly/3pVvM2N
  strong password | javascript://getStrongPassword()
  kids letter tracing | synle.github.io/letter-tracing-generator/

  # source code
  fav source | github.com/synle/fav
  nav generator source | github.com/synle/nav-generator
`
    .split('\n')
    .map((s) => s.trim())
    .join('\n');

  async function getHostMappingSchema() {
    let HOST_MAPPING_BLOCK_SCHEMA = '';
    try {
      const HOSTNAMES_GROUPED_BY_ID = await fetch(
        `https://raw.githubusercontent.com/synle/bashrc/master/software/metadata/ip-address.config.hostnamesGroupedByID`,
      ).then((r) => r.text());
      const HOSTNAMES_MAPPINGS = await fetch(
        `https://raw.githubusercontent.com/synle/bashrc/master/software/metadata/ip-address.config.etcHostnamesMappings`,
      ).then((r) => r.text());

      HOST_MAPPING_BLOCK_SCHEMA = `
      # Host Mappings
      Host Mapping Ip Config|https://github.com/synle/bashrc/blob/master/software/metadata/ip-address.config
      >>> Host Files Location|tabHostDir >>> Host IPs|tabHostNamesGroupedByIp >>> /etc/hosts Mapping|tabHostMappings
      \`\`\`tabHostDir
      # Windows
      c:\\Windows\\System32\\Drivers\\etc\\hosts

      # Linux
      sudo vim /etc/hosts
      \`\`\`

      \`\`\`tabHostNamesGroupedByIp
      ${HOSTNAMES_GROUPED_BY_ID}
      \`\`\`

      \`\`\`tabHostMappings
      # Sy Home Hosts
      ${HOSTNAMES_MAPPINGS}
      # END Sy Home Hosts
      \`\`\`
    `
        .split('\n')
        .map((s) => s.trim())
        .join('\n');
    } catch (err) {}

    return HOST_MAPPING_BLOCK_SCHEMA;
  }

  // construct and save the data to cache.
  renderSchema(`
    ${SITE_SCHEMA}
    ${await getHostMappingSchema()}
  `);
});
