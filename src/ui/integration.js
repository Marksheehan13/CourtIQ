import { getAppData, saveFixture, addScreenshot } from '../data/app-store.js';
import { mountFixtureWorkspace } from './fixture-controller.js';
import { createFixture, ingestImages } from './workflow.js';
import { createGame } from '../data/game-model-v1.js';
import { verifyGame } from '../data/verification-v1.js';
import { teamAdvancedStats } from '../analytics/advanced-team.js';
import { buildReportContext } from '../reports/report-context.js';
import { renderScoutingReport } from '../reports/render-report.js';

export function mountWorkspace(root, fixtureId) {
  const fixture = getAppData().fixtures.find(f => String(f.id) === String(fixtureId));
  if (!fixture) throw new Error(`Fixture ${fixtureId} not found`);
  return mountFixtureWorkspace(root, fixture);
}
export function listWorkspaceFixtures() { return getAppData().fixtures.map(f => ({ id:f.id, home:f.home, away:f.away, date:f.date, status:f.status })); }
const api={mountWorkspace,listWorkspaceFixtures,data:{getAppData,saveFixture,addScreenshot},workflow:{createFixture,ingestImages},game:{createGame,verifyGame},analytics:{teamAdvancedStats},reports:{buildReportContext,renderScoutingReport}};
if(typeof window!=='undefined')window.CourtIQ={...(window.CourtIQ||{}),...api};
window.dispatchEvent?.(new CustomEvent('courtiq:ready'));
