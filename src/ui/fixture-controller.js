import { getAppData, saveFixture } from '../data/app-store.js';
import { fixtureWorkspaceHtml } from './fixture-workspace.js';
import { ingestImages } from './workflow.js';

export function mountFixtureWorkspace(root, fixture) {
  const render = () => {
    const data = getAppData();
    const screenshots = data.screenshots.filter(s => String(s.fixtureId) === String(fixture.id));
    root.innerHTML = fixtureWorkspaceHtml(fixture, { screenshots });
    const input = root.querySelector('#fixture-files');
    input?.addEventListener('change', async e => {
      if (!e.target.files?.length) return;
      input.disabled = true;
      try { await ingestImages(fixture.id, [...e.target.files]); render(); }
      catch (err) { console.error(err); }
      finally { input.disabled = false; }
    });
  };
  render();
  return { refresh: render };
}

export function markFixtureStage(fixtureId, status) {
  const fixture = getAppData().fixtures.find(f => String(f.id) === String(fixtureId));
  if (!fixture) return null;
  return saveFixture({ ...fixture, status });
}
