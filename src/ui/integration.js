import { getAppData } from '../data/app-store.js';
import { mountFixtureWorkspace } from './fixture-controller.js';

/** Optional integration layer for the existing CourtIQ shell.
 * Keeps the current app.js UI intact while exposing the new fixture workspace
 * to future navigation without coupling the data/analytics modules to the shell.
 */
export function mountWorkspace(root, fixtureId) {
  const fixture = getAppData().fixtures.find(f => String(f.id) === String(fixtureId));
  if (!fixture) throw new Error(`Fixture ${fixtureId} not found`);
  return mountFixtureWorkspace(root, fixture);
}

export function listWorkspaceFixtures() {
  return getAppData().fixtures.map(f => ({ id:f.id, home:f.home, away:f.away, date:f.date, status:f.status }));
}

if (typeof window !== 'undefined') window.CourtIQ = { ...(window.CourtIQ || {}), mountWorkspace, listWorkspaceFixtures };
