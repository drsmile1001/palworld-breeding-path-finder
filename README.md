# 🧬 Palworld Breeding Path Finder

這是一個針對遊戲《Palworld（幻獸帕魯）》設計的 **繁殖路徑搜尋工具**，可以計算從指定帕魯開始，經由繁殖所能達成目標帕魯的所有可能路徑。並提供帕魯戰鬥力（power）排序的分析工具。

專案以 [Deno](https://deno.land/) 撰寫，並透過 `Deno.test` 搭配 `console.table` 產出資料。

## 🎯 功能簡介

### 🪄 繁殖路徑搜尋

- 計算從指定起點帕魯到目標帕魯的所有 **兩步繁殖路徑**
- 每一步輸出繁殖組合（add、result）與戰鬥力
- 結果依路徑長度、每步戰力由小到大排序
- 同時輸出成 `TSV` 表格，方便查閱或整理

### 📊 帕魯戰力排序

- 根據每隻帕魯的戰鬥力（power）排序
- 計算其原始 ID 順序與戰力排序之差距（方便理解帕魯強度分布）
- 輸出為表格與 `TSV` 檔案

## 🚀 使用方式

1. 安裝 [Deno](https://deno.land/)

2. 執行繁殖路徑查找與輸出：

```bash
deno test --allow-read --allow-write
````

將在 `output/` 目錄產生：

* `path <source> to <target>.tsv`
* `power-ranking.tsv`

3. 可自行修改 `main.test.ts` 中的 `start` 與 `end` 變數，換算其他路徑

## 📄 License

MIT License（僅供學習與個人用途，與官方遊戲無直接關係）
