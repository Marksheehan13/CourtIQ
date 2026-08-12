import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createGame, gameComplete } from '../src/data/game-model-v1.js';
import { verifyGame } from '../src/data/verification-v1.js';
import { estimatePossessions, pointsPerPossession } from '../src/analytics/possessions.js';

test('browser entrypoint passes JavaScript syntax validation',()=>{execFileSync(process.execPath,['--check','app.js'],{stdio:'pipe'});});

test('index references the real application entrypoint',()=>{const html=readFileSync('index.html','utf8');assert.match(html,/app\.js/);});

test('canonical game lifecycle reaches verification',()=>{const game=createGame({id:'smoke',date:'2026-08-12',teams:{home:{pts:80},away:{pts:75}},playerStats:[{playerId:'p1',pts:20,reb:5,ast:4,fgm:8,fga:15,tpm:2,tpa:5,ftm:2,fta:2}]});assert.equal(gameComplete(game),true);const verified=verifyGame(game);assert.equal(verified.status,'verified');});

test('possession metrics remain bounded and usable',()=>{const poss=estimatePossessions({fga:60,fta:20,oreb:10,to:12});assert.ok(poss>0);assert.equal(pointsPerPossession(80,poss),80/poss);});
