const STORAGE_KEY = 'autism_screening_assessments';

export function saveAssessment(results) {
  const assessments = getAssessments();
  const assessment = { id: Date.now().toString(), timestamp: new Date().toISOString(), domainScores: results.domainScores, responses: results.responses };
  assessments.push(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  return assessment;
}

export function getAssessments() {
  try { const data = localStorage.getItem(STORAGE_KEY); return data ? JSON.parse(data) : []; }
  catch { return []; }
}

export function getLatestAssessment() {
  const assessments = getAssessments();
  return assessments.length === 0 ? null : assessments[assessments.length - 1];
}

export function clearAssessments() { localStorage.removeItem(STORAGE_KEY); }
