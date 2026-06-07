# NowTask 決策引擎

> 判斷現在是否應該執行某個任務。不是待辦清單，是行動決策系統。

## 功能

輸入任務資訊與當下狀態，系統會輸出：

- **NOW** — 立即執行
- **LATER** — 稍後處理
- **SWITCH** — 換個任務

以及判斷分數、理由、建議行動、是否需要拆解任務。

## 使用方式

純靜態網頁，不需要任何後端或 API 金鑰。

### 本機使用
直接用瀏覽器開啟 `index.html` 即可。

### GitHub Pages 部署
1. 將此 repo 推上 GitHub
2. 進入 `Settings` → `Pages`
3. Source 選 `main` branch，資料夾選 `/ (root)`
4. 儲存後即可透過 `https://<your-username>.github.io/<repo-name>` 存取

## 技術

- 純 HTML / CSS / JavaScript，零依賴
- 字型：Sora + DM Mono（Google Fonts）
- 判斷邏輯內建於前端，完全離線可用
