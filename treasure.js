"use strict";

/* ------------------------------------------------------------------
 * 月蚀寻宝录
 * 原始实验中的四步寻宝 API（Promise 版本）被完整保留，并扩展了新的剧情。
 * 页面中的寻宝过程使用 async / await 顺序推进。
 * ------------------------------------------------------------------ */

class TreasureMap {
  static getInitialClue(delay = 1000) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("在古老的图书馆里，一本会呼吸的航海日志停在第七排书架，书页上写着：潮汐与星轨，将在北纬三十一度交汇。");
      }, delay);
    });
  }

  static decodeAncientScript(clue, delay = 1500) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!clue) {
          reject(new Error("没有线索可以解码!"));
          return;
        }
        resolve("星图解码成功！潮汐的尽头是雾隐谷深处的回响神庙。旁注只有一句：月影第三次掠过石像时，门才会打开。");
      }, delay);
    });
  }

  static searchTemple(location = "回响神庙", options = {}) {
    const {
      mode = "sneak",
      attempt = 0,
      hasBranch = false
    } = options;

    return new Promise((resolve, reject) => {
      const wait = mode === "offer" ? 1200 : mode === "wait" ? 1600 : 1800;

      setTimeout(() => {
        if (mode === "offer" && hasBranch) {
          resolve("守卫低头闻了闻月桂枝，琥珀色的眼睛慢慢暗了下去。它侧过身，让出了一条通往神庙深处的路。");
          return;
        }

        if (mode === "wait" || attempt >= 2) {
          resolve("守卫忽然打了个长长的哈欠。趁月光第三次掠过它的额头，你贴着侧廊溜进了神庙。");
          return;
        }

        const baseChance = mode === "negotiate" ? 0.62 : 0.54;
        const chance = Math.min(0.9, baseChance + attempt * 0.13);

        if (Math.random() < chance) {
          const messages = {
            sneak: "你借着石柱的阴影，从守卫长矛下轻轻滑了过去。",
            negotiate: "你把星图举到守卫面前。它盯着那条熟悉的航线看了很久，终于向旁边退了一步。"
          };
          resolve(messages[mode] || "守卫让开了道路，你走进了回响神庙。");
        } else {
          const messages = {
            sneak: "糟糕!遇到了神庙守卫!它的长矛横在石阶前，你只能退回廊柱后。",
            negotiate: "守卫并不相信你的星图。它用长矛敲响石板，整座神庙都醒了。"
          };
          reject(new Error(messages[mode] || "糟糕!遇到了神庙守卫!"));
        }
      }, wait);
    });
  }

  static openTreasureBox(delay = 1200) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("恭喜!你找到了传说中的宝藏——一枚会记住夜空的月蚀星砂。");
      }, delay);
    });
  }

  /* ------------------------- 新剧情 API ------------------------- */

  static followFireflies(delay = 1700) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lucky = Math.random() < 0.72;
        if (lucky) {
          resolve({
            title: "月桂枝",
            luck: 1,
            clue: 0,
            text: "蓝萤火把你带到一棵倒下的月桂树旁。树心还藏着淡淡的香气，你折下一小枝，萤火们绕着它跳了一圈。"
          });
        } else {
          resolve({
            title: "星砂碎片",
            luck: 0,
            clue: 1,
            text: "萤火忽然散开。你循着它们留下的光点，在树根下捡到一枚星砂碎片，背面刻着半个神庙的轮廓。"
          });
        }
      }, delay);
    });
  }

  static takeStonePath(delay = 1600) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: "旧石阶上的刻痕",
          luck: 0,
          clue: 1,
          text: "旧石阶比看上去更长。你在最后一级发现一行被苔藓盖住的刻痕：三枚符文，要按月杯、星剑、月冠的顺序点亮。"
        });
      }, delay);
    });
  }

  static alignConstellation(sequence, delay = 1100) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const expected = "moon,sword,crown";
        if (sequence.join(",") !== expected) {
          reject(new Error("星轨错位，符文退回了原位。"));
          return;
        }
        resolve("三枚符文同时亮起，一束星光从穹顶落下，照出了祭坛中央的宝箱。");
      }, delay);
    });
  }
}

/* ------------------------------------------------------------------
 * 页面状态与剧情
 * ------------------------------------------------------------------ */

const STAGES = [
  {
    scene: "library",
    progress: 0.025,
    progressLabel: "序章",
    chapterProgress: "PROLOGUE / 00",
    kicker: "序章 · THE PROLOGUE",
    title: "月蚀之夜",
    subtitle: "一封没有署名的邀请函，把你带到了这里",
    panelTitle: "一封没有署名的邀请函",
    description: "传闻每逢月蚀，回响神庙都会归还一件被时间遗忘的宝物。你带着一张残缺的星图，在午夜前抵达了古老的图书馆。",
    objective: "在第七排书架，找到那本会呼吸的航海日志。",
    quote: "有些路，只有在你迈出第一步之后，才会从雾里显出来。",
    hint: "点击右侧「翻开航海日志」开始你的旅程"
  },
  {
    scene: "library",
    progress: 0.13,
    progressLabel: "线索",
    chapterProgress: "CHAPTER I / 06",
    kicker: "第一章 · THE FIRST CLUE",
    title: "会呼吸的航海日志",
    subtitle: "书页间藏着一条只属于月蚀的航线",
    panelTitle: "潮汐写下的第一个线索",
    description: "航海日志在你指尖自行翻动，停在了一张被海水泡皱的羊皮纸上。墨迹正沿着潮汐的纹路缓慢游动，像在等待一枚星盘。",
    objective: "把羊皮纸上的潮汐坐标，放上图书馆的青铜星盘。",
    quote: "北纬三十一度，潮水会为月光让路。",
    hint: "线索已入手，下一步是解码古老星图"
  },
  {
    scene: "forest",
    progress: 0.42,
    progressLabel: "森林",
    chapterProgress: "CHAPTER II / 06",
    kicker: "第二章 · WHISPERING WOODS",
    title: "雾隐森林",
    subtitle: "蓝萤火与旧石阶，指向两条不同的路",
    panelTitle: "雾里有两个方向",
    description: "离开图书馆后，雾从山脚漫上来。一条小径上有蓝萤火忽明忽暗，另一条旧石阶通向更深处的黑暗。神庙就在雾的尽头。",
    objective: "选一条路穿过森林，在月影第三次掠过石像前抵达神庙。",
    quote: "雾不会替你选路，它只会把每一条路的代价藏得更深。",
    hint: "两条路都能抵达神庙，但会带回不同的发现"
  },
  {
    scene: "temple",
    progress: 0.65,
    progressLabel: "守卫",
    chapterProgress: "CHAPTER III / 06",
    kicker: "第三章 · THE STONE WARDEN",
    title: "回响神庙",
    subtitle: "沉睡千年的守卫，在月光下睁开了眼",
    panelTitle: "被月光惊醒的守卫",
    description: "你刚踏上最后一级石阶，两旁的石像便同时睁开了眼睛。守卫没有立刻攻击，只是把长矛横在门前，像在衡量你有没有资格进去。",
    objective: "在守卫再次警觉前进入神庙。它每三次呼吸才眨一次眼。",
    quote: "它守着的也许不是门，而是一个还没有被回答的问题。",
    hint: "选一种方式通过守卫，失败后它会露出新的破绽"
  },
  {
    scene: "temple",
    progress: 0.79,
    progressLabel: "星盘",
    chapterProgress: "CHAPTER IV / 06",
    kicker: "第四章 · THE STAR CHART",
    title: "星辉祭坛",
    subtitle: "三枚符文，等待正确的次序",
    panelTitle: "把星光排成回家的路",
    description: "神庙深处没有火把，只有一座缓慢转动的星盘。三枚符文嵌在石台上，每一枚都在低声嗡鸣，像在等待一段被遗忘的旋律。",
    objective: "按照手记提示，依次点亮月杯、星剑与月冠。",
    quote: "先斟满杯，再拔起剑，最后才配戴上冠冕。",
    hint: "观察手记里的顺序提示，点错不会结束旅程"
  },
  {
    scene: "chamber",
    progress: 0.975,
    progressLabel: "宝藏",
    chapterProgress: "CHAPTER V / 06",
    kicker: "第五章 · THE LAST LOCK",
    title: "月光之下",
    subtitle: "箱子打开的瞬间，整座神庙安静了下来",
    panelTitle: "最后的日月锁",
    description: "祭坛中央浮起一只铜色宝箱。箱盖上没有钥匙孔，只有一轮太阳和一轮月亮相互咬合。你把手放上去，听见里面传来很轻的潮声。",
    objective: "转动宝箱上的日月锁，取出被月光封存的宝物。",
    quote: "最珍贵的宝物，通常不会发出金币碰撞的声音。",
    hint: "最后一步：转动日月锁，看看星砂记住了什么"
  }
];

const state = {
  token: 0,
  stage: 0,
  running: true,
  started: false,
  over: false,
  clues: 0,
  luck: 0,
  startedAt: null,
  elapsed: 0,
  hasMoonBranch: false,
  route: null,
  guardAttempts: 0,
  guardOutcome: null,
  starMistakes: 0,
  sound: true,
  timerId: null,
  logTotal: 0
};

const elements = {};
let routeLength = 0;
let mapReady = false;
let toastTimer = null;
let audioContext = null;

class CancelledError extends Error {
  constructor() {
    super("旅程已重新开始");
    this.name = "AbortError";
  }
}

/* ------------------------------------------------------------------
 * 初始化
 * ------------------------------------------------------------------ */

function init() {
  [
    "sceneFrame",
    "mapScene",
    "player",
    "routeProgress",
    "starField",
    "chapterKicker",
    "chapterTitle",
    "chapterSub",
    "chapterProgress",
    "panelTitle",
    "panelDesc",
    "objectiveText",
    "quoteText",
    "mapHintText",
    "timelinePips",
    "logList",
    "logCount",
    "progressLabel",
    "clueCount",
    "luckCount",
    "timer",
    "asyncStatus",
    "choiceArea",
    "guardian",
    "soundBtn",
    "restartBtn",
    "intro",
    "startBtn",
    "ending",
    "endTime",
    "endClues",
    "endLuck",
    "endingText",
    "replayBtn",
    "toast",
    "toastText",
    "helpBtn",
    "helpModal",
    "closeHelpBtn",
    "sceneFlash"
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });

  elements.primaryContent = document.querySelector(".panel-heading");
  elements.plaque = document.querySelector(".chapter-plaque");
  elements.routePath = document.querySelector(".route-line");

  routeLength = elements.routePath.getTotalLength();
  elements.routeProgress.style.strokeDasharray = `${routeLength} ${routeLength}`;

  createStars();
  bindEvents();
  resetGame(false);
}

function createStars() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 92; index += 1) {
    const star = document.createElement("span");
    const size = 1 + Math.random() * 1.7;
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 68}%`;
    star.style.setProperty("--size", `${size}px`);
    star.style.setProperty("--opacity", (0.24 + Math.random() * 0.62).toFixed(2));
    star.style.setProperty("--duration", `${2.6 + Math.random() * 5}s`);
    star.style.setProperty("--delay", `${-Math.random() * 7}s`);
    fragment.appendChild(star);
  }

  elements.starField.appendChild(fragment);
}

function bindEvents() {
  elements.startBtn.addEventListener("click", startGame);
  elements.restartBtn.addEventListener("click", () => resetGame(true));
  elements.replayBtn.addEventListener("click", () => resetGame(true));
  elements.soundBtn.addEventListener("click", toggleSound);

  elements.helpBtn.addEventListener("click", () => {
    elements.helpModal.hidden = false;
  });

  elements.closeHelpBtn.addEventListener("click", closeHelp);
  elements.helpModal.addEventListener("click", (event) => {
    if (event.target === elements.helpModal) {
      closeHelp();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.helpModal.hidden) {
      closeHelp();
    }
  });
}

function closeHelp() {
  elements.helpModal.hidden = true;
}

/* ------------------------------------------------------------------
 * 游戏重置与启动
 * ------------------------------------------------------------------ */

function resetGame(startClock) {
  const nextToken = state.token + 1;
  clearInterval(state.timerId);

  Object.assign(state, {
    token: nextToken,
    stage: 0,
    running: true,
    started: startClock,
    over: false,
    clues: 0,
    luck: 0,
    startedAt: startClock ? Date.now() : null,
    elapsed: 0,
    hasMoonBranch: false,
    route: null,
    guardAttempts: 0,
    guardOutcome: null,
    starMistakes: 0,
    timerId: null,
    logTotal: 0
  });

  elements.intro.classList.remove("is-hidden");
  elements.ending.hidden = true;
  elements.helpModal.hidden = true;
  elements.sceneFrame.classList.remove("chest-open");
  elements.guardian.classList.remove("awake", "calm");
  elements.logList.replaceChildren();
  elements.logCount.textContent = "00";
  elements.timer.textContent = "00:00";
  elements.endTime.textContent = "00:00";
  elements.endClues.textContent = "0";
  elements.endLuck.textContent = "0";

  if (startClock) {
    elements.intro.classList.add("is-hidden");
  }

  renderStats(false);
  goToStage(0);

  addLog("月光落进第七排书架，一本没有书名的航海日志轻轻翻开了第一页。");

  if (startClock) {
    startTimer();
  }
}

function startGame() {
  ensureAudio();
  elements.intro.classList.add("is-hidden");

  if (!state.started) {
    state.started = true;
    state.startedAt = Date.now();
    startTimer();
  }

  playChime("start");
  showToast("寻宝开始 · 愿星光替你照亮下一步");
  setAsyncStatus("等待行动", false);

  window.setTimeout(() => {
    const action = elements.choiceArea.querySelector("button");
    action?.focus({ preventScroll: true });
  }, 850);
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = window.setInterval(() => {
    if (!state.startedAt) {
      return;
    }
    state.elapsed = Date.now() - state.startedAt;
    elements.timer.textContent = formatTime(state.elapsed);
  }, 250);
}

/* ------------------------------------------------------------------
 * 场景与剧情渲染
 * ------------------------------------------------------------------ */

function goToStage(index) {
  if (!state.running || index < 0 || index >= STAGES.length) {
    return;
  }

  state.stage = index;
  const stage = STAGES[index];

  elements.sceneFrame.dataset.scene = stage.scene;
  updatePlayer(stage.progress);
  updateChapter(stage);
  renderStageCopy(index);
  renderActions();
  updateProgressUi(index);
  updateLandmarks(index);

  if (index < 3) {
    elements.guardian.classList.remove("awake", "calm");
  } else if (index === 3) {
    elements.guardian.classList.remove("calm");
    elements.guardian.classList.add("awake");
  } else {
    elements.guardian.classList.add("awake", "calm");
  }

  if (index < 5) {
    elements.sceneFrame.classList.remove("chest-open");
  }

  if (index === 4) {
    setAsyncStatus("星盘等待点亮", false);
    beginStarPuzzle(state.token);
  } else if (index === 0) {
    setAsyncStatus(state.started ? "等待行动" : "等待启程", false);
  } else {
    setAsyncStatus("等待行动", false);
  }
}

function updateChapter(stage) {
  elements.chapterKicker.textContent = stage.kicker;
  elements.chapterTitle.textContent = stage.title;
  elements.chapterSub.textContent = stage.subtitle;

  elements.plaque.animate(
    [
      { opacity: 0, transform: "translateY(5px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 420, easing: "ease" }
  );
}

function renderStageCopy(index) {
  const stage = STAGES[index];
  let panelTitle = stage.panelTitle;
  let description = stage.description;
  let objective = stage.objective;

  if (index === 3 && state.guardAttempts > 0) {
    panelTitle = "守卫正在巡视";
    description = state.guardAttempts >= 2
      ? "守卫的眼皮明显沉了下来，长矛也不再抬得那么稳。月光正第三次爬过它的额头，这是最好的机会。"
      : "长矛落地的回声惊动了守卫。它开始来回踱步，但每一次转身都会在侧廊留下短暂的阴影。";
    objective = state.hasMoonBranch
      ? "用月桂枝安抚守卫，或趁它转身时进入神庙。"
      : "等待守卫露出破绽。连续尝试后，它会在月光下打盹。";
  }

  elements.chapterProgress.textContent = stage.chapterProgress;
  elements.panelTitle.textContent = panelTitle;
  elements.panelDesc.textContent = description;
  elements.objectiveText.textContent = objective;
  elements.quoteText.textContent = stage.quote;
  elements.mapHintText.textContent = stage.hint;
  elements.progressLabel.textContent = stage.progressLabel;

  elements.primaryContent.animate(
    [
      { opacity: 0.25, transform: "translateY(4px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 340, easing: "ease" }
  );
}

function updateProgressUi(index) {
  const pips = [...elements.timelinePips.children];
  pips.forEach((pip, pipIndex) => {
    pip.classList.toggle("active", pipIndex === index);
    pip.classList.toggle("done", pipIndex < index);
  });
}

function updateLandmarks(index) {
  document.querySelectorAll(".landmark").forEach((landmark) => {
    const target = Number(landmark.dataset.landmark);
    landmark.classList.toggle("active", target === index);
    landmark.classList.toggle("done", index > target);
  });
}

function updatePlayer(fraction) {
  const point = elements.routePath.getPointAtLength(routeLength * fraction);
  const x = point.x;
  const y = point.y;

  elements.player.style.left = `${(x / 1400) * 100}%`;
  elements.player.style.top = `${(y / 720) * 100}%`;
  elements.mapScene.style.setProperty("--cam-x", `${700 - x}px`);
  elements.routeProgress.style.strokeDasharray = `${routeLength} ${routeLength}`;
  elements.routeProgress.style.strokeDashoffset = `${routeLength * (1 - fraction)}`;

  if (!mapReady) {
    elements.player.style.transition = "none";
    window.requestAnimationFrame(() => {
      elements.player.style.removeProperty("transition");
      mapReady = true;
    });
  }
}

/* ------------------------------------------------------------------
 * 行动按钮
 * ------------------------------------------------------------------ */

function renderActions() {
  elements.choiceArea.replaceChildren();

  if (state.stage === 0) {
    const button = primaryButton("翻开航海日志", () => {
      runAction(button, (token) => startClue(token));
    });
    elements.choiceArea.appendChild(button);
    return;
  }

  if (state.stage === 1) {
    const button = primaryButton("把线索放上星盘", () => {
      runAction(button, (token) => decodeClue(token));
    });
    elements.choiceArea.appendChild(button);
    return;
  }

  if (state.stage === 2) {
    const fireflyChoice = choiceButton({
      icon: "萤",
      title: "追随蓝萤火",
      description: "也许会遇到月桂树，也许只有一场梦",
      recommended: true,
      onClick: () => chooseForestRoute("fireflies", fireflyChoice)
    });

    const stoneChoice = choiceButton({
      icon: "阶",
      title: "沿旧石阶前行",
      description: "更稳妥的路，石阶上也许留有刻痕",
      onClick: () => chooseForestRoute("stairs", stoneChoice)
    });

    elements.choiceArea.append(fireflyChoice, stoneChoice);
    return;
  }

  if (state.stage === 3) {
    if (state.hasMoonBranch) {
      const offerChoice = choiceButton({
        icon: "枝",
        title: "向守卫献上月桂枝",
        description: "月桂的香气，或许能让它想起从前",
        recommended: true,
        onClick: () => attemptGuard("offer", offerChoice)
      });
      elements.choiceArea.appendChild(offerChoice);
    }

    const sneakChoice = choiceButton({
      icon: "影",
      title: "躲进断裂的石柱",
      description: "贴着阴影移动，失败后它会再次打盹",
      recommended: !state.hasMoonBranch && state.guardAttempts === 0,
      onClick: () => attemptGuard("sneak", sneakChoice)
    });

    const negotiateChoice = choiceButton({
      icon: "图",
      title: "举起星图与守卫交涉",
      description: "告诉它，你也追过同一片星空",
      onClick: () => attemptGuard("negotiate", negotiateChoice)
    });

    elements.choiceArea.append(sneakChoice, negotiateChoice);

    if (state.guardAttempts > 0) {
      const waitChoice = choiceButton({
        icon: "月",
        title: "等月光第三次掠过石像",
        description: "屏住呼吸，这次一定不会被发现",
        recommended: true,
        onClick: () => attemptGuard("wait", waitChoice)
      });
      elements.choiceArea.appendChild(waitChoice);
    }
    return;
  }

  if (state.stage === 4) {
    elements.choiceArea.innerHTML = `
      <div class="rune-puzzle" id="runePuzzle">
        <p class="star-hint">手记上的小字被月光照亮：先斟满 <em>月杯</em>，再拔起 <em>星剑</em>，最后戴上 <em>月冠</em>。</p>
        <div class="rune-grid" role="group" aria-label="星盘符文">
          <button class="rune-button" type="button" data-rune="moon">
            <span class="rune-symbol">☾</span>
            <strong>月杯</strong>
          </button>
          <button class="rune-button" type="button" data-rune="sword">
            <span class="rune-symbol">✦</span>
            <strong>星剑</strong>
          </button>
          <button class="rune-button" type="button" data-rune="crown">
            <span class="rune-symbol">♛</span>
            <strong>月冠</strong>
          </button>
        </div>
        <div class="rune-progress">
          <span id="runeStatus">等待第一枚符文亮起</span>
          <div class="rune-dots" aria-hidden="true"><i></i><i></i><i></i></div>
        </div>
      </div>
    `;
    return;
  }

  if (state.stage === 5) {
    const button = primaryButton("转动日月锁", () => {
      runAction(button, (token) => openTreasure(token));
    });
    elements.choiceArea.appendChild(button);
  }
}

function primaryButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "primary-action";
  button.type = "button";
  button.innerHTML = `<span>${label}</span><span class="button-arrow">→</span>`;
  button.addEventListener("click", onClick);
  return button;
}

function choiceButton({ icon, title, description, recommended = false, onClick }) {
  const button = document.createElement("button");
  button.className = `choice-button${recommended ? " recommended" : ""}`;
  button.type = "button";

  const iconElement = document.createElement("span");
  iconElement.className = "choice-icon";
  iconElement.textContent = icon;

  const copy = document.createElement("span");
  copy.className = "choice-copy";

  const strong = document.createElement("strong");
  strong.textContent = title;

  const small = document.createElement("small");
  small.textContent = description;

  copy.append(strong, small);
  button.append(iconElement, copy);
  button.addEventListener("click", onClick);
  return button;
}

/* ------------------------------------------------------------------
 * 异步寻宝流程：全部使用 async / await
 * ------------------------------------------------------------------ */

async function startClue(token) {
  addLog("你抽出那本航海日志，灰尘像细小的星屑一样浮起来。");
  const clue = await TreasureMap.getInitialClue(1100);
  assertActive(token);

  addLog(clue, "clue");
  grantClue(1, "潮汐航线");
  flashScene();
  playChime("clue");
  await pause(760);
  assertActive(token);
  goToStage(1);
}

async function decodeClue(token) {
  addLog("你把羊皮纸铺在青铜星盘上，星盘边缘的刻度一圈圈亮了起来。");
  const location = await TreasureMap.decodeAncientScript(
    "潮汐与星轨在北纬三十一度交汇",
    1500
  );
  assertActive(token);

  addLog(location, "clue");
  grantClue(1, "雾隐谷坐标");
  flashScene();
  playChime("clue");
  await pause(760);
  assertActive(token);
  goToStage(2);
}

async function chooseForestRoute(route, button) {
  runAction(button, async (token) => {
    addLog(
      route === "fireflies"
        ? "你跟着蓝萤火拐进一条窄路，雾在身后悄悄合拢。"
        : "你踏上旧石阶，靴底敲出的回声被森林吞得很远。"
    );

    const finding = route === "fireflies"
      ? await TreasureMap.followFireflies(1700)
      : await TreasureMap.takeStonePath(1600);
    assertActive(token);

    state.route = route;
    addLog(finding.text, "event");

    if (finding.luck > 0) {
      state.luck += finding.luck;
      state.hasMoonBranch = true;
      renderStats(true);
      showToast(`奇遇 · 获得「${finding.title}」 · 幸运 +${finding.luck}`);
    } else if (finding.clue > 0) {
      state.clues += finding.clue;
      renderStats(true);
      showToast(`发现 · ${finding.title} · 线索 +${finding.clue}`);
    }

    flashScene();
    playChime("clue");
    await pause(880);
    assertActive(token);
    goToStage(3);
  });
}

async function attemptGuard(mode, button) {
  runAction(button, async (token) => {
    const attemptLabels = {
      offer: "你把月桂枝轻轻放在守卫脚边。石像低头闻了闻，眼里的光晃了一下。",
      sneak: "你贴着断裂的石柱移动，尽量让呼吸和雾一样轻。",
      negotiate: "你举起星图，让月光落在那些交错的航线上。",
      wait: "你退回侧廊，数着石像的呼吸，等待月光第三次掠过它的额头。"
    };
    addLog(attemptLabels[mode] || "你试着从守卫身边经过。");

    try {
      const result = await TreasureMap.searchTemple("回响神庙", {
        mode,
        attempt: state.guardAttempts,
        hasBranch: state.hasMoonBranch
      });
      assertActive(token);

      state.guardOutcome = mode;
      elements.guardian.classList.remove("awake");
      elements.guardian.classList.add("calm");
      addLog(result, "event");
      showToast("守卫让开了道路 · 神庙深处传来潮声");
      flashScene();
      playChime("clue");
      await pause(920);
      assertActive(token);
      goToStage(4);
    } catch (error) {
      if (error.name === "AbortError") {
        throw error;
      }

      state.guardAttempts += 1;
      state.luck = Math.max(0, state.luck - 1);
      renderStats(true);
      addLog(`${error.message} 你退回廊柱后，守卫似乎又打了个哈欠。`, "warn");
      showToast("惊动守卫 · 幸运 -1 · 它开始露出破绽");
      setAsyncStatus("守卫仍在巡视", false);
      playChime("warn");
      await pause(900);
      assertActive(token);
      renderStageCopy(3);
      renderActions();
    }
  });
}

async function beginStarPuzzle(token) {
  setAsyncStatus("星盘等待点亮", false);

  try {
    const sequence = await waitForStarSequence(token);
    assertActive(token);

    setAsyncStatus("星盘共鸣中", true);
    addLog("月杯、星剑与月冠依次亮起，三束星光在祭坛上空交织。", "event");
    playChime("clue");
    flashScene();

    const result = await TreasureMap.alignConstellation(sequence, 1100);
    assertActive(token);

    addLog(result, "clue");
    state.clues += 1;
    renderStats(true);
    showToast("星盘已校准 · 祭坛中央的宝箱显现了");
    await pause(820);
    assertActive(token);
    goToStage(5);
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    addLog(`星盘没有回应：${error.message}`, "warn");
    setAsyncStatus("星盘等待点亮", false);
  }
}

function waitForStarSequence(token) {
  return new Promise((resolve) => {
    const order = ["moon", "sword", "crown"];
    const puzzle = document.getElementById("runePuzzle");
    const status = document.getElementById("runeStatus");
    const buttons = [...elements.choiceArea.querySelectorAll(".rune-button")];
    const dots = [...elements.choiceArea.querySelectorAll(".rune-dots i")];
    let progress = 0;
    let locked = false;

    const paintDots = () => {
      dots.forEach((dot, index) => dot.classList.toggle("on", index < progress));
    };

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        if (!isActive(token) || locked) {
          return;
        }

        if (button.dataset.rune === order[progress]) {
          button.classList.add("lit");
          button.disabled = true;
          progress += 1;
          paintDots();
          playChime("star", progress);
          status.textContent = progress === 3
            ? "三枚符文都已就位"
            : `星光正在汇聚 · ${progress} / 3`;

          if (progress === order.length) {
            locked = true;
            resolve([...order]);
          }
          return;
        }

        locked = true;
        state.starMistakes += 1;
        puzzle.classList.add("wrong");
        status.textContent = "星轨错位了，符文退回了原位";
        playChime("warn");

        await pause(560);
        if (!isActive(token)) {
          return;
        }

        buttons.forEach((runeButton) => {
          runeButton.classList.remove("lit");
          runeButton.disabled = false;
        });
        progress = 0;
        paintDots();
        status.textContent = "再听一次月光的提示";
        puzzle.classList.remove("wrong");
        locked = false;
      });
    });
  });
}

async function openTreasure(token) {
  addLog("你把掌心贴在日月锁上，两轮凹槽沿着相反的方向缓缓转动。");
  const message = await TreasureMap.openTreasureBox(1200);
  assertActive(token);

  elements.sceneFrame.classList.add("chest-open");
  state.clues += 1;
  renderStats(true);
  addLog(message, "clue");
  showToast("宝箱开启 · 月蚀星砂在你掌心微微发亮");
  flashScene();
  playChime("win");

  await pause(1900);
  assertActive(token);
  finishGame();
}

/* ------------------------------------------------------------------
 * 行动状态、统计和提示
 * ------------------------------------------------------------------ */

async function runAction(button, task) {
  const token = state.token;
  if (!isActive(token)) {
    return;
  }

  setLoading(button, true);
  setAsyncStatus("等待月光回应", true);

  try {
    await task(token);
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    console.error(error);
    addLog(`旅途中出现了意外：${error.message || error}`, "warn");
    showToast("这一步没有成功，再试一次吧");
  } finally {
    setLoading(button, false);
    if (isActive(token)) {
      if (state.stage === 4) {
        setAsyncStatus("星盘等待点亮", false);
      } else if (state.stage === 3 && state.guardAttempts > 0) {
        setAsyncStatus("守卫仍在巡视", false);
      } else {
        setAsyncStatus("等待行动", false);
      }
    }
  }
}

function setLoading(button, loading) {
  if (!button) {
    return;
  }
  button.classList.toggle("loading", loading);
  button.disabled = loading;
}

function setAsyncStatus(text, busy) {
  elements.asyncStatus.classList.toggle("busy", busy);
  elements.asyncStatus.innerHTML = `<i></i> ${text}`;
}

function grantClue(amount, label) {
  state.clues += amount;
  renderStats(true);
  showToast(`线索 +${amount} · ${label}`);
}

function renderStats(pop = false) {
  elements.clueCount.textContent = String(state.clues).padStart(2, "0");
  elements.luckCount.textContent = state.luck > 0 ? `✦ ${state.luck}` : "✦";

  if (pop) {
    [elements.clueCount, elements.luckCount].forEach((element) => {
      element.classList.remove("pop");
      void element.offsetWidth;
      element.classList.add("pop");
    });
  }
}

function addLog(message, type = "normal") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;

  const time = document.createElement("time");
  time.textContent = formatTime(state.startedAt ? Date.now() - state.startedAt : 0);

  const text = document.createElement("span");
  text.textContent = message;

  entry.append(time, text);
  elements.logList.appendChild(entry);
  state.logTotal += 1;
  elements.logCount.textContent = String(state.logTotal).padStart(2, "0");

  while (elements.logList.children.length > 36) {
    elements.logList.removeChild(elements.logList.firstElementChild);
  }

  elements.logList.scrollTop = elements.logList.scrollHeight;
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toastText.textContent = message;
  elements.toast.classList.add("show");

  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2800);
}

function flashScene() {
  elements.sceneFlash.classList.remove("fire");
  void elements.sceneFlash.offsetWidth;
  elements.sceneFlash.classList.add("fire");
  window.setTimeout(() => elements.sceneFlash.classList.remove("fire"), 1200);
}

function finishGame() {
  state.elapsed = state.startedAt ? Date.now() - state.startedAt : state.elapsed;
  state.running = false;
  state.over = true;
  clearInterval(state.timerId);

  elements.timer.textContent = formatTime(state.elapsed);
  elements.endTime.textContent = formatTime(state.elapsed);
  elements.endClues.textContent = String(state.clues);
  elements.endLuck.textContent = String(state.luck);
  elements.endingText.textContent = getEndingText();
  elements.ending.hidden = false;
  elements.ending.style.animation = "none";
  void elements.ending.offsetWidth;
  elements.ending.style.animation = "";
  setAsyncStatus("旅程已完成", false);
  addLog("月蚀星砂记住了这一夜的天空，也记住了你走过的每一条路。", "clue");
  playChime("win");
}

function getEndingText() {
  const guardEndings = {
    offer: "守卫在你离开时轻轻低头。它守了千年的不是财宝，而是一句“总会有人记得这片星空”的承诺。",
    negotiate: "石像终于明白你不是来掠夺的。它让开道路，把观星者留在人间的最后一页天图交给你。",
    sneak: "你回头时，神庙门缝里亮起一双琥珀色的眼睛。守卫没有追来，只把一段记忆轻轻放进了你的口袋。",
    wait: "月光第三次掠过石像时，它缓缓闭上了眼。你从侧廊走过，听见它用石头的声音说了一声“晚安”。"
  };

  const routeEnding = state.route === "fireflies"
    ? "蓝萤火一路把你送到山脚，像一场不肯醒来的梦。"
    : "旧石阶在你身后一节一节沉入雾里，石缝中的苔藓还留着微光。";

  const guardEnding = guardEndings[state.guardOutcome]
    || "神庙在你身后重新沉入月色，像一封写完又合上的信。";

  return `${guardEnding}${routeEnding}星砂在你掌心微微发亮，像是在等待下一个故事。`;
}

/* ------------------------------------------------------------------
 * 音效
 * ------------------------------------------------------------------ */

function toggleSound() {
  state.sound = !state.sound;
  elements.soundBtn.classList.toggle("is-muted", !state.sound);
  elements.soundBtn.setAttribute("aria-label", state.sound ? "关闭音效" : "开启音效");

  if (state.sound) {
    ensureAudio();
    playChime("star", 1);
  }
}

function ensureAudio() {
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  } catch (error) {
    console.warn("音频不可用：", error);
  }
}

function playChime(kind, step = 0) {
  if (!state.sound) {
    return;
  }

  ensureAudio();
  if (!audioContext) {
    return;
  }

  const chordMap = {
    start: [329.63, 440, 554.37],
    clue: [523.25, 659.25, 783.99],
    warn: [246.94, 196],
    win: [392, 523.25, 659.25, 783.99]
  };

  let notes = chordMap[kind] || [440];
  if (kind === "star") {
    notes = [[440], [523.25], [659.25]][Math.max(0, Math.min(2, step - 1))] || [440];
  }

  const startTime = audioContext.currentTime + 0.02;

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const noteStart = startTime + index * 0.085;
    const duration = kind === "warn" ? 0.35 : 0.7;

    oscillator.type = kind === "warn" ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.035, noteStart + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration + 0.05);
  });
}

/* ------------------------------------------------------------------
 * 工具
 * ------------------------------------------------------------------ */

function isActive(token) {
  return token === state.token && state.running;
}

function assertActive(token) {
  if (!isActive(token)) {
    throw new CancelledError();
  }
}

function pause(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------
 * 保留原实验的 Promise 链写法，并给出 async / await 对照版本。
 * 可以在浏览器控制台调用，用于观察两种写法的执行顺序。
 * ------------------------------------------------------------------ */

function findTreasureWithPromises() {
  return TreasureMap.getInitialClue()
    .then((clue) => {
      console.log(clue);
      return TreasureMap.decodeAncientScript(clue);
    })
    .then((location) => {
      console.log(location);
      return TreasureMap.searchTemple(location);
    })
    .then((box) => {
      console.log(box);
      return TreasureMap.openTreasureBox();
    })
    .then((treasure) => {
      console.log(treasure);
      return treasure;
    })
    .catch((error) => {
      console.error("任务失败:", error.message || error);
    });
}

async function findTreasureWithAsync() {
  try {
    const clue = await TreasureMap.getInitialClue();
    console.log(clue);

    const location = await TreasureMap.decodeAncientScript(clue);
    console.log(location);

    const box = await TreasureMap.searchTemple(location, { mode: "wait" });
    console.log(box);

    const treasure = await TreasureMap.openTreasureBox();
    console.log(treasure);
    return treasure;
  } catch (error) {
    console.error("任务失败:", error.message || error);
  }
}

window.TreasureMap = TreasureMap;
window.findTreasureWithPromises = findTreasureWithPromises;
window.findTreasureWithAsync = findTreasureWithAsync;
window.moonlitTreasure = { state, STAGES };

init();
