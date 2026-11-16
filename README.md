# 🌱 Sprout Notes｜前端學習筆記站

一個以 **AGENTS.md 驅動持續擴充** 的繁體中文前端知識站。以「概念 → 範例 → 練習 → 自我檢查」整理入門知識，重點是讓下一篇筆記能依相同規則快速完成。

- 網站：<https://lambo16384-debug.github.io/sprout-notes/>
- Repository：<https://github.com/lambo16384-debug/sprout-notes>
- AI 協作規則：[AGENTS.md](AGENTS.md)
- 新增內容範本：[templates/note.json](templates/note.json)
- 實際延伸示範：[docs/extension-example.md](docs/extension-example.md)

## 網站功能
- 七篇原創整理：語意化 HTML、盒模型、Flexbox、Grid、DOM 事件、Git 流程與響應式設計。
- 四種分類，可組合關鍵字搜尋；沒有結果時可清除條件。
- 每篇都是可直接連結的靜態頁面，包含範例、練習、可展開解答與官方參考。
- 首頁已讀進度保存在本機瀏覽器；不蒐集個資，不需要帳號。
- 桌面三欄、平板兩欄、手機一欄；語意標籤、鍵盤焦點與可跳到內容的連結。

## 本機執行
需要 Node.js 20 以上，零套件依賴，不必 npm install。

```sh
npm run build
npm test
npm run dev
```

開啟 <http://127.0.0.1:4173>。也可直接使用 `node scripts/build.mjs`、`node scripts/check.mjs`、`node --test` 與 `node scripts/serve.mjs`。

## 如何新增一篇筆記
1. 先閱讀 [AGENTS.md](AGENTS.md)。
2. 複製 templates/note.json 到 content/notes，例如 css-animation.json。
3. 填寫欄位與不重複的 order，維持「目標／概念／範例／練習／解答／參考」結構。
4. 執行 build 與 test。首頁數量、分類、文章、上下篇導覽自動更新。
5. 執行 `npm run publish:pages`，將來源、dist 與 docs 一起提交到 main。

請勿手動修改 dist 或 docs 裡的產生頁面；下次建置會覆寫。手寫延伸示範 docs/extension-example.md 會保留。

## GitHub Pages
Repository Settings → Pages → Deploy from a branch → main → /docs → Save。
docs/.nojekyll 讓靜態檔直接發布。CSS、JS 與站內連結全部使用相對路徑，可在 Repository 子路徑運作。每次修改來源後先執行 publish:pages，再提交並 push。

## 專案結構
```text
AGENTS.md              AI 協作與開發規則
content/notes/         唯一內容來源，每篇一份 JSON
templates/note.json    新增內容範本
src/                   共用樣式與互動
scripts/               產生器、檢查器、預覽與 Pages 同步
tests/                 搜尋及分類行為測試
dist/                  一般靜態主機發布輸出
docs/                  GitHub Pages 發布輸出與延伸說明
```

## 使用限制
已讀狀態只保存在目前瀏覽器，不會跨裝置同步。停用 JavaScript 時仍可閱讀文章，但搜尋、分類與進度不作用。內容是入門筆記，完整規格以各篇引用的官方文件為準。

內容與版型為本專案自行整理與製作，並未複製課堂示範網站。此專案使用 AI 協作製作；繳交者應閱讀、理解並依課程要求揭露協作方式。
