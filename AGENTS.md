# Sprout Notes｜給 AI 的專案協作規則

## 1. 目的與讀者
建立繁體中文的前端入門筆記站，幫初學者用「概念 → 範例 → 練習 → 自我檢查」學習。核心是可持續新增內容的出版流程。所有文章採原創整理，不複製課堂範例或外站全文。

## 2. 技術與指令
- Node.js 20 以上；原生 HTML、CSS、JavaScript；零外部套件。
- `npm run build`：驗證 JSON 並產生 `dist/` 全站。
- `npm run check`：驗證內容欄位、唯一 slug、日期、分類與站內連結。
- `npm run dev`：在 http://127.0.0.1:4173 預覽已建置網站。
- `npm test`：執行 check，再測試搜尋與分類的共用邏輯。
- 修改後依序執行 build、test，確認成功再提交。

## 3. 檔案結構與單一來源
```
content/notes/*.json       每篇筆記的唯一內容來源
templates/note.json        新增筆記範本（不能放進 content/notes）
src/styles.css            全站設計 token、元件與響應式規則
src/app.js                首頁搜尋、分類與本機學習進度
src/filter.js             可在瀏覽器與 Node 共用的篩選函式
scripts/build.mjs         共用版型、資料驗證、靜態頁面產生
scripts/check.mjs         建置輸出與相對連結檢查
scripts/serve.mjs         本機靜態預覽
tests/filter.test.mjs     搜尋與分類組合測試
docs/extension-example.md 延伸流程實例與可重用提示詞
dist/                     自動產物；不要手動編輯
```
不要逐頁複製 HTML。改版型要改 build.mjs，改內容要改 JSON；重新 build 才會同步首頁、文章、上一篇／下一篇及導覽。

## 4. 新增內容契約
1. 複製 `templates/note.json` 到 `content/notes/<slug>.json`。
2. slug 與檔名必須一致，採小寫英文 kebab-case，不能重複。例如 `css-responsive`。
3. 必填：slug、title、category、summary、minutes、order、updated、tags、goal、concepts、example、exercise、references。
4. category 只能是 HTML、CSS、JavaScript、Workflow；新增分類先同步驗證器和篩選介面。
5. minutes 為 1–60 整數；order 為不重複正整數；updated 為真實的 YYYY-MM-DD 日期。
6. title 6–40 字、summary 20–100 字；tags 1–4 個不重複字串；concepts 至少兩段，各有 heading 與 body。
7. example 需要 language、code、explanation；exercise 需要 prompt、solution；references 至少一筆 label + https URL。參考連結用官方文件，文章以自己的話整理。
8. 一篇只處理一個入門主題。避免「保證」等不實說法；程式碼要能對應解說和練習。
9. 首頁統計、分類、排序、閱讀時間與文章連結由內容產生，不手動補數字或卡片。

## 5. 共用頁面結構
首頁：品牌導覽 → 主視覺與開始閱讀 → 學習進度 → 搜尋／分類 → 筆記卡片 → 方法說明 → 頁尾。
文章：返回總覽／麵包屑 → 標題與資訊 → 學習目標 → 核心概念 → 程式範例 → 小練習 → 可展開參考解答 → 官方參考 → 上下篇導覽。
所有文章由同一版型產生，必須有唯一 h1、main、可跳到內容的連結。文章是實際靜態 HTML，停用 JS 仍能閱讀與導覽。

## 6. 設計規則
- 語言 `zh-Hant`。米白紙感底色、深墨綠文字、青草綠強調色，帶一點學習手帳感。
- 顏色、字級、圓角集中於 styles.css 的 :root；新增元件沿用既有 token。
- 大標題清晰，內文行高至少 1.7；內文容器不超過 72ch。
- 桌面卡片三欄，平板兩欄，手機一欄；320px 寬不得產生整頁橫向捲動。程式碼區可獨立橫捲。
- 使用系統字體與自製 CSS 圖形，不依賴遠端字體或圖片。
- 連結、按鈕保留可見焦點；分類標示 aria-pressed，搜尋有 label，結果數以 aria-live 告知。
- 尊重 prefers-reduced-motion。狀態不能只用顏色傳達。

## 7. 互動與資料
搜尋比對標題、摘要、分類、標籤；空字串顯示全部，搜尋與分類以 AND 組合；無結果需顯示清除條件按鈕。
「已讀」只存 localStorage（鍵 sprout-notes-read-v1），不蒐集個資、不傳送資料。資料損壞或儲存被停用時仍可閱讀，頁面提供狀態說明。進度只計算目前存在的文章。
不要用 innerHTML 插入使用者輸入。JSON 文字及程式碼輸出到 HTML 時要跳脫特殊字元。

## 8. 修改與驗收
- 先讀 AGENTS.md、範本與一篇現有內容，再修改。
- 不覆寫無關檔案、不放入金鑰、帳密、學號或私密資料。
- 不加入無必要框架與依賴；需要新增時先說明理由。
- 執行 build、test；新增主題必須在首頁、分類、文章與上下篇導覽出現。
- 可用瀏覽器時檢查桌面／手機、搜尋無結果、分類、解答展開、已讀切換及重載保存。
- 提交說明交代「改了什麼、規則如何套用、實際通過哪些檢查」，不能聲稱未執行的測試已通過。

## 9. 發布方式
GitHub Pages 使用 main 分支的 `/docs` 目錄；`npm run publish:pages` 會先驗證建置，再把 dist 同步到 docs 根目錄（保留 docs/extension-example.md）。提交來源與發布輸出後 push。網站資源一律使用相對路徑，支援 Repository 子路徑。
若改成其他靜態主機，發布 dist 即可。修改發布流程時同步更新 README 與本節。
