import { getAppData, saveFixture, addScreenshot } from '../data/app-store.js';
import { mountFixtureWorkspace } from './fixture-controller.js';
import { createFixture, ingestImages } from './workflow.js';
import { createGame } from '../data/game-model-v1.js';
import { verifyGame } from '../data/verification-v1.js';
import { teamAdvancedStats } from '../analytics/advanced-team.js';
import { buildReportContext } from '../reports/report-context.js';

export function mountWorkspace(root, fixtureId) {
  const fixture = getAppData().fixtures.find(f => String(f.id) === String(fixtureId));
  if (!fixture) throw new Error(`Fixture ${fixtureId} not found`);
  return mountFixtureWorkspace(root, fixture);
}
export function listWorkspaceFixtures() {
  return getAppData().fixtures.map(f => ({ id:f.id, home:f.home, away:f.away, date:f.date, status:f.status }));
}

// Browser bridge for the domain layer. app.js remains the current shell while
// these modules are progressively wired into its screens.
const api = {
  mountWorkspace, listWorkspaceFixtures,
  data: { getAppData, saveFixture, addScreenshot },
  workflow: { createFixture, ingestImages },
  game: { createGame, verifyGame },
  analytics: { teamAdvancedStats },
  reports: { buildReportContext }
};
if (typeof window !== 'undefined') window.CourtIQ = { ...(window.CourtIQ || {}), ...api };
window.dispatchEvent?.(new CustomEvent('courtiq:ready'));
