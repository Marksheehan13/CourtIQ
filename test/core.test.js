import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePlayerStatRow } from '../src/data/validation.js';
import { estimatePossessions, pointsPerPossession } from '../src/analytics/possessions.js';
import { teamAdvancedStats } from '../src/analytics/advanced-team.js';
import { createGame } from '../src/data/game-model-v1.js';
import { verifyGame } from '../src/data/verification-v1.js';

test('rejects impossible shooting totals',()=>{const r=validatePlayerStatRow({fgm:12,fga:10});assert.equal(r.valid,false)});
test('estimates possessions',()=>{assert.equal(estimatePossessions({fga:60,fta:20,oreb:10,to:12}),70.8)});
test('calculates PPP',()=>{assert.equal(pointsPerPossession(70,70),1)});
test('calculates shooting percentages',()=>{const r=teamAdvancedStats({pts:80,fgm:30,fga:60,tpm:10,tpa:25,ftm:10,fta:12,oreb:10,to:12});assert.equal(r.fgPct,.5);assert.equal(r.threePct,.4);assert.equal(r.ftPct,10/12)});
test('verification blocks incomplete games',()=>{const g=createGame({date:'2026-09-01',teams:{a:{},b:{}}});assert.equal(verifyGame(g).status,'needs-review')});
