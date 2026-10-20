# 月蚀寻宝录

一个用原生 HTML、CSS、JavaScript 编写的异步寻宝小游戏。页面没有外部依赖，直接双击 `index.html` 即可游玩。

## 剧情流程

1. 月蚀图书馆：找到航海日志，获得潮汐线索。
2. 解码星图：把潮汐坐标放上青铜星盘，定位回响神庙。
3. 雾隐森林：在“蓝萤火”和“旧石阶”之间选择路线，获得不同发现。
4. 回响神庙：用月桂枝、潜行、星图交涉或等待月光通过石像守卫。
5. 星辉祭坛：按“月杯 → 星剑 → 月冠”的顺序点亮符文。
6. 月光之下：转动日月锁，取得“月蚀星砂”。

守卫和森林路线带有随机结果。守卫第一次失败会扣 1 点幸运，并开放一个必定通过的“等月光第三次掠过石像”选项，因此不会卡关。

## 异步实现

`treasure.js` 中的 `TreasureMap` 保留并扩展了附件里的四步 Promise API：

- `getInitialClue()`
- `decodeAncientScript()`
- `searchTemple()`
- `openTreasureBox()`

页面中的完整寻宝流程使用 `async / await` 顺序推进。星盘谜题本身也是异步交互：`waitForStarSequence()` 返回一个 Promise，等待玩家按正确顺序点击三枚符文后才会继续。

重新开始时通过递增 `state.token` 让旧的异步任务失效，避免上一局延迟中的 `setTimeout` 继续修改新一局页面。

原脚本在 `decodeAncientScript()` 中 `reject()` 后仍然调用了 `resolve()`。这个分支已经补上 `return`，错误不会再被后续的 resolve 掩盖。

## 对照两种写法

打开浏览器控制台后可以运行：

```js
findTreasureWithPromises();
findTreasureWithAsync();
```

前者是原来的 `.then()` 链式写法，后者是同一流程的 `async / await` 重写版本。两者不会影响页面上的游戏状态。

## 文件

- `index.html`：页面结构、场景地标和结局面板
- `styles.css`：夜景、月光、雾气、萤火、角色移动、宝箱与界面动画
- `treasure.js`：Promise API、剧情状态机、async/await 流程、星盘交互和音效

建议使用较新的 Chrome、Edge 或 Firefox 打开。开启声音后，关键剧情节点会有轻量合成音效；右上角可以随时静音。
