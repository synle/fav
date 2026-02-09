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

// hook up custom event
document.addEventListener("NavBeforeLoad", async (e) => {
  const { renderSchema } = e;

  if (!renderSchema) {
    return;
  }

  async function getHostMappingSchema() {
    let HOST_MAPPING_BLOCK_SCHEMA = "";

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
        .split("\n")
        .map((s) => s.trim())
        .join("\n");
    } catch (err) {}

    return HOST_MAPPING_BLOCK_SCHEMA;
  }

  let URL_PORTER_NOTES = `
>>>URL Porter Download|tabUrlPorterDownload>>>URL Porter MetaData|tabUrlPorterMetaData

\`\`\`tabUrlPorterDownload
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

\`\`\`tabUrlPorterMetaData
${await getUrlPorterConfigs()}
\`\`\`
`;

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

  let navGeneratorTabSection = `
    # Nav Generator source code
    edit nav favs | github.com/synle/fav/edit/main/index.js
    edit nav library | github.com/synle/nav-generator

    # Nav Generator
    >>>nav-fav|nav-fav>>>nav-generator|nav-generator>>>nav-template|nav-template

    \`\`\`nav-fav
    git clone git@github.com:synle/fav.git
    \`\`\`

    \`\`\`nav-generator
    git clone git@github.com:synle/nav-generator.git
    \`\`\`

    \`\`\`nav-template
    git clone git@github.com:synle/nav-generator-template.git
    \`\`\`
  `;

  const getAndroidAppsAndNotes = async () =>
    `
    # Android
    nova Companion | teslacoilapps.com/tesladirect/download.pl?packageName=com.teslacoilsw.launcherclientproxy&betaType=public
    vanced micro g | vanced.to/gmscore-microg
    vanced google photos| vanced.to/revanced-google-photos
    vanced YT| vanced.to/revanced-youtube-extended
    vanced YT Music | vanced.to/revanced-youtube-music-extended
    vanced Google News | vanced.to/revanced-google-news

    # Youtube / Youtube Music / Sponsorblock RVX Configs
    >>>rvx-yt|rvx-yt>>>rvx-music-yt|rvx-music-yt>>>rvx-sponspor-block|rvx-sponspor-block

    \`\`\`rvx-yt
    ${await fetchAndFormatJson("https://raw.githubusercontent.com/synle/bashrc/master/android/rvx-yt.txt")}
    \`\`\`
    \`\`\`rvx-music-yt
    ${await fetchAndFormatJson("https://raw.githubusercontent.com/synle/bashrc/master/android/rvx-yt-music.txt")}
    \`\`\`
    \`\`\`rvx-sponspor-block
    ${await fetchAndFormatJson("https://raw.githubusercontent.com/synle/bashrc/master/android/sponsorblock.json")}
    \`\`\`
  `;

  // construct and save the data to cache.
  renderSchema(`
    ${_transformSchema(SITE_SCHEMA)}
    ${_transformSchema(await getAndroidAppsAndNotes())}
    ${_transformSchema(await getUrlPorterSectionForNav())}
    ${_transformSchema(navGeneratorTabSection)}
    ${_transformSchema(await getHostMappingSchema())}
    ${_transformSchema(URL_PORTER_NOTES)}
  `);
});
