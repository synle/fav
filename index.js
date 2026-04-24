const BASHRC_RAW_BASE_URL = `https://raw.githubusercontent.com/synle/bashrc/refs/heads/main`;

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
`;

function _transformSchema(s) {
  return s
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s)
    .join("\n");
}

async function getUrlPorterConfigs() {
  try {
    const r = await fetch("https://synle.github.io/fav/url-porter.json");
    const data = await r.json();
    return JSON.stringify(data.configs ?? [], null, 2);
  } catch {
    return "[]";
  }
}

async function fetchAndFormatJson(url) {
  try {
    const r = await fetch(url);
    const dataAsText = await r.text();

    try {
      return JSON.stringify(JSON.parse(dataAsText), null, 2);
    } catch {
      return dataAsText;
    }
  } catch {
    return "";
  }
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
    `.replace(/[ \n\t]/g, "");
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
    `.replace(/[ \n\t]/g, "");
  }

  function _getNumbers() {
    return `
      234567890
    `.replace(/[ \n\t]/g, "");
  }

  function _getRandomOption(choices) {
    return choices[_getRandomInt(0, choices.length)] || "";
  }

  function _getPassword(minLength = 20) {
    let password = "";
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
  const eventAppCopyTextToClipboard = new Event("AppCopyTextToClipboard");
  eventAppCopyTextToClipboard.text = _getPassword();
  document.dispatchEvent(eventAppCopyTextToClipboard);
}

// URL Porter bookmark injection from Chrome extension content script
const urlPorterBookmarksPromise = new Promise((resolve) => {
  document.addEventListener("urlPorterBookmarks", (e) => {
    const bookmarks = e.detail || [];
    console.log("URL Porter bookmarks:", bookmarks);
    if (bookmarks.length === 0) {
      resolve("");
      return;
    }
    const lines = bookmarks
      .map((b) => {
        const url = (b.url || "")
          .replace(/^https?:\/\//i, "")
          .replace(/\/$/, "")
          .trim();
        const title = (b.title || url).replace(/^#+\s*/, "").trim();
        return title && url ? `${title} | ${url}` : "";
      })
      .filter(Boolean)
      .join("\n");
    resolve(`\n# url-porter extra\n${lines}`);
  });
  // Timeout after 2s if extension is not installed
  setTimeout(() => resolve(""), 2000);
});

// hook up custom event
document.addEventListener("NavBeforeLoad", async (e) => {
  const { renderSchema } = e;

  if (!renderSchema) {
    return;
  }

  // Build the consolidated "URL Porter & Nav Generator" section.
  // Three tabs at the section level: URL Porter, Nav Gen, IPs.
  //  - URL Porter (::: nested nav block): just 3 url-porter management
  //    links (edit configs / url-porter-edit / url-porter-view) followed
  //    by a nested tab bar for Download + MetaData. Bookmark grid lives
  //    elsewhere (getUrlPorterSectionForNav) — only management content
  //    here.
  //  - Nav Gen (::: nested nav block): Edit Nav Favs / Edit Nav Library
  //    link buttons alongside the combined `git clone` snippets.
  //  - IPs (code block): Windows Hosts / Linux Hosts paths + bashrc
  //    ip-address.config content, fused with inline labels.
  async function getUrlPorterAndNavGenSchema() {
    const ETC_HOST_PATH_WIN32 = `c:\\Windows\\System32\\Drivers\\etc\\hosts`;
    const ETC_HOST_PATH_OSX = `/etc/hosts`;

    const [ipAddressConfig, urlPorterJson, rvxYt, rvxYtMusic, rvxSponsorblock] = await Promise.all([
      fetch(`${BASHRC_RAW_BASE_URL}/software/metadata/ip-address.config`)
        .then((r) => r.text())
        .catch(() => ""),
      getUrlPorterConfigs(),
      fetchAndFormatJson(`${BASHRC_RAW_BASE_URL}/docs/android/rvx-yt.txt`),
      fetchAndFormatJson(`${BASHRC_RAW_BASE_URL}/docs/android/rvx-yt-music.txt`),
      fetchAndFormatJson(`${BASHRC_RAW_BASE_URL}/docs/android/sponsorblock.json`),
    ]);

    return `
# URL Porter & Nav Generator
Host Mapping Ip Config | https://github.com/synle/bashrc/blob/master/software/metadata/ip-address.config

>>>URL Porter|tabUrlPorter>>>RVX Youtube / Music / Sponsorblock|tabRvx>>>Nav Gen|tabNavGen>>>IPs|tabIps

:::tabUrlPorter
Edit URL Porter Configs | https://github.com/synle/fav/edit/main/url-porter.json

>>>Download|tabPortDown>>>MetaData|tabPortMeta

\`\`\`tabPortDown
#################################################################
################## for Mac OSX with bash ##################
#################################################################

URL="https://github.com/synle/url-porter/raw/refs/heads/main/url-porter.zip"
BASE="$HOME/_extra"
TARGET="$BASE/url-porter"
TMP="/tmp/url-porter.zip"

if [[ "$(uname -s)" == "Darwin" && -d "$BASE" ]]; then
  rm -rf "$TARGET"
  mkdir -p "$TARGET"
  curl -L "$URL" -o "$TMP"
  unzip -oq "$TMP" -d "$TARGET"
  rm -f "$TMP"

  echo "Installation path for url-porter:"
  echo "$TARGET"
fi
echo "..."

#################################################################
################## for Windows with powershell ##################
#################################################################

$URL = "https://github.com/synle/url-porter/raw/refs/heads/main/url-porter.zip"
$BASE = "D:\\Applications"
$TARGET = "$BASE\\url-porter"
$TMP = "$env:TEMP\\url-porter.zip"

if (Test-Path $BASE) {

    if (Test-Path $TARGET) { Remove-Item -Recurse -Force $TARGET }
    New-Item -ItemType Directory -Path $TARGET -Force | Out-Null

    Invoke-WebRequest -Uri $URL -OutFile $TMP
    Expand-Archive -Path $TMP -DestinationPath $TARGET -Force
    if (Test-Path $TMP) { Remove-Item $TMP -Force }

    Write-Output "Installation path for url-porter:"
    Write-Output $TARGET
}
Write-Output "..."
\`\`\`

\`\`\`tabPortMeta
${urlPorterJson}
\`\`\`
:::

:::tabRvx
>>>Youtube RVX|tabRvxYt>>>Youtube Music RVX|tabRvxYtMusic>>>Sponsorblock RVX|tabRvxSponsorblock

\`\`\`tabRvxYt
${rvxYt}
\`\`\`

\`\`\`tabRvxYtMusic
${rvxYtMusic}
\`\`\`

\`\`\`tabRvxSponsorblock
${rvxSponsorblock}
\`\`\`
:::

:::tabNavGen
edit nav favs | github.com/synle/fav/edit/main/index.js
edit nav library | github.com/synle/nav-generator

\`\`\`
# Nav Gen Fav
git clone git@github.com:synle/fav.git

# Nav Gen Generator
git clone git@github.com:synle/nav-generator.git

# Nav Gen Template
git clone git@github.com:synle/nav-generator-template.git
\`\`\`
:::

\`\`\`tabIps
# Windows Hosts
${ETC_HOST_PATH_WIN32}

# Linux Hosts
${ETC_HOST_PATH_OSX}

# IPs
${ipAddressConfig}
\`\`\`
`;
  }

  // Standalone url-porter bookmarks grid (Drive, Calendar, Gmail, etc.).
  // Decoded from url-porter.json into nav link lines.
  async function getUrlPorterSectionForNav() {
    try {
      const res = JSON.parse(await getUrlPorterConfigs());
      return `

    # url-porter source code
    edit url porter configs | https://github.com/synle/fav/blob/main/url-porter.json

    # url-porter bookmarks
    ${res
      .map((nav) => {
        let from = nav.from;
        let to = nav.to;

        if (Array.isArray(nav) && nav.length === 2) {
          from = nav[0];
          to = nav[1];
        }

        from = (from || "")
          .trim()
          .replace(/^\|\|/, "") // remove leading ||
          .replace(/\^$/, ""); // remove trailing ^
        to = (to || "")
          .replace(/^https?:\/\//i, "") // remove http or https
          .replace(/\/$/, "") // remove trailing slash
          .trim();
        // try decoding for readability
        to = (() => {
          try {
            return decodeURIComponent(to || "");
          } catch {
            return to || "";
          }
        })()
          .replace(/^https?:\/\//i, "")
          .trim();

        if (from && to) {
          return [from, to];
        }

        return [];
      })
      .filter((s) => s.length > 0 && s[1].includes("."))
      .map(([from, to]) => `${from} | ${to}`)
      .join("\n")
      .trim()}
    `;
    } catch (err) {}
    return "";
  }

  // Android apps list. RVX tab block previously lived here — it has
  // moved into the RVX tab inside the URL Porter & Nav Generator section.
  const getAndroidAppsAndNotes = () => `
    # Android
    nova Companion | teslacoilapps.com/tesladirect/download.pl?packageName=com.teslacoilsw.launcherclientproxy&betaType=public
    vanced micro g | vanced.to/gmscore-microg
    vanced google photos| vanced.to/revanced-google-photos
    vanced YT| vanced.to/revanced-youtube-extended
    vanced YT Music | vanced.to/revanced-youtube-music-extended
    vanced Google News | vanced.to/revanced-google-news
  `;

  // construct and save the data to cache.
  const urlPorterExtra = await urlPorterBookmarksPromise;
  renderSchema(`
    ${_transformSchema(SITE_SCHEMA)}
    ${_transformSchema(getAndroidAppsAndNotes())}
    ${_transformSchema(await getUrlPorterSectionForNav())}
    ${_transformSchema(await getUrlPorterAndNavGenSchema())}
    ${_transformSchema(urlPorterExtra)}
  `);
});
