const fs = require("fs");

const INPUT_FILE = "url-porter.json";
const OUTPUT_FILE = INPUT_FILE; // Overwriting the original file
const DEFAULT_HOME_PAGE = "https://synle.github.io/fav/";

try {
  // 1. Read the file
  let rawData = fs.readFileSync(INPUT_FILE, "utf8");

  // 2. Strip comments (single line // and multi-line /* */)
  // This allows JSON.parse to work even if comments are present
  const jsonWithoutComments = rawData.replace(
    /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
    (m, g) => (g ? "" : m),
  );

  // 3. Parse the cleaned data
  const parsedData = JSON.parse(jsonWithoutComments);

  // 4. Determine where the configs are
  let configs = [];
  if (parsedData.configs && Array.isArray(parsedData.configs)) {
    configs = parsedData.configs;
  } else if (Array.isArray(parsedData)) {
    configs = parsedData;
  }

  // 5. Transform the configs
  const transformedConfigs = configs.map((entry) => {
    // If the entry is an array of length 2, return as-is
    if (Array.isArray(entry) && entry.length === 2) {
      return entry;
    }

    let fromValue = entry.from?.trim() || "";
    let toValue = entry.to?.trim() || "";

    if (fromValue) {
      if (!fromValue.startsWith("||")) {
        fromValue = "||" + fromValue;
      }
    }

    if (toValue) {
      if (!toValue.startsWith("http://") && !toValue.startsWith("https://")) {
        toValue = "http://" + toValue;
      }

      toValue = toValue.replace(/\/+$/, "");
    }

    return {
      ...entry,
      ...(fromValue && { from: fromValue }),
      ...(toValue && { to: toValue }),
    };
  });

  // 6. Create result object
  const result = {
    homepage: parsedData.homepage || DEFAULT_HOME_PAGE,
    configs: transformedConfigs,
  };

  // 7. Print to console
  console.log("Transformation Complete:");
  console.log(JSON.stringify(result, null, 2));

  // 8. Write back to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), "utf8");
  console.log(`\nSuccessfully updated ${OUTPUT_FILE}`);
} catch (error) {
  console.error("Error processing the JSON file:", error.message);
}
