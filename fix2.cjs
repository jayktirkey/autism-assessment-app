const fs = require("fs");
const c = fs.readFileSync("src/data/activities.js", "utf8");
const lines = c.split("
");
const clean = lines.filter(function(l) {
  return l.indexOf("clause_footer") === -1;
});
fs.writeFileSync("src/data/activities.js", clean.join("
"));
console.log("Removed clause_footer lines. Remaining lines: " + clean.length);
