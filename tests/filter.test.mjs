import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterNotes } from '../src/filter.js';
const notes=[{slug:'a',title:'CSS 盒模型',summary:'理解尺寸',category:'CSS',tags:['排版']},{slug:'b',title:'點擊互動',summary:'使用事件',category:'JavaScript',tags:['DOM']}];
test('空白搜尋保留全部且不修改來源',()=>{assert.equal(filterNotes(notes,'  ').length,2);assert.equal(notes.length,2);});
test('英文忽略大小寫，能搜尋標籤',()=>{assert.equal(filterNotes(notes,'dom')[0].slug,'b');});
test('摘要與中文關鍵字可搜尋',()=>{assert.equal(filterNotes(notes,'尺寸')[0].slug,'a');});
test('分類與搜尋必須同時符合',()=>{assert.equal(filterNotes(notes,'DOM','CSS').length,0);assert.equal(filterNotes(notes,'排版','CSS')[0].slug,'a');});
test('查無資料回傳空陣列',()=>{assert.deepEqual(filterNotes(notes,'xyz'),[]);});
