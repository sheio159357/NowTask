# NowTask 決策引擎

> 判斷現在是否應該執行某個任務。不是待辦清單，是行動決策系統。

## 功能

輸入任務資訊與當下狀態，系統輸出：

- **NOW** — 立即執行
- **LATER** — 稍後處理
- **SWITCH** — 換個任務

以及判斷分數、理由、建議行動、是否需要拆解任務。

## 安裝為 App（Chrome）

1. 用 Chrome 開啟網頁
2. 網址列右側點「安裝」圖示，或選單 → 「將網頁安裝為應用程式」
3. 完成，桌面 / 應用程式列會出現 NowTask 圖示

## GitHub Pages 部署

1. 將此 repo 推上 GitHub
2. `Settings` → `Pages` → Source 選 `main` branch，資料夾 `/ (root)`
3. 存檔後透過 `https://<username>.github.io/<repo>` 存取

## 檔案結構

```
nowtask/
├── index.html      # 主頁面
├── style.css       # 樣式
├── app.js          # 判斷邏輯 + 互動
├── manifest.json   # PWA 設定
├── sw.js           # Service Worker（離線快取）
├── icon-192.png    # App 圖示
└── icon-512.png    # App 圖示（大）
```

## 技術

- 純 HTML / CSS / JavaScript，零依賴
- PWA：可安裝、離線可用
- 字型：Sora + DM Mono（Google Fonts）
