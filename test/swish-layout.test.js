import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalField, mapHeaders, extractBoxScoreRows, classifySwishScreen, confidenceForField } from '../src/ocr/swish-layout.js';

test('normalizes SWISH stat headers',()=>{assert.equal(canonicalField('PTS'),'pts');assert.equal(canonicalField('3P%'),null);assert.equal(canonicalField('REB'),'reb');assert.equal(canonicalField('AST'),'ast')});
test('maps box score headers to canonical fields',()=>{const m=mapHeaders(['#','Player','PTS','REB','AST']);assert.deepEqual(m.map(x=>x.field),[null,null,'pts','reb','ast'])});
test('extracts canonical box score rows',()=>{const rows=extractBoxScoreRows([['7','John Doe','18','6','4']],['#','Player','PTS','REB','AST']);assert.equal(rows[0].number,'7');assert.equal(rows[0].name,'John Doe');assert.equal(rows[0].pts,'18');assert.equal(rows[0].reb,'6')});
test('classifies common SWISH screens',()=>{assert.equal(classifySwishScreen('BOX SCORE PTS REBOUNDS ASSISTS'),'box-score');assert.equal(classifySwishScreen('PLAY BY PLAY'),'play-by-play');assert.equal(classifySwishScreen('SHOT CHART'),'visualization')});
test('confidence stays bounded',()=>{assert.equal(confidenceForField({ocrConfidence:.9,hasLabel:true,hasValue:true}),1)});
