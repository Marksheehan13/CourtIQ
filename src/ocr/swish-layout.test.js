import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySwishScreen,normalizeSwishField,parseSwishRow } from './swish-layout.js';
import { validatePlayerRow,validateExtraction } from './validation.js';

test('classifies box scores',()=>assert.equal(classifySwishScreen('BOX SCORE MIN PTS REB AST'),'box-score'));
test('classifies play by play',()=>assert.equal(classifySwishScreen('PLAY-BY-PLAY'),'play-by-play'));
test('classifies shot charts',()=>assert.equal(classifySwishScreen('SHOT CHART'),'visualization'));
test('normalizes stat labels',()=>assert.equal(normalizeSwishField('3PTA'),'tpa'));
test('parses stat cells',()=>assert.deepEqual(parseSwishRow([{label:'PTS',value:'18'},{label:'REB',value:'7'}]),{pts:18,reb:7}));
test('rejects impossible shooting lines',()=>{const r=validatePlayerRow({fgm:8,fga:7,tpm:2,tpa:4,ftm:3,fta:3,pts:21});assert.equal(r.valid,false);assert.match(r.errors.join(' '),/FGM cannot exceed FGA/)});
test('catches points reconciliation errors',()=>{const r=validatePlayerRow({fgm:5,fga:10,tpm:2,tpa:5,ftm:4,fta:4,pts:20});assert.equal(r.valid,false);assert.match(r.errors.join(' '),/Points do not reconcile/)});
test('normalizes percentage values',()=>{const r=validatePlayerRow({fgm:'5',fga:'10',tpm:'2',tpa:'5',ftm:'4',fta:'4'});assert.equal(r.row.fgPct,50);assert.equal(r.row.tpPct,40);assert.equal(r.row.ftPct,100)});
test('rejects empty box-score extraction',()=>{const r=validateExtraction({screenType:'box-score',rows:[]});assert.equal(r.valid,false);assert.equal(r.status,'reject')});
