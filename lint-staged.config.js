module.exports = {
  // for javascript and typescript files
  "*.{js,jsx,ts,tsx}": (filenames) => {
    const relativePaths = filenames.map((file) => `"${file}"`).join(" ");
    return [`prettier --write ${relativePaths}`, `git add ${relativePaths}`];
  },
  // for other files, like json
  "*.{json,md,css,scss}": ["prettier --write", "git add"],
};
