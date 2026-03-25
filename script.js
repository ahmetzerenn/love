/**
 * Şablon — katmanlı romantik deneyim (vanilla JS)
 *
 * Bölümler:
 * 1. Yapılandırma + metin havuzu (COPY)
 * 2. Şifre sistemi
 * 3. Oturum / tekrar ziyaret
 * 4. Intro
 * 5. Scroll + parallax
 * 6. Zamanlayıcı
 * 7. Gizli etkileşimler
 * 8. Kullanıcı yazı anı
 * 9. Doğum günü
 * 10. Ses
 * 11. Final
 * 12. Akış (aşamalı açılım, gecikmeler, kaydırmaya duyarlı CTA)
 * 13. Kaydırmaya tepki (derinlik, durunca fısıltı, hızlı kaydırmada gecikme)
 */

// =============================================================================
// YAPILANDIRMA
// =============================================================================
var GATE_PASSWORD = "love";

/** Birlikte sayılan başlangıç: YYYY-MM-DD */
var RELATIONSHIP_START_ISO = "2020-01-01";

/** Doğum günü: ay 1–12, gün 1–31 */
var BIRTHDAY_MONTH = 6;
var BIRTHDAY_DAY = 15;

/**
 * true: doğum günü teması (şerit, sıcaklık, ek panel) her ziyarette.
 * false: yalnızca BIRTHDAY_MONTH/BIRTHDAY_DAY ile eşleşen günde.
 */
var BIRTHDAY_EXPERIENCE_ALWAYS = true;

var STORAGE_NEXT_RETURN = "love_next_visit_return";

/** Ritim: giriş ve bölümler arası ms (reduce-motion kısaltır) */
var PACING = {
  gateDeferMs: 1500,
  introLinePauseMs: 1500,
  introButtonAfterLineMs: 3200,
  storyTimerMs: 900,
  storyAudioMs: 650,
  lineAfterPauseMs: 1300,
  /** Mikro-gerilim: cümle yarısından sonra ikinci yarı (ms) */
  tensionGapMs: 1400,
};

// =============================================================================
// METİN ŞABLONLARI — hepsi duygusal placeholder (lorem yok)
// =============================================================================
var COPY = {
  gateError: "Bu kadar kolay değildi.",

  sessionFirst: "Bu deneyim sadece ilk seferinde böyle olacak.",
  sessionReturn: "Tekrar buradasın…",

  /** [PLACEHOLDER: giriş cümlesi] — tam metin (reduced-motion / yedek) */
  introLine:
    "Bazı şeyler yüz yüze söylenince titrer; bu yüzden kelimeleri buraya bıraktım.",

  /**
   * Sadece birkaç duygusal satır: iki parça + aradaki bekleme (ms).
   * Tetikleyici: reveal = panel görünür görünmez; line-pause = satır gecikmesinden sonra.
   */
  tensionLines: {
    intro: {
      parts: [
        "Bazı şeyler yüz yüze söylenince titrer;",
        " bu yüzden kelimeleri buraya bıraktım.",
      ],
      ms: 1300,
    },
    panel4aFirst: {
      parts: ["Sonra anladım:", " bu his sadece beğenmek değilmiş."],
      ms: 1500,
    },
    panel4aReturn: {
      parts: ["Gerçekleşme anı yavaş gelir;", " acele etmez."],
      ms: 1400,
    },
    panel5bFirst: {
      parts: ["Yine de bir yerlerde", " sana güvenmeyi seçtim."],
      ms: 1600,
    },
    panel5bReturn: {
      parts: ["Umarım bu satırlar", " yine yumuşak gelir."],
      ms: 1500,
    },
  },

  timerLabelFirst: "Birlikte sayılan süre",
  timerLabelReturn: "Hâlâ aynı yöne işliyor",

  /** Gece yarısından bu yana (bugün) */
  todayTimerLabel: "Bugünün eşiğinden beri geçen süre",

  /** Kaydırma ~%38’den sonra: zamanlayıcı etiketi (ince varyasyon) */
  timerLabelScrollDeep: "Bu süre seninle birlikte büyüyor.",
  timerLabelReturnScrollDeep: "Hâlâ ilerliyor — seninle birlikte.",

  /** Kaydırma durunca kısa süre beliren fısıltı */
  scrollIdleWhisper: "Durduğun her yerde bir şey kaldı.",

  panelsFirst: {
    1: [
      "Bugün sıradan bir gün değil.",
      "Belki sessiz bir oda, belki gürültünün tam ortası — okurken nerede durduğunu merak ettim.",
    ],
    2: [
      "İlk kez fark ettiğim an hâlâ net: ışık nasıl düşmüştü yüzüne.",
      "O anın küçük bir detayıydı — ama bende kaldı.",
    ],
    3: [
      "Fark etmediğin şeyler de oldu; gözümün kenarından izledim.",
      "Sessizce, suçlamadan, sadece orada olduğunu bilerek.",
    ],
    4: [
      "Sonra anladım: bu his sadece beğenmek değilmiş.",
      "İçimi yumuşatan, düşündüren bir şeymiş.",
    ],
    5: [
      "Kırılganlığımı göstermekten korktuğum zamanlar oldu.",
      "Yine de bir yerlerde sana güvenmeyi seçtim.",
    ],
    6: [
      "Şu an, bu ekranda, kelimelerin bittiği yerde duruyorum.",
      "Ve düşünüyorum: belki sen de hissediyorsundur.",
    ],
  },

  panelsReturn: {
    1: [
      "Bugün sıradan bir gün değil — bunu tekrar okuduğunda da hissettim.",
      "Geri döndüğünde aynı cümleler başka türlü oturuyor; belki de bugünün yüzünden.",
    ],
    2: [
      "Anılar yeniden oynatıldığında küçük detaylar öne çıkıyor.",
      "O günün kokusu, sesi — hâlâ yakın.",
    ],
    3: [
      "İlk okuyuşta kaçan şeyler, ikincide daha görünür oluyor.",
      "Bu da onlardan biriydi belki.",
    ],
    4: [
      "Gerçekleşme anı yavaş gelir; acele etmez.",
      "Ben de bu yüzden burada bekledim.",
    ],
    5: [
      "İkinci kez okumak, savunmaları inceltir.",
      "Umarım bu satırlar yine yumuşak gelir.",
    ],
    6: [
      "Şimdi buradasın — yine, bilerek.",
      "Bu seçimin kendisi bile bir cevap.",
    ],
  },

  /** Hover ile açılan (section 2) — iki ziyarette aynı veya farklı */
  panel2HoverFirst: "O günlerde zaman daha yavaşmış gibi geliyordu.",
  panel2HoverReturn: "Tekrar dönmek, aynı yolu başka tempoda yürümek gibi.",

  /** Gecikmeli satır (section 5) */
  delayedLine:
    "…ve bazen en doğru cümle, en sessiz olanıdır.",

  /** Gizli nokta */
  dotMessage: "Bunu fark edeceğini düşünmemiştim.",

  /** Beklenmedik tıklama (timer altı) */
  whisperClick: "Buraya dokunacağını kimseye söyleme.",

  /** Ortada açılan doğum günü satırları */
  birthdayRevealA: "Aslında bugün…",
  birthdayRevealB: "Bugün senin doğum günün.",

  /** Doğum günü paneli */
  birthdayBanner: "Bugün, diğer günlerin yanında daha yumuşak duruyor.",
  birthdayA: "Bu sayfa bugün için seçildi; kelimeler acele etmeden, senin ritminde açılıyor.",
  birthdayB: "İyi ki varsın. Bu satırlar yalnızca sana.",

  /** Hediye anı — tıklanınca gösterilen kısa fısıltı (isteğe bağlı) */
  giftMomentHint: "Son nefes, son satırlarda.",

  /** Kullanıcı yazısı cevabı */
  interactionResponse:
    "[PLACEHOLDER: cevap mesajı — okuduğunu hissettim; kelimelerin burada kalsın.]",

  /** Tekrar ziyaret ek mesajı (pre-final) */
  returnExtra:
    "[PLACEHOLDER: tekrar mesajı — seni bir kez daha burada görmek iyi geldi.]",

  preFinalFirst: [
    "Buraya kadar okuduysan, nefes al.",
    "Gerisi sende; ben sadece kelimeleri bıraktım.",
  ],
  preFinalReturn: [
    "Tekrar gelmen… bunun anlamını fazla açıklamayacağım.",
    "Sadece teşekkür ederim.",
  ],

  /** Final overlay — doğum gününe bağlı kapanış */
  finalLines: [
    "Bu sayfa küçük bir durak; bugünün kenarında, senin için durdurulmuş bir nefes.",
    "Her satır, seni düşünerek yavaşlatıldı — çünkü bazı günler acele etmez.",
    "Dünyaya çıktığın o ilk ana sessizce teşekkür ederim; o an olmasaydı, bu satırlar da olmazdı.",
    "Gerisi yüz yüze, ya da bir sonraki sessizlikte — ama bugün senden yana.",
    "İyi ki doğdun.",
  ],

  /** Akış köprüleri (görsel aynı; sadece metin) */
  flowBridge1Hint: "Bir sonraki satırlara geçmeden önce, nefes al.",
  flowBridge2Hint: "Son sözlere gelmeden önce — bir kez daha seç.",

  /** Zamanlayıcı altında, bekleyince beliren fısıltı */
  timerWhisper: "Bu süre sessizce işliyor; sen okurken durmuyor.",

  /** Odaklanınca etiket yumuşar (aynı blok, farklı ton) */
  interactionLabelFocus: "Bekliyorum; acele yok.",

  /** Kaydırma ile final CTA metni (ince varyasyon) */
  finalCtaScroll: ["Son bir şey var", "Buraya kadar geldin", "Son bir şey var"],
};

// =============================================================================
// YARDIMCILAR
// =============================================================================
function $(id) {
  return document.getElementById(id);
}

function normalizePassword(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function parseLocalDate(iso) {
  var parts = iso.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
}

function isReturnVisit() {
  return localStorage.getItem(STORAGE_NEXT_RETURN) === "1";
}

function setReturnVisitForNextTime() {
  localStorage.setItem(STORAGE_NEXT_RETURN, "1");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function pacingMs(key) {
  if (prefersReducedMotion()) {
    if (key === "gateDeferMs") return 120;
    return 0;
  }
  return PACING[key];
}

/** px/ms — hızlı kaydırmada içerik gecikmesi için örneklenir */
var scrollVelocity = { y: 0, t: 0, speed: 0 };

function sampleScrollVelocity() {
  var y = window.scrollY;
  var t = performance.now();
  if (scrollVelocity.t > 0) {
    var dt = t - scrollVelocity.t;
    if (dt > 0) {
      scrollVelocity.speed = Math.abs(y - scrollVelocity.y) / dt;
    }
  }
  scrollVelocity.y = y;
  scrollVelocity.t = t;
}

/** Hızlı kaydırmada satır / gerilim gecikmesine eklenecek ms (0–260) */
function getFastScrollExtraMs() {
  if (prefersReducedMotion()) return 0;
  var s = scrollVelocity.speed;
  if (s < 1.12) return 0;
  return Math.min(260, Math.floor((s - 1.12) * 195));
}

/** Cümle bölme (mikro-gerilim) — element → ikinci parça + gecikme */
var tensionStore = new WeakMap();

/**
 * @param {HTMLElement} el
 * @param {string} partA
 * @param {string} partB
 * @param {number} ms
 * @param {"reveal"|"line-pause"} trigger
 * @param {{ intro?: boolean }} opts
 */
function registerTension(el, partA, partB, ms, trigger, opts) {
  opts = opts || {};
  if (!el) return;
  if (prefersReducedMotion()) {
    el.textContent = partA + partB;
    return;
  }
  el.textContent = "";
  if (!opts.intro) el.classList.add("panel__line--tension");
  el.setAttribute("data-tension-line", "");
  el.setAttribute("data-tension-trigger", trigger || "reveal");
  var a = document.createElement("span");
  a.className = "tension-part tension-part--a";
  a.textContent = partA;
  var b = document.createElement("span");
  b.className = "tension-part tension-part--b";
  b.setAttribute("aria-hidden", "true");
  el.appendChild(a);
  el.appendChild(b);
  tensionStore.set(el, { partB: partB, ms: ms });
}

function revealTensionSecondHalf(el) {
  if (!el || el.getAttribute("data-tension-fired") === "1") return;
  var data = tensionStore.get(el);
  if (!data) return;
  el.setAttribute("data-tension-fired", "1");
  var fastExtra =
    el.getAttribute("data-tension-trigger") === "reveal"
      ? getFastScrollExtraMs()
      : 0;
  var ms = (prefersReducedMotion() ? 0 : data.ms) + fastExtra;
  window.setTimeout(function () {
    var b = el.querySelector(".tension-part--b");
    if (!b || !data.partB) return;
    b.textContent = data.partB;
    b.removeAttribute("aria-hidden");
    void b.offsetWidth;
    b.classList.add("is-revealed");
  }, ms);
}

function revealTensionInRevealContainer(container) {
  if (!container) return;
  container
    .querySelectorAll('[data-tension-line][data-tension-trigger="reveal"]')
    .forEach(function (line) {
      revealTensionSecondHalf(line);
    });
}

// =============================================================================
// DOM METİN DOLDURMA
// =============================================================================
function fillIntroLine() {
  var el = $("intro-line");
  if (!el) return;
  var spec = COPY.tensionLines && COPY.tensionLines.intro;
  if (spec && spec.parts && spec.parts.length === 2) {
    registerTension(
      el,
      spec.parts[0],
      spec.parts[1],
      spec.ms != null ? spec.ms : pacingMs("tensionGapMs"),
      "reveal",
      { intro: true }
    );
  } else {
    el.textContent = COPY.introLine;
  }
}

function applyPanelCopy(isReturn) {
  var pack = isReturn ? COPY.panelsReturn : COPY.panelsFirst;
  var hover2 = isReturn ? COPY.panel2HoverReturn : COPY.panel2HoverFirst;

  function setPair(aId, bId, lines) {
    var a = $(aId);
    var b = $(bId);
    if (a) a.textContent = lines[0];
    if (b) b.textContent = lines[1];
  }

  setPair("panel-1-a", "panel-1-b", pack[1]);
  var p2a = $("panel-2-a");
  var p2b = $("panel-2-b");
  if (p2a) p2a.textContent = pack[2][0];
  if (p2b) p2b.textContent = hover2;
  setPair("panel-3-a", "panel-3-b", pack[3]);
  setPair("panel-4-a", "panel-4-b", pack[4]);
  var tl = COPY.tensionLines;
  var t4 = tl && (isReturn ? tl.panel4aReturn : tl.panel4aFirst);
  if (t4 && t4.parts && t4.parts.length === 2) {
    registerTension(
      $("panel-4-a"),
      t4.parts[0],
      t4.parts[1],
      t4.ms != null ? t4.ms : pacingMs("tensionGapMs"),
      "reveal"
    );
  }
  setPair("panel-5-a", "panel-5-b", pack[5]);
  var t5 = tl && (isReturn ? tl.panel5bReturn : tl.panel5bFirst);
  if (t5 && t5.parts && t5.parts.length === 2) {
    registerTension(
      $("panel-5-b"),
      t5.parts[0],
      t5.parts[1],
      t5.ms != null ? t5.ms : pacingMs("tensionGapMs"),
      "line-pause"
    );
  }
  var d = $("panel-5-delayed");
  if (d) d.textContent = COPY.delayedLine;
  setPair("panel-6-a", "panel-6-b", pack[6]);

  var brA = $("birthday-reveal-a");
  var brB = $("birthday-reveal-b");
  if (brA) brA.textContent = COPY.birthdayRevealA;
  if (brB) brB.textContent = COPY.birthdayRevealB;

  var timerLabelEl = $("timer-label");
  if (timerLabelEl) {
    timerLabelEl.textContent = isReturn ? COPY.timerLabelReturn : COPY.timerLabelFirst;
  }

  var todayLbl = $("today-timer-label");
  if (todayLbl && COPY.todayTimerLabel) {
    todayLbl.textContent = COPY.todayTimerLabel;
  }

  var preA = $("pre-final-a");
  var preB = $("pre-final-b");
  var arr = isReturn ? COPY.preFinalReturn : COPY.preFinalFirst;
  if (preA) preA.textContent = arr[0];
  if (preB) preB.textContent = arr[1];

  var preR = $("pre-final-return");
  if (preR) {
    if (isReturn) {
      preR.textContent = COPY.returnExtra;
      preR.classList.remove("is-hidden");
    } else {
      preR.classList.add("is-hidden");
    }
  }
}

function buildFinalOverlayHTML() {
  var root = $("final-lines");
  if (!root) return;
  root.innerHTML = "";
  var n = COPY.finalLines.length;
  COPY.finalLines.forEach(function (line, i) {
    var p = document.createElement("p");
    p.className = "overlay__line";
    if (i === n - 1) p.classList.add("overlay__line--birthday");
    p.textContent = line;
    root.appendChild(p);
  });
}

function fillFlowBridgeHints() {
  var h1 = $("flow-bridge-1-hint");
  var h2 = $("flow-bridge-2-hint");
  if (h1) h1.textContent = COPY.flowBridge1Hint;
  if (h2) h2.textContent = COPY.flowBridge2Hint;
  var idle = $("scroll-idle-whisper");
  if (idle && COPY.scrollIdleWhisper) idle.textContent = COPY.scrollIdleWhisper;
}

function unlockStoryFlowForReducedMotion() {
  if (!prefersReducedMotion()) return;
  var rest = $("story-rest");
  if (rest) {
    rest.classList.remove("is-hidden");
    rest.setAttribute("aria-hidden", "false");
  }
  var gated = $("story-gated");
  var tail = $("story-tail");
  var b1 = $("flow-bridge-1");
  var b2 = $("flow-bridge-2");
  if (gated) {
    gated.classList.remove("is-hidden");
    gated.setAttribute("aria-hidden", "false");
  }
  if (tail) {
    tail.classList.remove("is-hidden");
    tail.setAttribute("aria-hidden", "false");
  }
  if (b1) b1.classList.add("is-hidden");
  if (b2) b2.classList.add("is-hidden");
  var sc = $("story-continue");
  if (sc) {
    sc.classList.add("is-hidden");
    sc.setAttribute("aria-hidden", "true");
  }
  var gift = $("gift-moment");
  var finalBtn = $("final-btn");
  if (gift) {
    gift.classList.add("is-hidden");
    gift.setAttribute("aria-hidden", "true");
  }
  if (finalBtn) {
    finalBtn.classList.remove("is-hidden");
    finalBtn.setAttribute("aria-hidden", "false");
  }
}

// =============================================================================
// GÖRSEL YEDEK
// =============================================================================
function initImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      var fb = img.getAttribute("data-fallback");
      if (fb) img.src = fb;
    });
  });
}

// =============================================================================
// KONFETİ
// =============================================================================
function launchConfetti(root) {
  if (!root) return;
  root.innerHTML = "";
  root.setAttribute("aria-hidden", "false");
  var count = 34;
  for (var i = 0; i < count; i++) {
    var p = document.createElement("span");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = "-8px";
    p.style.animationDelay = Math.random() * 0.4 + "s";
    p.style.animationDuration = 1.2 + Math.random() * 0.8 + "s";
    var hue = 18 + Math.random() * 28;
    p.style.background =
      "hsla(" + hue + ", 45%, 72%, " + (0.35 + Math.random() * 0.35) + ")";
    root.appendChild(p);
  }
  window.setTimeout(function () {
    root.innerHTML = "";
    root.setAttribute("aria-hidden", "true");
  }, 1900);
}

// =============================================================================
// ŞİFRE
// =============================================================================
function initGateDeferral() {
  var gate = $("gate");
  if (!gate || !gate.classList.contains("gate--waiting")) return;
  window.setTimeout(function () {
    gate.classList.remove("gate--waiting");
  }, pacingMs("gateDeferMs"));
}

function initGate() {
  var gate = $("gate");
  var form = $("gate-form");
  var input = $("gate-password");
  var errorEl = $("gate-error");
  if (!form || !gate) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorEl.textContent = "";

    var ok =
      normalizePassword(input.value) === normalizePassword(GATE_PASSWORD);
    if (!ok) {
      errorEl.textContent = COPY.gateError;
      input.select();
      return;
    }

    launchConfetti($("confetti-root"));

    window.setTimeout(function () {
      gate.classList.add("fade-out");
      var gateDone = false;
      var onEnd = function () {
        if (gateDone) return;
        gateDone = true;
        gate.classList.add("is-hidden");
        gate.setAttribute("aria-hidden", "true");
        showIntro();
      };
      gate.addEventListener("animationend", onEnd, { once: true });
      window.setTimeout(function () {
        if (!gateDone) onEnd();
      }, 1100);
    }, 1500);
  });
}

// =============================================================================
// INTRO + OTURUM
// =============================================================================
function showIntro() {
  var intro = $("intro");
  var sessionEl = $("intro-session");
  var lineEl = $("intro-line");
  var startBtn = $("intro-start");
  if (!intro || !lineEl || !startBtn) return;

  if (sessionEl) {
    sessionEl.textContent = isReturnVisit()
      ? COPY.sessionReturn
      : COPY.sessionFirst;
  }

  intro.classList.remove("is-hidden");
  intro.setAttribute("aria-hidden", "false");

  lineEl.classList.remove("intro__line--visible");
  void lineEl.offsetWidth;

  var linePause = pacingMs("introLinePauseMs");
  window.setTimeout(function () {
    window.requestAnimationFrame(function () {
      lineEl.classList.add("intro__line--visible");
      if (lineEl.querySelector(".tension-part--b")) {
        revealTensionSecondHalf(lineEl);
      }
    });
  }, linePause);

  var btnDelay = linePause + pacingMs("introButtonAfterLineMs");
  window.setTimeout(function () {
    startBtn.classList.remove("is-hidden");
    startBtn.classList.add("is-visible");
  }, btnDelay);
}

function initIntroStart() {
  var intro = $("intro");
  var startBtn = $("intro-start");
  var story = $("story");
  if (!startBtn || !intro || !story) return;

  startBtn.addEventListener("click", function () {
    var returning = isReturnVisit();

    applyPanelCopy(returning);
    if (!returning) {
      setReturnVisitForNextTime();
    }

    intro.classList.add("is-hidden");
    intro.setAttribute("aria-hidden", "true");

    document.body.classList.toggle("is-return-visit", returning);

    showStory(story);
  });
}

function scheduleTimerWhisper() {
  window.clearTimeout(scheduleTimerWhisper._t);
  var delay = prefersReducedMotion() ? 380 : 11000;
  scheduleTimerWhisper._t = window.setTimeout(revealTimerWhisper, delay);
}

function revealTimerWhisper() {
  var el = $("timer-whisper");
  if (!el || el.getAttribute("data-revealed") === "1") return;
  el.setAttribute("data-revealed", "1");
  el.textContent = COPY.timerWhisper;
  el.classList.remove("is-hidden");
  void el.offsetWidth;
  el.classList.add("is-visible");
}

function showStory(story) {
  story.classList.remove("is-hidden");
  story.setAttribute("aria-hidden", "false");
  scheduleTimerWhisper();

  var timerEl = $("timer-block");
  if (timerEl && timerEl.classList.contains("reveal--timer")) {
    window.setTimeout(function () {
      timerEl.classList.add("is-visible");
    }, pacingMs("storyTimerMs"));
  }

  var audioBar = document.querySelector(".audio-bar--story-enter");
  if (audioBar) {
    window.setTimeout(function () {
      audioBar.classList.add("is-visible");
    }, pacingMs("storyAudioMs"));
  }

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    });
  });
}

// =============================================================================
// SCROLL + PARALLAX
// =============================================================================
function initScrollReveals() {
  var reveals = document.querySelectorAll(".reveal:not(.reveal--timer)");
  if (!reveals.length) return;

  function revealAfterPauseLines(container) {
    var pauses = container.querySelectorAll(".line-after-pause");
    if (!pauses.length) return;
    var base = pacingMs("lineAfterPauseMs");
    pauses.forEach(function (line) {
      var extra = parseInt(line.getAttribute("data-line-delay") || "", 10);
      var ms = Number.isFinite(extra) ? extra : base;
      if (prefersReducedMotion()) ms = 0;
      else ms += getFastScrollExtraMs();
      window.setTimeout(function () {
        line.classList.add("is-line-revealed");
        if (line.getAttribute("data-tension-trigger") === "line-pause") {
          revealTensionSecondHalf(line);
        }
      }, ms);
    });
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target.classList.contains("is-visible")) return;
        entry.target.classList.add("is-visible");
        revealTensionInRevealContainer(entry.target);
        revealAfterPauseLines(entry.target);
      });
    },
    { root: null, threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach(function (el) {
    io.observe(el);
  });
}

function initParallax() {
  var imgs = document.querySelectorAll(".parallax-img");
  var texts = document.querySelectorAll(".parallax-text");
  if (!imgs.length) return;

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;

    imgs.forEach(function (img) {
      var panel = img.closest(".panel");
      if (!panel) return;
      var rect = panel.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var dist = (center - vh / 2) / vh;
      img.style.transform = "translateY(" + dist * -34 + "px)";
    });

    texts.forEach(function (textEl) {
      var panel = textEl.closest(".panel");
      if (!panel) return;
      var rect = panel.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var dist = (center - vh / 2) / vh;
      textEl.style.transform = "translateY(" + dist * 10 + "px)";
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

// =============================================================================
// ZAMANLAYICI
// =============================================================================
function initRelationshipTimer() {
  var el = $("relationship-timer");
  if (!el) return;
  var start = parseLocalDate(RELATIONSHIP_START_ISO);

  function tick() {
    var now = new Date();
    var diff = Math.max(0, now - start);
    var days = Math.floor(diff / (24 * 60 * 60 * 1000));
    var rem = diff - days * 24 * 60 * 60 * 1000;
    var hours = Math.floor(rem / (60 * 60 * 1000));
    el.textContent = days + " gün, " + hours + " saat";
  }

  tick();
  window.setInterval(tick, 1000);
}

/** Bugün gece yarısından beri geçen süre (yerel saat) */
function initTodayTimer() {
  var el = $("today-timer");
  if (!el) return;

  function midnight() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0, 0, 0);
  }

  function tick() {
    var now = new Date();
    var diff = Math.max(0, now - midnight());
    var h = Math.floor(diff / (60 * 60 * 1000));
    var rem = diff - h * 60 * 60 * 1000;
    var m = Math.floor(rem / (60 * 1000));
    rem = rem - m * 60 * 1000;
    var s = Math.floor(rem / 1000);
    el.textContent = h + " sa " + m + " dk " + s + " sn";
  }

  tick();
  window.setInterval(tick, 1000);
}

// =============================================================================
// DOĞUM GÜNÜ
// =============================================================================
function isCalendarBirthday() {
  var now = new Date();
  return now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
}

function initBirthdayMode() {
  var body = document.body;
  var story = $("story");
  var banner = $("birthday-banner");
  var panel = $("birthday-panel");
  var useBirthdayExtras =
    typeof BIRTHDAY_EXPERIENCE_ALWAYS !== "undefined" && BIRTHDAY_EXPERIENCE_ALWAYS
      ? true
      : isCalendarBirthday();

  if (useBirthdayExtras) {
    body.classList.add("birthday-today");
    if (banner) {
      banner.textContent = COPY.birthdayBanner;
      banner.classList.remove("is-hidden");
    }
    if (panel) {
      panel.classList.remove("is-hidden");
      var a = $("birthday-line-a");
      var b = $("birthday-line-b");
      if (a) a.textContent = COPY.birthdayA;
      if (b) b.textContent = COPY.birthdayB;
    }
  } else {
    body.classList.remove("birthday-today");
    if (banner) {
      banner.textContent = "";
      banner.classList.add("is-hidden");
    }
    if (panel) {
      panel.classList.add("is-hidden");
    }
  }

  function onScroll() {
    if (!story || story.classList.contains("is-hidden")) return;
    var max = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    var p = window.scrollY / max;

    var endBump = 0;
    var pre = $("pre-final");
    if (pre) {
      var r = pre.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.72 && r.bottom > -40) {
        endBump = 0.35;
      }
    }
    var giftEl = $("gift-moment");
    if (giftEl && !giftEl.classList.contains("is-hidden")) {
      var gr = giftEl.getBoundingClientRect();
      if (gr.top < window.innerHeight * 0.88 && gr.bottom > 0) {
        endBump = Math.max(endBump, 0.42);
      }
    }

    var base = useBirthdayExtras ? p * 1.08 + 0.08 : p * 0.82;
    var warm = Math.min(1, base + endBump);
    body.style.setProperty("--warm-shift", String(warm));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// =============================================================================
// HEDİYE ANI — sonra final CTA
// =============================================================================
function initGiftMoment() {
  if (prefersReducedMotion()) return;

  var gift = $("gift-moment");
  var btn = $("gift-btn");
  var finalBtn = $("final-btn");
  if (!gift || !btn || !finalBtn) return;

  btn.addEventListener("click", function () {
    gift.classList.add("gift-moment--done");
    gift.setAttribute("aria-hidden", "true");
    window.setTimeout(function () {
      gift.classList.add("is-hidden");
    }, 700);

    finalBtn.classList.remove("is-hidden");
    finalBtn.setAttribute("aria-hidden", "false");
    void finalBtn.offsetWidth;
    finalBtn.classList.add("final-cta--enter");

    if (COPY.giftMomentHint) {
      showToast(COPY.giftMomentHint, 3200);
    }

    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event("scroll"));
    });
  });
}

// =============================================================================
// GİZLİ KATMANLAR
// =============================================================================
function showToast(text, ms) {
  var toast = $("floating-toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.remove("is-hidden");
  void toast.offsetWidth;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(function () {
    toast.classList.remove("is-visible");
    window.setTimeout(function () {
      toast.classList.add("is-hidden");
    }, 800);
  }, ms || 4000);
}

function initHiddenLayers() {
  var dot = $("hidden-trigger");
  if (dot) {
    dot.addEventListener("click", function () {
      showToast(COPY.dotMessage, 4200);
    });
  }

  var whisper = $("whisper-hit");
  if (whisper) {
    whisper.addEventListener("click", function () {
      showToast(COPY.whisperClick, 3500);
    });
  }
}

/** Section 5 görününce birkaç saniye sonra gecikmeli satır */
function initDelayedLine() {
  var delayed = $("panel-5-delayed");
  var panel = delayed && delayed.closest(".panel");
  if (!panel || !delayed) return;

  var fired = false;
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || fired) return;
        fired = true;
        window.setTimeout(function () {
          delayed.classList.add("is-revealed");
        }, 2800);
      });
    },
    { threshold: 0.35 }
  );

  io.observe(panel);
}

// =============================================================================
// KULLANICI YAZI ANI
// =============================================================================
function initUserInteraction() {
  var send = $("user-whisper-send");
  var input = $("user-whisper");
  var block = $("interaction-block");
  var resp = $("user-whisper-response");
  if (!send || !input || !block || !resp) return;

  send.addEventListener("click", function () {
    var t = input.value.trim();
    if (!t) {
      input.focus();
      return;
    }
    var lbl = block.querySelector(".interaction-block__label");
    input.classList.add("is-hidden");
    send.classList.add("is-hidden");
    if (lbl) lbl.classList.add("is-hidden");
    resp.textContent = COPY.interactionResponse;
    resp.classList.remove("is-hidden");
    void resp.offsetWidth;
    resp.classList.add("is-visible");
  });
}

// =============================================================================
// FİNAL
// =============================================================================
function initFinalReveal() {
  var btn = $("final-btn");
  var overlay = $("final-overlay");
  if (!btn || !overlay) return;

  btn.addEventListener("click", function () {
    document.body.style.overflow = "hidden";
    overlay.classList.remove("is-hidden");
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-opening");

    var lines = overlay.querySelectorAll(".overlay__line");
    lines.forEach(function (line) {
      line.classList.remove("is-line-visible");
    });
    void overlay.offsetWidth;
    lines.forEach(function (line, i) {
      window.setTimeout(function () {
        line.classList.add("is-line-visible");
      }, 400 + i * 900);
    });
  });
}

// =============================================================================
// İLERLEYEN HİKÂYE — ilk bölümden sonra tıklama ile geri kalanı aç
// =============================================================================
function initStoryContinue() {
  if (prefersReducedMotion()) return;
  var btn = $("story-continue-btn");
  var rest = $("story-rest");
  var continueBlock = $("story-continue");
  if (!btn || !rest || !continueBlock) return;

  btn.addEventListener("click", function () {
    if (rest.classList.contains("is-hidden") === false) return;
    rest.classList.remove("is-hidden");
    rest.setAttribute("aria-hidden", "false");
    continueBlock.classList.add("story-continue--done");
    btn.setAttribute("aria-disabled", "true");
    btn.disabled = true;

    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
      var b1 = $("flow-bridge-1");
      if (b1 && typeof b1.scrollIntoView === "function") {
        window.setTimeout(function () {
          b1.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 90);
      }
    });
  });
}

// =============================================================================
// AKIŞ — aşamalı açılım + küçük seçimler
// =============================================================================
function initStoryFlow() {
  if (prefersReducedMotion()) return;

  var gated = $("story-gated");
  var tail = $("story-tail");
  var b1 = $("flow-bridge-1");
  var b2 = $("flow-bridge-2");
  if (!gated || !tail || !b1 || !b2) return;

  function bumpLayout() {
    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    });
  }

  function openGated() {
    gated.classList.remove("is-hidden");
    gated.setAttribute("aria-hidden", "false");
    b1.classList.add("is-settled");
    window.setTimeout(function () {
      var s2 = document.querySelector('[data-section="2"]');
      if (s2 && typeof s2.scrollIntoView === "function") {
        s2.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 90);
    bumpLayout();
  }

  b1.querySelectorAll("button[data-flow]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var slow = btn.getAttribute("data-flow") === "slow";
      window.setTimeout(openGated, slow ? 1200 : 0);
    });
  });

  function openTail() {
    tail.classList.remove("is-hidden");
    tail.setAttribute("aria-hidden", "false");
    b2.classList.add("is-settled");
    window.setTimeout(function () {
      var pre = $("pre-final");
      if (pre && typeof pre.scrollIntoView === "function") {
        pre.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 90);
    bumpLayout();
  }

  b2.querySelectorAll("button[data-flow2]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pause = btn.getAttribute("data-flow2") === "pause";
      window.setTimeout(openTail, pause ? 2500 : 0);
    });
  });
}

function initPanelOneStagger() {
  var line = $("panel-1-b");
  var panel = line && line.closest(".panel");
  if (!panel || !line) return;

  if (prefersReducedMotion()) {
    line.classList.add("is-visible");
    return;
  }

  var fired = false;
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || fired) return;
        fired = true;
        window.setTimeout(function () {
          line.classList.add("is-visible");
        }, 2500);
      });
    },
    { threshold: 0.25 }
  );

  io.observe(panel);
}

/** Kaydırma derinliği, durunca fısıltı, hız örneklemesi (getFastScrollExtraMs ile bağlı) */
function initStoryScrollReactions() {
  var story = $("story");
  var timerLabel = $("timer-label");
  var idleWhisper = $("scroll-idle-whisper");
  if (!story) return;

  var depthScheduled = false;
  var deep = false;
  var idleTimer = null;

  function getDepth() {
    var max = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    return window.scrollY / max;
  }

  function applyDepthState() {
    if (story.classList.contains("is-hidden")) return;
    var p = getDepth();
    story.style.setProperty(
      "--scroll-depth",
      String(Math.min(1, Math.max(0, p)))
    );
    if (!timerLabel || !COPY.timerLabelScrollDeep) return;

    if (!deep && p > 0.38) {
      deep = true;
      story.classList.add("story--scroll-deep");
      timerLabel.textContent = isReturnVisit()
        ? COPY.timerLabelReturnScrollDeep
        : COPY.timerLabelScrollDeep;
    } else if (deep && p < 0.28) {
      deep = false;
      story.classList.remove("story--scroll-deep");
      timerLabel.textContent = isReturnVisit()
        ? COPY.timerLabelReturn
        : COPY.timerLabelFirst;
    }
  }

  function hideIdleWhisper() {
    if (!idleWhisper) return;
    idleWhisper.classList.remove("scroll-idle-whisper--visible");
    idleWhisper.classList.add("is-hidden");
    idleWhisper.setAttribute("aria-hidden", "true");
  }

  function showIdleWhisper() {
    if (!idleWhisper || story.classList.contains("is-hidden")) return;
    if (prefersReducedMotion()) return;
    idleWhisper.classList.remove("is-hidden");
    idleWhisper.setAttribute("aria-hidden", "false");
    void idleWhisper.offsetWidth;
    idleWhisper.classList.add("scroll-idle-whisper--visible");
  }

  function idleSchedule() {
    window.clearTimeout(idleTimer);
    if (prefersReducedMotion()) return;
    idleTimer = window.setTimeout(showIdleWhisper, 1180);
  }

  function onScroll() {
    sampleScrollVelocity();
    if (!story.classList.contains("is-hidden")) {
      hideIdleWhisper();
      idleSchedule();
    }
    if (!depthScheduled) {
      depthScheduled = true;
      window.requestAnimationFrame(function () {
        depthScheduled = false;
        applyDepthState();
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

function initScrollReactiveFinalCta() {
  var btn = $("final-btn");
  var story = $("story");
  if (!btn || !story) return;

  var ticking = false;
  var lastIdx = -1;

  function tick() {
    ticking = false;
    if (story.classList.contains("is-hidden")) return;
    if (btn.classList.contains("is-hidden")) return;
    var max = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    var p = window.scrollY / max;
    var arr = COPY.finalCtaScroll;
    if (!arr || !arr.length) return;
    var idx = p < 0.28 ? 0 : p < 0.62 ? 1 : 2;
    if (idx !== lastIdx) {
      lastIdx = idx;
      btn.textContent = arr[idx];
    }
  }

  function onScroll() {
    sampleScrollVelocity();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  tick();
}

function initInteractionLabelShift() {
  var input = $("user-whisper");
  var block = $("interaction-block");
  if (!input || !block) return;
  var label = block.querySelector(".interaction-block__label");
  if (!label) return;

  input.addEventListener(
    "focus",
    function () {
      label.textContent = COPY.interactionLabelFocus;
    },
    { once: true }
  );
}

// =============================================================================
// SES
// =============================================================================
function initAmbientAudio() {
  var audio = $("ambient-audio");
  var toggle = $("ambient-toggle");
  if (!audio || !toggle) return;

  var fadeFrame = null;
  var targetVol = 0.4;
  var fadeMs = 2400;

  function cancelFade() {
    if (fadeFrame !== null) {
      cancelAnimationFrame(fadeFrame);
      fadeFrame = null;
    }
  }

  function fadeVolume(from, to, durationMs, onDone) {
    cancelFade();
    var start = performance.now();

    function step(now) {
      var t = Math.min(1, (now - start) / durationMs);
      var eased = t * t * (3 - 2 * t);
      audio.volume = from + (to - from) * eased;
      if (t < 1) {
        fadeFrame = requestAnimationFrame(step);
      } else {
        fadeFrame = null;
        audio.volume = to;
        if (onDone) onDone();
      }
    }

    fadeFrame = requestAnimationFrame(step);
  }

  function playWithFadeIn() {
    audio.volume = 0;
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
    fadeVolume(0, targetVol, fadeMs, null);
  }

  function pauseWithFadeOut() {
    fadeVolume(audio.volume, 0, 700, function () {
      audio.pause();
    });
  }

  toggle.addEventListener("click", function () {
    var pressed = toggle.getAttribute("aria-pressed") === "true";
    if (pressed) {
      toggle.setAttribute("aria-pressed", "false");
      pauseWithFadeOut();
    } else {
      toggle.setAttribute("aria-pressed", "true");
      playWithFadeIn();
    }
  });

  audio.addEventListener("error", function () {
    toggle.style.opacity = "0.35";
    toggle.title = "Ses yok (assets/ambient.mp3)";
  });
}

// =============================================================================
// BAŞLAT
// =============================================================================
function init() {
  fillIntroLine();
  fillFlowBridgeHints();
  buildFinalOverlayHTML();
  initImageFallbacks();
  unlockStoryFlowForReducedMotion();
  initGateDeferral();
  initGate();
  initIntroStart();
  initScrollReveals();
  initParallax();
  initRelationshipTimer();
  initTodayTimer();
  initBirthdayMode();
  initGiftMoment();
  initHiddenLayers();
  initDelayedLine();
  initPanelOneStagger();
  initUserInteraction();
  initInteractionLabelShift();
  initStoryContinue();
  initStoryFlow();
  initFinalReveal();
  initAmbientAudio();
  initStoryScrollReactions();
  initScrollReactiveFinalCta();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
