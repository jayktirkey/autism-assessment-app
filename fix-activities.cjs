const fs = require('fs');
let c = fs.readFileSync('src/data/activities.js', 'utf8');
let lines = c.split('
');
// Remove any lines containing clause_footer
lines = lines.filter(l => !l.includes('clause_footer'));
c = lines.join('
');
// Find end of the JSON object and rewrite from there
let braceCount = 0;
let start = c.indexOf('{');
let end = start;
for (let i = start; i < c.length; i++) {
  if (c[i] === '{') braceCount++;
  if (c[i] === '}') braceCount--;
  if (braceCount === 0) { end = i + 1; break; }
}
const jsonStr = c.substring(c.indexOf('{'), end);
const out = 'export const activities = ' + jsonStr + ';

' +
'export function getActivitiesForDomain(domainId, level) {
' +
'  const d = activities[domainId];
' +
'  if (!d) return [];
' +
'  return d[level] || [];
' +
'}

' +
'export function getAdjustedActivities(domainId, currentLevel, previousLevel) {
' +
'  const d = activities[domainId];
' +
'  if (!d) return [];
' +
'  const sev = { no_concern: 0, mild_concern: 1, moderate_concern: 2, significant_concern: 3 };
' +
'  if (previousLevel && (sev[currentLevel] || 0) < (sev[previousLevel] || 0)) {
' +
'    return (d[currentLevel] || []).map(function(a) { return Object.assign({}, a, { note: "Great progress!" }); });
' +
'  }
' +
'  if (previousLevel && (sev[currentLevel] || 0) >= (sev[previousLevel] || 0)) {
' +
'    var lo = ["mild_concern", "moderate_concern", "significant_concern"];
' +
'    var ci = lo.indexOf(currentLevel);
' +
'    var il = ci < lo.length - 1 ? lo[ci + 1] : currentLevel;
' +
'    return (d[il] || d[currentLevel] || []).map(function(a) { return Object.assign({}, a, { note: "More intensive support recommended." }); });
' +
'  }
' +
'  return d[currentLevel] || [];
' +
'}

' +
'export default activities;
';
fs.writeFileSync('src/data/activities.js', out);
console.log('Fixed! File size:', out.length, 'bytes');
