import { domains } from '../data/questions.js';

export const CONCERN_LEVELS = { NONE: 'no_concern', MILD: 'mild_concern', MODERATE: 'moderate_concern', SIGNIFICANT: 'significant_concern' };
export const CONCERN_LABELS = { [CONCERN_LEVELS.NONE]: 'No Concern', [CONCERN_LEVELS.MILD]: 'Mild Concern', [CONCERN_LEVELS.MODERATE]: 'Moderate Concern', [CONCERN_LEVELS.SIGNIFICANT]: 'Significant Concern' };
export const CONCERN_COLORS = { [CONCERN_LEVELS.NONE]: 'bg-green-100 text-green-800 border-green-300', [CONCERN_LEVELS.MILD]: 'bg-yellow-100 text-yellow-800 border-yellow-300', [CONCERN_LEVELS.MODERATE]: 'bg-orange-100 text-orange-800 border-orange-300', [CONCERN_LEVELS.SIGNIFICANT]: 'bg-red-100 text-red-800 border-red-300' };

export function calculateDomainScore(domainId, responses) {
  const domain = domains.find(d => d.id === domainId);
  if (!domain) return 0;
  const domainResponses = domain.questions.map(q => responses[q.id]).filter(v => v !== undefined);
  if (domainResponses.length === 0) return 0;
  return domainResponses.reduce((sum, val) => sum + val, 0) / (domainResponses.length * 3);
}

export function getConcernLevel(score) {
  if (score <= 0.25) return CONCERN_LEVELS.NONE;
  if (score <= 0.5) return CONCERN_LEVELS.MILD;
  if (score <= 0.75) return CONCERN_LEVELS.MODERATE;
  return CONCERN_LEVELS.SIGNIFICANT;
}

export function calculateAllDomainScores(responses) {
  return domains.map(domain => {
    const score = calculateDomainScore(domain.id, responses);
    return { domainId: domain.id, name: domain.name, score, level: getConcernLevel(score) };
  });
}

export function generateProfileSummary(domainScores) {
  const concerns = domainScores.filter(d => d.level !== CONCERN_LEVELS.NONE);
  if (concerns.length === 0) return 'No significant concerns identified across all domains.';
  const significant = concerns.filter(d => d.level === CONCERN_LEVELS.SIGNIFICANT);
  const moderate = concerns.filter(d => d.level === CONCERN_LEVELS.MODERATE);
  let summary = '';
  if (significant.length > 0) summary += 'Significant concerns in: ' + significant.map(d => d.name).join(', ') + '. ';
  if (moderate.length > 0) summary += 'Moderate concerns in: ' + moderate.map(d => d.name).join(', ') + '. ';
  summary += 'Professional evaluation is recommended for areas of concern.';
  return summary;
}
