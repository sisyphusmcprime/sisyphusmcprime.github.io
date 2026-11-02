// Get Files at Location

/**
 * Convert a markdown string to HTML.
 * @param {URL} loc - URL to get files at. Must be a cdn.jsdelivr url
 * @returns {FileList} - List of files at location
 */

async function getFilesAtLoc(loc = "https://cdn.jsdelivr.net/gh/sisyphusmcprime/sisyphusmcprime.github.io-posts@latest/") {
    const files = await fetch(loc);

    print(files.json())
}

window.fetchFilesFromCDN = {
  getFilesAtLoc
};