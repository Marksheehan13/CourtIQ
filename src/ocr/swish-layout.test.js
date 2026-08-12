import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalField, classifySwishScreen, confidenceForField, extractBoxScoreRows, mapHeaders } from './swish-layout.js';

test('normalises SWISH statistic headers',()=>{assert.equal(canonicalField('PTS'),'pts');assert.equal(canonicalField('3PTM'),'tpm');assert.equal(canonicalField('REB'),'reb');});
test('maps a box-score header row',()=>{assert.deepEqual(mapHeaders(['Player','PTS','REB','AST']),[{index:0,source:'Player',field:null},{index:1,source:'PTS',field:'pts'},{index:2,source:'REB',field:'reb'},{index:3,source:'AST',field:'ast'}]);});
test('extracts player box-score data',()=>{const rows=extractBoxScoreRows([['7','John Doe','18','7','4']],[ 'Number','Player','PTS','REB','AST']);assert.equal(rows[0].pts,'18');assert.equal(rows[0].reb,'7');assert.equal(rows[0].ast,'4');assert.equal(rows[0].number,'7');assert.equal(rows[0].name,'John Doe');});
test('classifies SWISH screens',()=>{assert.equal(classifySwishScreen('BOX SCORE PTS REB AST'),'box-score');assert.equal(classifySwishScreen('PLAY-BY-PLAY'),'play-by-play');assert.equal(classifySwishScreen('SHOT CHART'),'visualization');});
test('caps field confidence at one',()=>{assert.equal(confidenceForField({ocrConfidence:.9,hasLabel:true,hasValue:true}),1);});
