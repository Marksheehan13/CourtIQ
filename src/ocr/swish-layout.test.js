import { describe,it,expect } from 'vitest';
import { classifySwishScreen,normalizeSwishField,parseSwishRow } from './swish-layout.js';
describe('SWISH layout parser',()=>{it('classifies box scores',()=>expect(classifySwishScreen('BOX SCORE MIN PTS REB AST')).toBe('box-score'));it('classifies play by play',()=>expect(classifySwishScreen('PLAY-BY-PLAY')).toBe('play-by-play'));it('normalizes stat labels',()=>expect(normalizeSwishField('3PTA')).toBe('tpa'));it('parses stat cells',()=>expect(parseSwishRow([{label:'PTS',value:'18'},{label:'REB',value:'7'}])).toEqual({pts:18,reb:7}))});
