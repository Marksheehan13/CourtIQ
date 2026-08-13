import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalField, mapHeaders, extractBoxScoreRows, classifySwishScreen, confidenceForField } from '../src/ocr/swish-layout.js';
import { validatePlayerRow, validateExtraction } from '../src/ocr/validation.js';

test('normalizes SWISH stat headers',()=>{assert.equal(canonicalField('PTS'),'pts');assert.equal(canonicalField('3P%'),null);assert.equal(canonicalField('REB'),'reb');assert.equal(canonicalField('AST'),'ast')});
test('maps box score headers to canonical fields',()=>{const m=mapHeaders(['#','Player','PTS','REB','AST']);assert.deepEqual(m.map(x=>x.field),[null,null,'pts','reb','ast'])});
test('extracts canonical box score rows',()=>{const rows=extractBoxScoreRows([['7','John Doe','18','6','4']],['#','Player','PTS','REB','AST']);assert.equal(rows[0].number,'7');assert.equal(rows[0].name,'John Doe');assert.equal(rows[0].pts,'18');assert.equal(rows[0].reb,'6')});
test('classifies common SWISH screens',()=>{assert.equal(classifySwishScreen('BOX SCORE PTS REBOUNDS ASSISTS'),'box-score');assert.equal(classifySwishScreen('PLAY BY PLAY'),'play-by-play');assert.equal(classifySwishScreen('SHOT CHART'),'visualization')});
test('confidence stays bounded',()=>{assert.equal(confidenceForField({ocrConfidence:.9,hasLabel:true,hasValue:true}),1)});
test('rejects impossible shooting lines',()=>{const r=validatePlayerRow({fgm:8,fga:7,tpm:2,tpa:4,ftm:3,fta:3,pts:21});assert.equal(r.valid,false);assert.match(r.errors.join(' '),/FGM cannot exceed FGA/)});
test('catches points reconciliation errors',()=>{const r=validatePlayerRow({fgm:5,fga:10,tpm:2,tpa:5,ftm:4,fta:4,pts:20});assert.equal(r.valid,false);assert.match(r.errors.join(' '),/Points do not reconcile/)});
test('normalizes percentage strings',()=>{const r=validatePlayerRow({fgm:'5',fga:'10',tpm:'2',tpa:'5',ftm:'4',fta:'4'});assert.equal(r.row.fgPct,50);assert.equal(r.row.tpPct,40);assert.equal(r.row.ftPct,100)});
test('flags empty box-score extraction',()=>{const r=validateExtraction({screenType:'box-score',rows:[]});assert.equal(r.valid,false);assert.equal(r.status,'reject')});
