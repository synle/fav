const SITE_SCHEMA = `
  ! Sy's Favorites
  @ 🧑

  # stock
  cnbc | cnbc.com
  google finance stocklist | google.com/finance/portfolio/watchlist
  yahoo finance | finance.yahoo.com
  market watch | marketwatch.com
  nasdaq | nasdaq.com
  zacks | zacks.com

  # general news
  google news | news.google.com/topstories
  nbc bay area | nbcbayarea.com
  lifehacker | lifehacker.com

  # tech news
  blind | www.teamblind.com
  hacker news | hn.svelte.dev/top/1
  echojs | echojs.com
  engadget | engadget.com
  verge | theverge.com
  tech crunch | techcrunch.com
  

  # shopping and deals
  slickdeals | slickdeals.net
  dealnews | dealnews.com
  amazon | amazon.com
  costco | costco.com
  woot | woot.com
  reddit build PC | reddit.com/r/buildapcsales/new
  microcenter | microcenter.com

  # movies
  youtube | youtube.com
  plex app | app.plex.tv
  plex local | 192.168.1.22:32400
  netflix | netflix.com
  disney+ | disneyplus.com
  prime video | amazon.com/gp/video

  # UT Austin School
  Canvas | canvas.utexas.edu
  EDx | edstem.org/us/dashboard

  # social media
  linkedin | linkedin.com
  facebook | facebook.com
  discord | discord.com

  # personal
  synle | /
  email | mail.google.com/mail
  calendar | calendar.google.com/calendar
  
  # dev
  github repositories | github.com/synle?tab=repositories
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
  alpha numeric password | javascript://getStrongPassword(true)
  Multi Factor Auth (MFA) | synle.tplinkdns.com
  jupyter lab Notebook | localhost:8888
  Jellyfin Host | 192.168.1.22:8096

  # kids
  kids letter tracing | synle.github.io/letter-tracing-generator/
  kids first 100 words | synle.github.io/letter-tracing-generator/first-grade-100-words.html

  # source code
  edit nav favs | github.com/synle/fav/edit/main/index.js
  edit nav library | github.com/synle/nav-generator
`;

const URL_PORTER_NOTES = `
>>>URL Porter Download|tabUrlPorterDownload>>>URL Porter MetaData|tabUrlPorterMetaData

\`\`\`tabUrlPorterDownload
wget https://github.com/synle/url-porter/raw/refs/heads/main/url-porter.zip
unzip url-porter.zip
\`\`\`

\`\`\`tabUrlPorterMetaData
[
  {
    "from": "||drive^",
    "to": "https://drive.google.com"
  },
  {
    "from": "||gmail^",
    "to": "https://mail.google.com/mail/u/0/#inbox"
  },
  {
    "from": "||outlook^",
    "to": "https://outlook.office.com"
  },
  {
    "from": "||plex^",
    "to": "http://192.168.1.22:32400/web/index.html#!"
  },
  {
    "from": "||mfa^",
    "to": "https://192.168.1.22"
  },
  {
    "from": "||vs^",
    "to": "http://synle.tplinkdns.com:8080"
  },
  {
    "from": "||jf^",
    "to": "http://192.168.1.22:8096"
  },
  {
    "from": "||jellyfin^",
    "to": "http://jf"
  },
  {
    "from": "||edx^",
    "to": "https://edstem.org/us/dashboard"
  },
  {
    "from": "||canvas^",
    "to": "https://utexas.instructure.com"
  },
  {
    "from": "||wagework^",
    "to": "https://participant.wageworks.com"
  },
  {
    "from": "||hn^",
    "to": "https://news.ycombinator.com"
  },
  {
    "from": "||chat^",
    "to": "https://chatgpt.com"
  },
  {
    "from": "||gpt^",
    "to": "https://chatgpt.com"
  },
  {
    "from": "||keep^",
    "to": "https://keep.google.com/#home"
  },
  {
    "from": "||zillow^",
    "to": "https://www.zillow.com"
  }
]
\`\`\`
`;

function _transformSchema(s) {
  return s
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s)
    .join('\n');
}

function getStrongPassword(isAlphaNumericOnly = false) {
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

  function _getRandomOption(choices) {
    return choices[_getRandomInt(0, choices.length)] || '';
  }

  function _getPassword(minLength = 20) {
    let password = '';
    let choices = [..._getNumbers(), ..._getLowerCase()];

    if (isAlphaNumericOnly === false) {
      password += _getRandomOption(_getUpperCase());
      password += _getRandomOption(_getLowerCase());
      password += _getRandomOption(_getSpecialChars());
      password += _getRandomOption(_getNumbers());

      choices = [...choices, ..._getUpperCase(), ..._getSpecialChars()];
    } else {
      password += _getRandomOption(_getLowerCase());
    }

    choices = [...new Set(choices)];

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

  async function getHostMappingSchema() {
    let HOST_MAPPING_BLOCK_SCHEMA = '';

    const ETC_HOST_PATH_WIN32 = `c:\\Windows\\System32\\Drivers\\etc\\hosts`;
    const ETC_HOST_PATH_OSX = `/etc/hosts`;

    try {
      const HOSTNAMES_GROUPED_BY_ID = await fetch(
        `https://raw.githubusercontent.com/synle/bashrc/master/software/metadata/ip-address.config.hostnamesGroupedByID`,
      ).then((r) => r.text());
      const HOSTNAMES_MAPPINGS = await fetch(
        `https://raw.githubusercontent.com/synle/bashrc/master/software/metadata/ip-address.config.etcHostnamesMappings`,
      ).then((r) => r.text());

      HOST_MAPPING_BLOCK_SCHEMA = `
      Host Mapping Ip Config|https://github.com/synle/bashrc/blob/master/software/metadata/ip-address.config
      >>> Host Files Location|tabHostDir >>> Host IPs|tabHostNamesGroupedByIp >>> /etc/hosts Mapping|tabHostMappings
      \`\`\`tabHostDir
      # Windows
      ${ETC_HOST_PATH_WIN32}

      # Linux
      ${ETC_HOST_PATH_OSX}
      \`\`\`

      \`\`\`tabHostNamesGroupedByIp
      ${HOSTNAMES_GROUPED_BY_ID}
      \`\`\`

      \`\`\`tabHostMappings
      # subl ${ETC_HOST_PATH_WIN32}
      # sudo vim ${ETC_HOST_PATH_OSX}
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
    ${_transformSchema(SITE_SCHEMA)}
    ${await getHostMappingSchema()}
    ${_transformSchema(URL_PORTER_NOTES)}
  `);
});
