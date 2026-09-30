"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Gallery() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stARef = useRef<HTMLDivElement>(null);
  const stBRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const navmenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const stA = stARef.current;
    const stB = stBRef.current;
    const nav = navRef.current;
    const burger = burgerRef.current;
    if (!root || !canvas || !ring || !stA || !stB || !nav || !burger) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- ENTRANCE: failsafe — data-intro is pre-set in JSX, just remove it after max 4s ---- */
    const introFailsafe = setTimeout(() => { if (root) root.removeAttribute("data-intro"); }, 4000);

    /* ---- STARFIELD ---- */
    function stars(el: HTMLElement, n: number, blur: number, aMin: number, aMax: number) {
      const arr: string[] = [];
      for (let i = 0; i < n; i++) {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const a = (aMin + Math.random() * (aMax - aMin)).toFixed(2);
        arr.push(`${x}vw ${y}vh ${blur}px 0 rgba(255,255,255,${a})`);
      }
      el.style.boxShadow = arr.join(",");
    }
    stars(stA, 150, 0, 0.05, 0.3);
    stars(stB, 18, 1.2, 0.35, 0.7);

    /* ---- CARD CREATIVES ---- */
    const BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";
    const SHOTS = [
      { url: BASE + "hf_20260912_110422_0fc34393-7417-41b0-a200-43fd2b08a37f.png", v: "pay" },
      { url: BASE + "hf_20260912_110423_ba46182e-43bc-43a8-9007-a8234acf442d.png", v: "launch" },
      { url: BASE + "hf_20260912_110423_06cfbb84-6f96-48f6-be45-e03516510e48.png", v: "shop" },
      { url: BASE + "hf_20260912_110422_634bf390-f171-4f5d-9151-0d2c86c26e7b.png", v: "brand" },
      { url: BASE + "hf_20260912_110423_0cfe058d-db0e-4ee6-9708-7a297cc11a7a.png", v: "frete" },
      { url: BASE + "hf_20260912_110422_a90a35d7-ae20-4ce3-86d7-e3f6f658a6bc.png", v: "plain", t: "RITUAL REGIME" },
      { url: BASE + "hf_20260912_110422_de267714-7647-4d9a-a0a9-55325683b2a2.png", v: "power" },
      { url: BASE + "hf_20260912_110504_80eda275-e380-4ccb-b51f-332f25337079.png", v: "plain", t: "JUST ARRIVED" },
      { url: BASE + "hf_20260912_110422_d6ba08f5-4ff8-4f09-8abe-93ee6bb0e34e.png", v: "off" },
      { url: BASE + "hf_20260912_110423_87ec2115-3157-47ef-ac98-973f8ad6532d.png", v: "plain", t: "STREETWEAR" },
    ] as { url: string; v: string; t?: string }[];

    function creative(d: { url: string; v: string; t?: string }): string {
      const im = `<img alt="" src="${d.url}">`;
      switch (d.v) {
        case "pay":
          return (
            `<div class="fill" style="background:#efedea"></div>` +
            `<div class="ph" style="top:112px;bottom:0">${im}</div>` +
            `<svg class="ph" style="top:118px;bottom:0" viewBox="0 0 130 182" preserveAspectRatio="none">` +
            `<g stroke="#e5202f" stroke-width="8" fill="none" opacity=".92" stroke-linecap="square">` +
            `<path d="M2 42h30M14 30v96M4 100l26-16"/>` +
            `<path d="M96 34v58M120 34v58M96 92q12 15 24 0"/>` +
            `<path d="M92 108l14 34M126 108l-12 34"/></g></svg>` +
            `<div class="cv" style="top:20px;text-align:right;font-size:3.4px;letter-spacing:.15em;color:#8d9298">METHOD OF CHECKOUTS</div>` +
            `<div class="cv t-big" style="top:32px;font-size:14px;color:#16171b">Checkouts</div>` +
            `<div class="cv t-big" style="top:47px;font-size:14px;color:#e5202f">Quick n simple</div>` +
            `<div class="cv" style="top:76px;font-size:5.2px;font-weight:700;color:#16171b;line-height:1.7">` +
            `<div><b class="dot"></b>SPEND VIA <b>ACH</b></div>` +
            `<div style="margin-top:8px"><b class="dot sq"></b>OR AT MAX <b>12X</b><br><span style="margin-left:11px">ON CREDIT</span></div>` +
            `</div>`
          );
        case "launch":
          return (
            `<div class="fill" style="background:linear-gradient(168deg,#f9d9e5,#f3bdd2 55%,#e8a3c0)"></div>` +
            `<div class="ph" style="top:100px;bottom:0">${im}` +
            `<div class="fill" style="background:linear-gradient(180deg,rgba(249,217,229,.97),rgba(249,217,229,0) 30%)"></div></div>` +
            `<div class="cv t-serif" style="top:36px;font-size:17px;color:#b03a63">COLLECTION</div>` +
            `<div class="cv t-serif" style="top:55px;font-size:17px;color:#b03a63">EXCLUSIVE!</div>`
          );
        case "shop":
          return (
            `<div class="fill" style="background:#fff"></div>` +
            `<div class="ph" style="top:0;height:148px">${im}</div>` +
            `<div class="cv" style="top:158px;font-size:5.4px;font-weight:700;letter-spacing:.09em;color:#16171b">REGIME AT DAWNS</div>` +
            `<div class="cv" style="top:168px;font-size:4.2px;color:#7b8087">Cleanse · Serum · Moisturize</div>` +
            `<div style="position:absolute;left:10px;top:180px;padding:4px 11px;border-radius:20px;background:#16171b;font-size:4.6px;font-weight:600;color:#fff;letter-spacing:.05em">Acquire today</div>`
          );
        case "brand":
          return (
            `<div class="fill" style="background:linear-gradient(180deg,#0a2a4a,#0d3a63 50%,#08192b)"></div>` +
            `<div class="ph" style="top:92px;bottom:0">${im}` +
            `<div class="fill" style="background:linear-gradient(180deg,rgba(10,42,74,.98),rgba(10,42,74,0) 36%)"></div></div>` +
            `<div class="cv" style="top:16px;font-size:4.2px;line-height:1.7;color:rgba(255,255,255,.82);width:74px">Formulas light, assessed hypoallergenically n designed with a new ritual — revealing since a starting moment.</div>` +
            `<div style="position:absolute;right:10px;top:16px;font-size:5.4px;font-weight:600;color:#fff;opacity:.92">✶ Vertex</div>`
          );
        case "frete":
          return (
            `<div class="fill" style="background:linear-gradient(158deg,#4a0c80 0%,#7a16a6 40%,#a81fc6 66%,#5c0e90 100%)"></div>` +
            `<div class="ph" style="top:140px;bottom:0;opacity:.45;mix-blend-mode:screen">${im}</div>` +
            `<div class="fill" style="background:radial-gradient(44% 16% at 50% 62%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%)"></div>` +
            `<div style="position:absolute;left:-6px;right:-6px;top:44px;height:13px;background:#ff2d8a;transform:rotate(-2.6deg);box-shadow:0 4px 12px rgba(255,45,138,.5)"></div>` +
            `<div style="position:absolute;left:0;right:0;top:45.5px;transform:rotate(-2.6deg);text-align:center;font-size:5.6px;font-weight:700;letter-spacing:.05em;color:#fff">OBTAIN AT HOME AND</div>` +
            `<div class="cv t-big" style="top:64px;font-size:24px;color:#fff;text-shadow:0 3px 0 rgba(84,9,124,.6)">Ships</div>` +
            `<div class="cv t-big" style="top:87px;font-size:24px;color:#fff;text-shadow:0 3px 0 rgba(84,9,124,.6)">Gratis</div>` +
            `<div class="cv t-big" style="top:113px;font-size:19px;color:#fff">+</div>`
          );
        case "power":
          return (
            `<div class="ph phf">${im}</div>` +
            `<div class="fill" style="background:linear-gradient(180deg,rgba(6,5,10,0) 34%,rgba(6,5,10,.55) 52%,rgba(6,5,10,.92) 72%)"></div>` +
            `<div class="cv t-serif" style="top:132px;font-size:16px;color:#fff">A POWER</div>` +
            `<div class="cv t-serif" style="top:150px;font-size:16px;color:#fff">FEMININE</div>` +
            `<div class="cv" style="top:171px;font-size:4.4px;letter-spacing:.07em;color:rgba(255,255,255,.85)">is echoing in all we acquire</div>`
          );
        case "off":
          return (
            `<div class="ph phf">${im}</div>` +
            `<div class="fill" style="background:linear-gradient(180deg,rgba(3,9,20,0) 30%,rgba(3,9,20,.6) 48%,rgba(3,9,20,.95) 70%)"></div>` +
            `<div class="cv t-big" style="top:126px;font-size:10px;color:#fff;opacity:.9">On sale · til</div>` +
            `<div class="cv t-big" style="top:139px;font-size:22px;color:#3fe3ff;text-shadow:0 0 16px rgba(63,227,255,.5)">50% off</div>`
          );
        default: // plain
          return (
            `<div class="ph phf">${im}</div>` +
            `<div class="fill" style="background:linear-gradient(180deg,rgba(4,8,16,0) 38%,rgba(4,8,16,.85) 68%)"></div>` +
            `<div class="cv" style="top:150px;font-size:5.4px;font-weight:600;letter-spacing:.2em;color:#fff">${d.t || ""}</div>`
          );
      }
    }

    /* ---- RING (37 cards, 3D cylinder) ---- */
    const N = 37, STEP = 360 / N, R = 891, CULL = 42;
    const cards: HTMLDivElement[] = [];
    for (let i = 0; i < N; i++) {
      const d = SHOTS[i % SHOTS.length];
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = creative(d) + '<div class="edge"></div>';
      const img = el.querySelector("img");
      if (img) {
        img.addEventListener("error", () => el.classList.add("broken"));
      }
      ring.appendChild(el);
      cards.push(el);
    }

    let phase = -2, lastRaf: number | null = null;
    function placeCards() {
      for (let i = 0; i < N; i++) {
        const a = (((i * STEP + phase) % 360 + 540) % 360) - 180;
        const el = cards[i];
        if (Math.abs(a) > CULL) { el.style.visibility = "hidden"; continue; }
        el.style.visibility = "visible";
        const r = (a * Math.PI) / 180, c = Math.cos(r);
        el.style.transform = `translate3d(${R * Math.sin(r)}px,0,${R * (1 - c)}px) rotateY(${-a}deg)`;
        el.style.filter = `brightness(${0.84 + 0.5 * (1 / c - 1)})`;
      }
    }
    function tick(t: number) {
      if (lastRaf === null) lastRaf = t;
      const dt = Math.min((t - lastRaf) / 1000, 0.1);
      lastRaf = t;
      if (!reduced) phase -= 1.9 * dt;
      placeCards();
      rafId = requestAnimationFrame(tick);
    }
    const onVis = () => { lastRaf = null; };
    document.addEventListener("visibilitychange", onVis);
    placeCards();
    let rafId = requestAnimationFrame(tick);

    /* ---- RESPONSIVE SCALE + TYPE FITTER ---- */
    const TAB_MAX = 1080, TAB_MIN = 701, DW_MIN = 920, CW = 1172;
    const measureCanvas = document.createElement("canvas");
    const mctx = measureCanvas.getContext("2d")!;

    function capRatio(el: HTMLElement) {
      const cs = getComputedStyle(el);
      mctx.font = cs.fontWeight + " 100px " + cs.fontFamily;
      const m = mctx.measureText("H");
      const asc = (m as any).actualBoundingBoxAscent || 70;
      return asc / 100;
    }
    function currentK() {
      const v = getComputedStyle(canvas!).getPropertyValue("--k");
      return parseFloat(v) || 1;
    }
    function inkWidth(el: HTMLElement, mobile: boolean) {
      const w = el.getBoundingClientRect().width;
      return mobile ? w : w / currentK();
    }
    function fitBox(el: HTMLElement, targetW: number, targetCap: number, pre?: string) {
      el.style.transform = pre || "";
      const cr = capRatio(el);
      const fs = targetCap / cr;
      el.style.fontSize = fs + "px";
      const w = inkWidth(el, false);
      const scaleX = w > 0 ? targetW / w : 1;
      el.style.transform = (pre || "") + " scaleX(" + scaleX + ")";
    }
    function baseline(el: HTMLElement, y: number) {
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      mctx.font = cs.fontWeight + " " + size + "px " + cs.fontFamily.split(",")[0];
      const m = mctx.measureText("Hg");
      const A = (m as any).fontBoundingBoxAscent || size * 0.8;
      const D = (m as any).fontBoundingBoxDescent || size * 0.2;
      el.style.top = y - ((size - (A + D)) / 2 + A) + "px";
    }
    function centreLabel(btn: HTMLElement, el: HTMLElement, capPx: number) {
      const probe = document.createElement("i");
      probe.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;visibility:hidden";
      btn.appendChild(probe);
      const btnRect = btn.getBoundingClientRect();
      const probeRect = probe.getBoundingClientRect();
      const base = probeRect.top - btnRect.top;
      btn.removeChild(probe);
      const BIAS = 1.1;
      const btnH = btnRect.height / (window.innerWidth <= 700 ? 1 : currentK());
      el.style.position = "relative";
      el.style.top = btnH / 2 - (base - capPx / 2) + BIAS + "px";
    }

    function doLayout(mobile: boolean) {
      let T = 1;
      if (!mobile) {
        const vw = window.innerWidth;
        if (vw <= 1080 && vw >= 701) {
          const ramp = Math.min(1, (1080 - vw) / 120);
          T = 1 + 0.14 * ramp;
        }
      }
      try {
        const h1a = root!.querySelector("#gl-h1a") as HTMLElement;
        const h1b = root!.querySelector("#gl-h1b") as HTMLElement;
        const sub1 = root!.querySelector("#gl-sub1") as HTMLElement;
        const sub2 = root!.querySelector("#gl-sub2") as HTMLElement;
        const badgeTxt = root!.querySelector("#gl-badgeTxt") as HTMLElement;
        const wmName = root!.querySelector("#gl-wmName") as HTMLElement;
        const ctaLabel = root!.querySelector("#gl-ctaLabel") as HTMLElement;
        const vpLabel = root!.querySelector("#gl-vpLabel") as HTMLElement;

        if (mobile) {
          [h1a, h1b, sub1, sub2, badgeTxt, wmName, ctaLabel, vpLabel].forEach(el => {
            if (!el) return;
            el.style.fontSize = "";
            el.style.top = "";
            el.style.transform = "";
            el.style.position = "";
          });
          const links = root!.querySelector(".links") as HTMLElement;
          if (links) { links.style.fontSize = ""; links.style.transform = ""; }
          root!.querySelectorAll(".links a").forEach((a: Element) => {
            (a as HTMLElement).style.fontSize = "";
          });
          return;
        }

        fitBox(h1a, 563.5 * T, 37.2 * T, "translateX(-50%)");
        baseline(h1a, 204.5);
        fitBox(h1b, 197.5 * T, 37.2 * T, "translateX(-50%)");
        baseline(h1b, 258.5);
        fitBox(sub1, 389 * T, 8.4 * T, "translateX(-50%)");
        baseline(sub1, 300.5);
        fitBox(sub2, 311 * T, 8.4 * T, "translateX(-50%)");
        baseline(sub2, 316.5);
        fitBox(badgeTxt, 184 * T, 9.4 * T, "translate(2px,-1px)");
        fitBox(wmName, 51 * T, 11.4 * T);
        baseline(wmName, 38.5);

        fitBox(ctaLabel, 87 * T, 8.9 * T);
        centreLabel(ctaLabel.closest(".btn") as HTMLElement, ctaLabel, 8.9 * T);
        fitBox(vpLabel, 76 * T, 9.5 * T);
        centreLabel(vpLabel.closest(".btn") as HTMLElement, vpLabel, 9.5 * T);

        const linksRow = root!.querySelector(".links") as HTMLElement;
        const linkEls = Array.from(root!.querySelectorAll(".links a")) as HTMLElement[];
        if (window.innerWidth <= 1080) {
          linksRow.style.transform = "";
          linkEls.forEach(a => { a.style.fontSize = ""; });
        } else {
          linksRow.style.transform = "";
          const fs = 7.9 / capRatio(linkEls[0]);
          linkEls.forEach(a => { a.style.fontSize = fs + "px"; });
          const rowWidth = inkWidth(linksRow, false);
          linksRow.style.transform = "scaleX(" + 317 / rowWidth + ")";
        }
      } catch (e) { /* never crash the page */ }
      placeCards();
    }

    function layout(mobile: boolean) {
      document.fonts.ready.then(() => doLayout(mobile));
      doLayout(mobile);
    }

    function resize() {
      const vw = window.innerWidth, vh = window.innerHeight;
      if (vw <= 700) {
        canvas!.style.removeProperty("--k");
        canvas!.style.removeProperty("--fill");
        canvas!.style.removeProperty("--stshift");
        canvas!.style.removeProperty("--sshift");
        canvas!.style.removeProperty("--rs");
        layout(true);
        return;
      }
      let W: number;
      if (vw > TAB_MAX) {
        W = CW;
      } else {
        W = DW_MIN + ((vw - TAB_MIN) * (CW - DW_MIN)) / (TAB_MAX - TAB_MIN);
        if (vh > vw * 1.15) W = Math.min(W, 900);
      }
      const k = Math.min(vw / W, vh / 560);
      canvas!.style.setProperty("--k", String(k));

      if (vw <= TAB_MAX && vw >= TAB_MIN) {
        const ramp = Math.min(1, (TAB_MAX - vw) / 120);
        let fill = Math.max(0, vh / k - 657);
        let ss = 0, rs = 1, st = 0;
        if (fill > 0) {
          ss = Math.min(fill * 0.55, 420) * ramp;
          rs = 1 + Math.min(fill / 1100, 0.75) * ramp;
          const slack = 219.5 - 125 * rs + ss;
          st = Math.max(0, slack / 2 - 28) * ramp;
          fill -= ss;
        }
        canvas!.style.setProperty("--fill", fill + "px");
        canvas!.style.setProperty("--stshift", st + "px");
        canvas!.style.setProperty("--sshift", ss + "px");
        canvas!.style.setProperty("--rs", String(rs));
      } else {
        const fillD = Math.max(0, vh / k - 657);
        canvas!.style.setProperty("--fill", fillD + "px");
        canvas!.style.removeProperty("--stshift");
        canvas!.style.removeProperty("--sshift");
        canvas!.style.removeProperty("--rs");
      }
      layout(false);
    }

    window.addEventListener("resize", resize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", resize);
    resize();
    document.fonts.ready.then(() => layout(false));
    const t1 = setTimeout(() => layout(window.innerWidth <= 700), 400);
    const t2 = setTimeout(() => layout(window.innerWidth <= 700), 1400);

    /* ---- BURGER MENU ---- */
    function closeMenu() {
      nav!.classList.remove("open");
      burger!.setAttribute("aria-expanded", "false");
    }
    function openMenu() {
      nav!.classList.add("open");
      burger!.setAttribute("aria-expanded", "true");
    }
    const burgerClick = () => { nav!.classList.contains("open") ? closeMenu() : openMenu(); };
    burger.addEventListener("click", burgerClick);
    const docClick = (e: MouseEvent) => { if (!nav!.contains(e.target as Node)) closeMenu(); };
    document.addEventListener("click", docClick);
    const docKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && nav!.classList.contains("open")) { closeMenu(); burger!.focus(); }
    };
    document.addEventListener("keydown", docKey);
    root.querySelectorAll("#gl-navmenu a").forEach(a => a.addEventListener("click", closeMenu));
    let wasInBand: boolean | null = null;
    const checkBand = () => {
      const inBand = window.innerWidth <= 1080;
      if (wasInBand && !inBand) closeMenu();
      wasInBand = inBand;
    };
    window.addEventListener("resize", checkBand);
    checkBand();

    /* ---- MASTER ENTRANCE TIMELINE ---- */
    if (root.getAttribute("data-intro") && !reduced && typeof Element.prototype.animate === "function") {
      const D = window.innerWidth <= 700 ? 0.66 : 1;
      const EXPO = "cubic-bezier(.16,1,.3,1)", SOFT = "cubic-bezier(.22,.61,.36,1)";
      const Y = (px: number) => `0 ${px * D}px`;
      let n = 0, lastAnim: Animation | null = null;

      function play(el: Element | null, from: Record<string, unknown>, dur: number, delay: number, ease: string) {
        if (!el) return;
        const to: Record<string, unknown> = { opacity: 1 };
        if ("translate" in from) to.translate = "0 0";
        if ("scale" in from) to.scale = "1";
        if ("clipPath" in from) to.clipPath = "inset(-30% 0 -30% 0)";
        const a = (el as HTMLElement).animate([from as Keyframe, to as Keyframe], {
          duration: dur, delay, easing: ease, fill: "both",
        });
        a.id = "intro:" + n++;
        lastAnim = a;
      }

      play(nav, { opacity: 0, translate: Y(-9) }, 620, 60, EXPO);
      play(root.querySelector(".mark"), { opacity: 0, translate: Y(6) }, 520, 150, SOFT);
      play(root.querySelector(".wm"), { opacity: 0, translate: Y(6) }, 520, 185, SOFT);
      Array.from(root.querySelectorAll(".links a")).forEach((a, i) => {
        play(a, { opacity: 0, translate: Y(6) }, 460, 215 + i * 45, SOFT);
      });
      play(burger, { opacity: 0, translate: Y(6) }, 460, 300, SOFT);
      play(root.querySelector(".nav .btn"), { opacity: 0, translate: Y(6) }, 500, 400, SOFT);
      play(root.querySelector(".badge"), { opacity: 0, translate: Y(11), scale: 0.985 }, 560, 270, EXPO);
      play(root.querySelector("#gl-h1a"), { opacity: 0, translate: Y(15), clipPath: "inset(100% 0 -30% 0)" }, 900, 380, EXPO);
      play(root.querySelector("#gl-h1b"), { opacity: 0, translate: Y(15), clipPath: "inset(100% 0 -30% 0)" }, 900, 470, EXPO);
      play(root.querySelector("#gl-sub1"), { opacity: 0, translate: Y(10) }, 620, 690, EXPO);
      play(root.querySelector("#gl-sub2"), { opacity: 0, translate: Y(10) }, 620, 745, EXPO);
      play(root.querySelector(".cta2"), { opacity: 0, translate: Y(13), scale: 0.985 }, 620, 830, EXPO);
      play(ring, { opacity: 0, translate: Y(18), scale: 0.99 }, 950, 700, EXPO);
      play(root.querySelector(".browser"), { opacity: 0, translate: Y(26) }, 900, 900, EXPO);
      play(root.querySelector(".wa"), { opacity: 0, scale: 0.88 }, 500, 1260, EXPO);

      function settle() {
        document.getAnimations?.().forEach(a => { if (a.id?.startsWith("intro:")) a.cancel(); });
        root!.removeAttribute("data-intro");
      }
      const finalAnim = lastAnim as Animation | null;
      if (finalAnim && "finished" in finalAnim) {
        (finalAnim.finished as Promise<Animation>).then(settle).catch(settle);
      } else {
        settle();
      }
    } else {
      root.removeAttribute("data-intro");
    }

    return () => {
      clearTimeout(introFailsafe);
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", checkBand);
      window.visualViewport?.removeEventListener("resize", resize);
      burger.removeEventListener("click", burgerClick);
      document.removeEventListener("click", docClick);
      document.removeEventListener("keydown", docKey);
    };
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />

      <style>{`
        /* ============ ALL STYLES SCOPED TO [data-gl] ============ */
        [data-gl] *{margin:0;padding:0;box-sizing:border-box}
        [data-gl]{font-family:Poppins,Inter,system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased;overflow-x:hidden;background:#020204}
        [data-gl] a{text-decoration:none;color:inherit}

        [data-gl] .stage{position:relative;width:100%;height:200vh;overflow:hidden;background:#020204}
        [data-gl] .canvas{position:absolute;left:50%;top:0;width:1172px;height:657px;transform:translateX(-50%) scale(var(--k,1));transform-origin:50% 0}
        [data-gl] .canvas>*{position:absolute}
        [data-gl] .stack{position:absolute;inset:0;z-index:300}
        [data-gl] .stack>*{position:absolute}
        [data-gl] .navmenu{display:contents}
        [data-gl] .burger{display:none}
        [data-gl] .bg{position:absolute;inset:0;background:linear-gradient(180deg,rgba(25,127,255,0) 38%,rgba(25,127,255,.042) 54%,rgba(25,127,255,.052) 68%,rgba(25,127,255,.03) 100%),#020204}
        [data-gl] .stars{position:absolute;left:0;top:0;width:1px;height:1px;border-radius:50%;background:#fff}

        /* NAV */
        [data-gl] .nav{left:247px;top:3px;width:678px;height:64px;border-radius:32px;z-index:400;background:rgba(255,255,255,.008);border:1px solid rgba(255,255,255,.105);-webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}
        [data-gl] .mark{position:absolute;left:21px;top:19px;width:24px;height:24px;filter:drop-shadow(0 0 6px rgba(60,224,255,.75))}
        [data-gl] .wm{position:absolute;left:50px;top:0;white-space:nowrap}
        [data-gl] .wm .kick{position:absolute;left:3px;top:20px;font-size:4.4px;font-weight:600;letter-spacing:.1em;color:#fff;opacity:.92;line-height:1}
        [data-gl] .wm .name{position:absolute;left:0;top:26px;transform-origin:0 50%;font-family:Poppins;font-weight:900;font-size:22px;line-height:1;letter-spacing:-.01em;color:#fff}
        [data-gl] .links{position:absolute;left:156px;top:0;height:62px;transform-origin:0 50%;display:flex;align-items:center;gap:24px}
        [data-gl] .links a{font-size:12.5px;font-weight:400;color:rgba(255,255,255,.92);white-space:nowrap;transition:opacity .25s}
        [data-gl] .links a:hover{opacity:.65}

        /* BTN */
        [data-gl] .btn{display:grid;place-items:center;color:#fff;position:relative;overflow:hidden;background:linear-gradient(to top,#9ad9ec 1px,#89dff0 2px,#79e0f1 3px,#61daef 4px,#3ec8e4 5px,#14a8c6 6px,#0596b3 7px,#038aa8 8px,#047796 9px,#006180 10px,#025066 12px,#0a4f5e 13px,#04465a 14px,#073746 16px,#0a2a37 18px,#0d212e 20px,#0f1824 24px,#0a121e 30px,#0a111d 34px,#0a111d 100%);box-shadow:inset 0 3px 3px -2px rgba(180,228,255,.1),inset 1px 0 0 rgba(255,255,255,.09),inset -1px 0 0 rgba(255,255,255,.09),var(--hair,0 1px 0 rgba(152,218,234,.38)),1px 0 0 rgba(152,218,234,.17),-1px 0 0 rgba(152,218,234,.17),0 0 8px rgba(60,190,235,.1),0 2px 5px -3px rgba(90,220,255,.45);transition:transform .25s,box-shadow .25s,filter .25s}
        [data-gl] .btn::before{content:"";position:absolute;left:22%;right:38%;top:.8px;height:1.9px;z-index:1;filter:blur(.55px);background:linear-gradient(90deg,rgba(120,225,255,0) 0%,rgba(120,225,255,.58) 34%,rgba(160,240,255,.74) 50%,rgba(120,225,255,.58) 66%,rgba(120,225,255,0) 100%)}
        [data-gl] .btn::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;background:linear-gradient(90deg,rgba(200,245,255,.7),rgba(200,245,255,0) 13px),linear-gradient(270deg,rgba(200,245,255,.7),rgba(200,245,255,0) 13px);-webkit-mask:linear-gradient(to top,#000 0,#000 6px,rgba(0,0,0,.4) 12px,rgba(0,0,0,.15) 18px,rgba(0,0,0,.09) 24px,rgba(0,0,0,.02) 30px,rgba(0,0,0,.02) 100%);mask:linear-gradient(to top,#000 0,#000 6px,rgba(0,0,0,.4) 12px,rgba(0,0,0,.15) 18px,rgba(0,0,0,.09) 24px,rgba(0,0,0,.02) 30px,rgba(0,0,0,.02) 100%)}
        [data-gl] .btn span{position:relative;z-index:2;display:block;line-height:1;text-shadow:0 1px 2px rgba(0,20,30,.5)}
        [data-gl] .btn:hover{transform:translateY(-1px);filter:brightness(1.12);box-shadow:inset 0 1px 0 rgba(200,245,255,.6),inset 1px 0 0 rgba(170,225,255,.35),inset -1px 0 0 rgba(170,225,255,.35),0 6px 22px rgba(20,180,225,.55)}
        [data-gl] .nav .btn{position:absolute;left:530.7px;top:10.5px;width:125.5px;height:39.5px;border-radius:14px;font-size:14px;font-weight:500;letter-spacing:-.005em}
        [data-gl] .nav .btn span{margin-top:0}
        [data-gl] .cta2{position:absolute;left:526px;top:349px;width:121px;height:54.5px;--hair:0 0 0 transparent;border-radius:13px;font-size:17px;font-weight:500;letter-spacing:-.01em;z-index:300}
        [data-gl] .cta2::before{display:none}
        [data-gl] .cta2 span{margin-top:0}

        /* BADGE */
        [data-gl] .badge{position:absolute;left:462px;top:95px;width:250px;height:39px;border-radius:12px;z-index:300;border:1px solid rgba(255,255,255,.115);background:linear-gradient(to top,rgba(190,225,255,.175) 0px,rgba(190,225,255,.128) 2px,rgba(190,225,255,.075) 4px,rgba(190,225,255,.026) 6px,rgba(255,255,255,.012) 9px,rgba(255,255,255,.012) 100%);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
        [data-gl] .badge i{position:absolute;left:4px;top:4px;width:29px;height:29px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(to top,#46afc8 0px,#35abc7 2px,#0b859d 4px,#026c84 6px,#004e66 8px,#053f58 10px,#012c3d 12px,#031a2a 14px,#061125 16px,#090f25 19px,#090c1c 23px,#060d16 29px);box-shadow:inset 1px 0 0 rgba(150,220,250,.4),inset -1px 0 0 rgba(150,220,250,.52),0 0 6px rgba(60,190,230,.2),0 3px 8px -5px rgba(90,220,255,.6)}
        [data-gl] .badge i svg{width:14px;height:16px;position:relative;top:-1px;left:0}
        [data-gl] .badge b{position:absolute;left:45px;transform-origin:0 50%;top:0;height:39px;display:flex;align-items:center;font-size:13px;font-weight:400;color:rgba(255,255,255,.94);white-space:nowrap;padding-top:1.5px}

        /* HERO TYPE */
        [data-gl] .h1{position:absolute;left:586px;transform:translateX(-50%);white-space:nowrap;line-height:1;font-family:Poppins;font-weight:900;font-size:54px;letter-spacing:-.004em;word-spacing:.175em;text-transform:uppercase;color:#fff;text-shadow:0 0 34px rgba(130,180,255,.22);z-index:300}
        [data-gl] .sub{position:absolute;left:586px;transform:translateX(-50%);white-space:nowrap;line-height:1;font-size:13.2px;color:#a9aeb5;z-index:300}
        [data-gl] .sub b{font-weight:600;color:#fff}
        [data-gl] .nb{white-space:nowrap}

        /* CAROUSEL/RING */
        [data-gl] .showcase{position:absolute;left:0;top:0;width:1172px;height:0}
        [data-gl] .ring{position:absolute;left:0;top:0;width:1172px;height:657px;z-index:5;perspective:891px;perspective-origin:586px 918px;transform-style:preserve-3d;pointer-events:none}
        [data-gl] .card{position:absolute;left:586px;top:616px;width:130px;height:300px;margin:-150px 0 0 -65px;border-radius:12px;overflow:hidden;background:#0d1117;box-shadow:0 24px 46px rgba(0,0,0,.6),0 3px 8px rgba(0,0,0,.5);backface-visibility:hidden;will-change:transform}
        [data-gl] .card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        [data-gl] .card .edge{position:absolute;inset:0;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.15),inset 0 16px 30px rgba(255,255,255,.05)}
        [data-gl] .card.broken img{display:none}
        [data-gl] .cv{position:absolute;left:0;right:0;padding:0 10px}
        [data-gl] .fill{position:absolute;inset:0}
        [data-gl] .ph{position:absolute;left:0;right:0;overflow:hidden;background:linear-gradient(155deg,#2b3b50,#131c28 60%,#1d1526)}
        [data-gl] .phf{top:0;bottom:0}
        [data-gl] .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        [data-gl] .dot{display:inline-block;width:4.5px;height:4.5px;background:#e5202f;margin-right:4px;transform:rotate(45deg) translateY(-1px)}
        [data-gl] .dot.sq{transform:none;width:6.5px;height:4.5px;border-radius:1px}
        [data-gl] .t-big{font-family:Poppins;font-weight:900;text-transform:uppercase;line-height:.96;letter-spacing:-.015em;white-space:nowrap;transform:scaleX(.875);transform-origin:left center}
        [data-gl] .t-serif{font-family:"Playfair Display",serif;line-height:1.02;letter-spacing:.01em;white-space:nowrap}

        /* BROWSER MOCK */
        [data-gl] .browser{position:absolute;left:165px;top:558px;width:842px;height:calc(99px + var(--fill,0px));border-radius:28px 28px 0 0;overflow:hidden;z-index:100;box-shadow:0 -14px 44px rgba(0,0,0,.55)}
        [data-gl] .browser::before{content:"";position:absolute;left:0;right:0;top:42px;bottom:0;background:rgba(20,20,26,.82);z-index:0}
        [data-gl] .bar{position:absolute;left:0;top:0;width:100%;height:42px;background:linear-gradient(180deg,rgba(20,24,48,.48),rgba(15,19,38,.58));-webkit-backdrop-filter:blur(6px) saturate(112%);backdrop-filter:blur(6px) saturate(112%)}
        [data-gl] .dots{position:absolute;left:27px;top:16px;display:flex;gap:2.6px}
        [data-gl] .dots i{width:7.6px;height:7.6px;border-radius:50%}
        [data-gl] .dots i:nth-child(1){background:#ee5c62}
        [data-gl] .dots i:nth-child(2){background:#f6b719}
        [data-gl] .dots i:nth-child(3){background:#12c02f}
        [data-gl] .omni{position:absolute;left:246px;top:7px;width:336px;height:26px;border-radius:5px;background:rgba(9,13,26,.93);box-shadow:inset 0 0 0 1px rgba(255,255,255,.045);display:flex;align-items:center;justify-content:center;gap:6px}
        [data-gl] .omni svg{width:9px;height:9px;opacity:.72}
        [data-gl] .omni span{font-size:9.5px;color:rgba(255,255,255,.72);letter-spacing:.005em}
        [data-gl] .tools{position:absolute;right:27px;top:14px;display:flex;align-items:center;gap:4px;opacity:.9}
        [data-gl] .tools svg{width:11px;height:12px}
        [data-gl] .page{position:absolute;left:7px;right:6px;top:42px;bottom:0;background:#fff;color:#111;overflow:hidden;border-radius:10px 10px 0 0}
        [data-gl] .ann{position:absolute;left:0;top:0;width:100%;height:16px;background:#101210;display:grid;place-items:center;border-radius:10px 10px 0 0}
        [data-gl] .ann span{font-size:5px;letter-spacing:.06em;color:#cfcfcf}
        [data-gl] .ann u{position:absolute;font-size:6px;color:#9a9a9a;text-decoration:none}
        [data-gl] .shoplogo{position:absolute;left:50%;transform:translateX(-50%);top:24px;text-align:center}
        [data-gl] .shoplogo em{font-style:normal;font-family:"Playfair Display",serif;font-weight:600;font-size:15px;letter-spacing:.14em;line-height:1;display:block}
        [data-gl] .shoplogo i{font-style:normal;font-size:5px;letter-spacing:.3em;color:#3a3a3a;margin-top:3px;display:block}
        [data-gl] .shopicons{position:absolute;right:100px;top:33px;display:flex;gap:5px;opacity:.85}
        [data-gl] .shopicons svg{width:7px;height:7px}
        [data-gl] .pagebody{position:absolute;left:0;right:0;top:62px;bottom:0;background:#fff;overflow:hidden}
        [data-gl] .pghero{position:relative;margin:0 26px;height:158px;border-radius:7px;overflow:hidden;background:linear-gradient(120deg,#e8dcd4,#cbb6a8)}
        [data-gl] .pghero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        [data-gl] .pghero .scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(28,20,16,.62) 0%,rgba(28,20,16,.3) 46%,rgba(28,20,16,0) 72%)}
        [data-gl] .pghero .copy{position:absolute;left:22px;top:50%;transform:translateY(-50%);color:#fff}
        [data-gl] .pghero .copy u{font-size:4.6px;letter-spacing:.26em;text-transform:uppercase;opacity:.9;display:block;text-decoration:none}
        [data-gl] .pghero .copy em{font-family:"Playfair Display",serif;font-style:normal;font-weight:600;font-size:15px;line-height:1.12;margin-top:6px;display:block}
        [data-gl] .pghero .copy i{font-style:normal;display:inline-block;margin-top:10px;padding:5px 13px;border-radius:20px;background:#fff;color:#17181c;font-size:5.2px;font-weight:600;letter-spacing:.06em}
        [data-gl] .pgsec{display:flex;align-items:baseline;justify-content:space-between;margin:16px 26px 9px}
        [data-gl] .pgsec b{font-family:"Playfair Display",serif;font-weight:600;font-size:9px;color:#17181c}
        [data-gl] .pgsec u{font-size:4.6px;letter-spacing:.14em;color:#8a8a8a;text-transform:uppercase;text-decoration:none}
        [data-gl] .pggrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:0 26px}
        [data-gl] .pgcard .ph{position:relative;height:0;padding-bottom:104%;border-radius:6px;overflow:hidden;background:linear-gradient(150deg,#efe7e1,#ddcfc6)}
        [data-gl] .pgcard .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        [data-gl] .pgcard .tag{position:absolute;left:6px;top:6px;padding:2px 5px;border-radius:3px;background:#17181c;color:#fff;font-size:3.8px;font-weight:600;letter-spacing:.1em}
        [data-gl] .pgcard b{display:block;margin-top:6px;font-size:5.4px;font-weight:600;color:#17181c;letter-spacing:.01em}
        [data-gl] .pgcard i{display:block;font-style:normal;margin-top:2px;font-size:4.6px;color:#8a8a8a}
        [data-gl] .pgcard s{display:block;margin-top:3px;font-size:5.6px;font-weight:700;color:#17181c;text-decoration:none}
        [data-gl] .pgcard s span{font-weight:400;color:#a08f86;text-decoration:line-through;margin-left:4px;font-size:4.6px}
        [data-gl] .pgstrip{display:flex;justify-content:space-between;margin:16px 26px 0;padding:9px 0;border-top:1px solid #eee6e0;border-bottom:1px solid #eee6e0}
        [data-gl] .pgstrip span{font-size:4.4px;letter-spacing:.12em;color:#7d7169;text-transform:uppercase}

        /* WHATSAPP */
        [data-gl] .wa{position:fixed;right:16px;bottom:24px;width:56px;height:56px;border-radius:50%;background:#25d366;display:grid;place-items:center;z-index:500;box-shadow:0 8px 20px rgba(0,0,0,.5)}
        [data-gl] .wa svg{width:31px;height:31px}
        [data-gl] .wa::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(37,211,102,.5);animation:gl-pulse 2.8s ease-out infinite}
        @keyframes gl-pulse{0%{transform:scale(1);opacity:.75}70%{transform:scale(1.4);opacity:0}100%{opacity:0}}

        /* BURGER */
        @media(max-width:1080px){
          [data-gl] .burger{display:grid;place-content:center;gap:4px;position:absolute;right:12px;top:11px;width:42px;height:42px;padding:0;border:0;border-radius:14px;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent}
          [data-gl] .burger span{display:block;width:19px;height:1.6px;border-radius:2px;background:rgba(255,255,255,.92);transition:transform .28s cubic-bezier(.4,0,.2,1),opacity .18s}
          [data-gl] .burger:focus-visible{outline:2px solid rgba(120,225,255,.7);outline-offset:2px}
          [data-gl] .nav.open .burger span:nth-child(1){transform:translateY(5.6px) rotate(45deg)}
          [data-gl] .nav.open .burger span:nth-child(2){opacity:0}
          [data-gl] .nav.open .burger span:nth-child(3){transform:translateY(-5.6px) rotate(-45deg)}
          [data-gl] .navmenu{display:block;position:absolute;left:0;right:0;top:74px;padding:12px;border-radius:22px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(180deg,rgba(11,15,22,.985),rgba(7,10,16,.99));-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);box-shadow:0 26px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.05);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .24s ease,transform .28s cubic-bezier(.4,0,.2,1),visibility .28s}
          [data-gl] .nav.open .navmenu{opacity:1;visibility:visible;transform:none}
          [data-gl] .links{position:static;display:flex;flex-direction:column;align-items:stretch;height:auto;gap:2px;transform:none!important}
          [data-gl] .links a{font-size:15px;padding:11px 14px;border-radius:12px;color:rgba(255,255,255,.9);transition:background .2s,color .2s}
          [data-gl] .nav .btn{position:static;width:100%;height:46px;margin-top:10px;font-size:15px}
          [data-gl] .nav .btn span{margin-top:3px}
        }
        @media(hover:hover) and (max-width:1080px){
          [data-gl] .burger:hover span{background:#fff}
          [data-gl] .links a:hover{background:rgba(255,255,255,.055);color:#fff;opacity:1}
        }
        @media(prefers-reduced-motion:reduce){[data-gl] .navmenu,[data-gl] .burger span{transition:none}}

        /* TABLET 701-1080 */
        @media(max-width:1080px) and (min-width:701px){
          [data-gl] .nav{left:286px;width:620px}
          [data-gl] .badge{left:448px;width:277px}
          [data-gl] .stack{transform:translateY(var(--stshift,0px))}
          [data-gl] .showcase{transform:translateY(var(--sshift,0px))}
          [data-gl] .ring{transform:scale(var(--rs,1));transform-origin:586px 595px}
          [data-gl] .wa{width:58px;height:58px;right:22px;bottom:26px}
          [data-gl] .wa svg{width:32px;height:32px}
        }

        /* PHONE <=700 */
        @media(max-width:700px){
          [data-gl] .stage{height:auto;min-height:100vh;overflow:visible}
          [data-gl] .canvas{position:relative;left:auto;top:auto;width:100%;height:auto;min-height:100vh;transform:none;display:flex;flex-direction:column;align-items:center;padding:0 20px 32px}
          [data-gl] .canvas>*{position:static}
          [data-gl] .stack{display:contents}
          [data-gl] .nav{position:relative;left:auto;top:auto;width:100%;max-width:500px;height:58px;margin-top:clamp(10px,1.5vh,15px);flex:0 0 auto}
          [data-gl] .mark{left:16px;top:calc(50% - 13px);width:26px;height:26px}
          [data-gl] .wm{left:49px;top:0;height:100%}
          [data-gl] .wm .kick{top:calc(50% - 15px);font-size:5px;letter-spacing:.2em}
          [data-gl] .wm .name{top:calc(50% - 9px);font-size:18px;transform:scaleX(.88);transform-origin:left center}
          [data-gl] .burger{right:8px;top:7px;width:44px;height:44px}
          [data-gl] .navmenu{top:68px;padding:12px}
          [data-gl] .links a{font-size:16px;padding:12px 15px;border-radius:12px}
          [data-gl] .nav .btn{height:48px;margin-top:10px;font-size:16px}
          [data-gl] .badge{position:relative;left:auto;top:auto;margin-top:clamp(16px,2.6vh,26px);width:auto;max-width:100%;height:36px;flex:0 0 auto;border-radius:18px}
          [data-gl] .badge b{position:relative;left:auto;top:auto;height:36px;padding:0 15px 0 42px;font-size:12.5px}
          [data-gl] .badge i{top:4px;left:4px;width:28px;height:28px}
          [data-gl] .badge i svg{width:13px;height:19px}
          [data-gl] .h1{position:relative;left:auto;top:auto;transform:none;white-space:normal;text-align:center;font-size:clamp(29px,8.4vw,36px);line-height:1.06;letter-spacing:-.01em;max-width:7.4em}
          [data-gl] .h1.l1{margin-top:clamp(12px,2.2vh,20px)}
          [data-gl] .sub{position:relative;left:auto;top:auto;transform:none;white-space:normal;text-align:center;font-size:clamp(14px,3.9vw,15.5px);line-height:1.5;max-width:340px}
          [data-gl] .sub.s1{margin-top:clamp(10px,1.8vh,16px)}
          [data-gl] .cta2{position:relative;left:auto;top:auto;margin-top:clamp(16px,2.6vh,26px);flex:0 0 auto;width:auto;min-width:158px;height:52px;padding:0 26px;font-size:16px}
          [data-gl] .showcase{position:relative;left:auto;top:auto;flex:1 1 auto;width:100%;height:auto;min-height:224px}
          [data-gl] .ring{position:absolute;left:50%;margin-left:-586px;top:-446px;bottom:auto;width:1172px;height:657px;transform-origin:586px 466px;transform:scale(1.02)}
          [data-gl] .browser{position:absolute;left:50%;transform:translateX(-50%);top:212px;bottom:0;width:calc(100% + 40px);height:auto;border-radius:22px 22px 0 0}
          [data-gl] .browser .bar{height:36px}
          [data-gl] .omni{left:50%;transform:translateX(-50%);width:58%;height:24px;top:6px}
          [data-gl] .omni span{font-size:9px}
          [data-gl] .dots{top:14px}
          [data-gl] .tools{display:none}
          [data-gl] .ann{height:15px}
          [data-gl] .ann span{font-size:6px}
          [data-gl] .page{top:36px}
          [data-gl] .pagebody{top:56px}
          [data-gl] .pghero{margin:0 18px;height:122px;border-radius:10px}
          [data-gl] .pghero .copy{left:18px}
          [data-gl] .pghero .copy u{font-size:7.5px;letter-spacing:.2em}
          [data-gl] .pghero .copy em{font-size:20px;margin-top:5px}
          [data-gl] .pghero .copy i{font-size:8.5px;padding:6px 13px;margin-top:8px}
          [data-gl] .pgsec{margin:16px 18px 10px}
          [data-gl] .pgsec b{font-size:14px}
          [data-gl] .pgsec u{font-size:8px}
          [data-gl] .pggrid{grid-template-columns:repeat(2,1fr);gap:14px;margin:0 18px}
          [data-gl] .pgcard .ph{border-radius:9px}
          [data-gl] .pgcard .tag{font-size:7px;padding:3px 7px;border-radius:4px}
          [data-gl] .pgcard b{font-size:10.5px;margin-top:7px}
          [data-gl] .pgcard i{font-size:8.5px}
          [data-gl] .pgcard s{font-size:11.5px;margin-top:4px}
          [data-gl] .pgcard s span{font-size:8.5px}
          [data-gl] .pgstrip{margin:16px 18px 0;flex-wrap:wrap;gap:5px 16px}
          [data-gl] .pgstrip span{font-size:8px}
          [data-gl] .wa{position:fixed;width:54px;height:54px;right:14px;bottom:16px;z-index:400}
          [data-gl] .wa svg{width:29px;height:29px}
        }

        /* CONTENT SECTIONS */
        [data-gl] .content{position:relative;background:#020204}
        [data-gl] .section{max-width:1140px;margin:0 auto;padding:96px 24px}
        [data-gl] .section-head{max-width:640px;margin:0 auto 56px;text-align:center}
        [data-gl] .eyebrow{display:inline-block;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#6fe3ff;margin-bottom:14px}
        [data-gl] .section h2{font-family:Poppins;font-weight:800;font-size:clamp(28px,4vw,40px);line-height:1.15;letter-spacing:-.01em;color:#fff}
        [data-gl] .section p.lead{margin-top:14px;font-size:16px;line-height:1.6;color:#a9aeb5}
        [data-gl] .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:56px 24px;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08)}
        [data-gl] .stat{text-align:center}
        [data-gl] .stat b{display:block;font-family:Poppins;font-weight:900;font-size:clamp(26px,3.4vw,38px);color:#fff}
        [data-gl] .stat span{display:block;margin-top:6px;font-size:12.5px;letter-spacing:.04em;color:#8a8f97}
        [data-gl] .features{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        [data-gl] .feature{padding:28px;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(160deg,rgba(255,255,255,.035),rgba(255,255,255,.01))}
        [data-gl] .feature .ico{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;margin-bottom:18px;background:linear-gradient(to top,#46afc8 0px,#35abc7 10%,#0b859d 24%,#026c84 40%,#004e66 55%,#053f58 68%,#012c3d 80%,#031a2a 90%,#090f25 100%);box-shadow:inset 1px 0 0 rgba(150,220,250,.35),inset -1px 0 0 rgba(150,220,250,.4),0 3px 10px -6px rgba(90,220,255,.6)}
        [data-gl] .feature .ico svg{width:20px;height:20px}
        [data-gl] .feature h3{font-size:17px;font-weight:600;color:#fff;margin-bottom:8px}
        [data-gl] .feature p{font-size:14px;line-height:1.6;color:#9a9fa6}
        [data-gl] .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;counter-reset:step}
        [data-gl] .step{position:relative;padding:28px 24px 24px;border-left:1px solid rgba(255,255,255,.08)}
        [data-gl] .step::before{counter-increment:step;content:counter(step,decimal-leading-zero);font-family:Poppins;font-weight:900;font-size:13px;color:#3ec8e4;letter-spacing:.08em;display:block;margin-bottom:12px}
        [data-gl] .step h3{font-size:16.5px;font-weight:600;color:#fff;margin-bottom:8px}
        [data-gl] .step p{font-size:14px;line-height:1.6;color:#9a9fa6}
        [data-gl] .quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        [data-gl] .quote{padding:26px;border-radius:16px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025)}
        [data-gl] .quote p{font-size:14.5px;line-height:1.65;color:#d7dade}
        [data-gl] .quote footer{display:flex;align-items:center;gap:10px;margin-top:18px}
        [data-gl] .quote .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#35d8ff,#0a86d8);flex:0 0 auto}
        [data-gl] .quote b{display:block;font-size:13px;color:#fff}
        [data-gl] .quote span{display:block;font-size:11.5px;color:#8a8f97}
        [data-gl] .finalcta{text-align:center;padding:100px 24px;border-radius:28px;margin:0 24px 96px;background:radial-gradient(60% 100% at 50% 0%,rgba(60,190,235,.1),rgba(2,2,4,0) 70%),linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border:1px solid rgba(255,255,255,.08)}
        [data-gl] .finalcta h2{font-family:Poppins;font-weight:900;font-size:clamp(28px,4.4vw,44px);color:#fff;letter-spacing:-.01em}
        [data-gl] .finalcta p{margin:14px auto 32px;max-width:480px;font-size:15.5px;color:#a9aeb5}
        [data-gl] .btn.inline{position:relative;display:inline-grid;width:auto;height:auto;padding:16px 34px;border-radius:14px;font-size:16px;font-weight:500}
        [data-gl] footer.sitefoot{border-top:1px solid rgba(255,255,255,.08);padding:48px 24px 56px}
        [data-gl] .footgrid{max-width:1140px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:32px}
        [data-gl] .footbrand{max-width:280px}
        [data-gl] .footbrand b{font-family:Poppins;font-weight:900;font-size:18px;letter-spacing:-.01em;color:#fff}
        [data-gl] .footbrand p{margin-top:10px;font-size:13px;line-height:1.6;color:#8a8f97}
        [data-gl] .footcols{display:flex;gap:56px;flex-wrap:wrap}
        [data-gl] .footcol b{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7078;margin-bottom:14px}
        [data-gl] .footcol a{display:block;font-size:13.5px;color:#c7cad0;margin-bottom:10px;transition:color .2s}
        [data-gl] .footcol a:hover{color:#fff}
        [data-gl] .footbottom{max-width:1140px;margin:32px auto 0;padding-top:24px;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#6b7078;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
        @media(max-width:900px){[data-gl] .stats{grid-template-columns:repeat(2,1fr)}[data-gl] .features,[data-gl] .steps,[data-gl] .quotes{grid-template-columns:1fr}}
        @media(max-width:700px){[data-gl] .section{padding:64px 20px}[data-gl] .finalcta{margin:0 12px 72px;padding:64px 20px}}

        /* ENTRANCE TIMELINE — resting states, scoped to element that has BOTH data-gl and data-intro */
        [data-gl][data-intro] .nav{opacity:0;translate:0 -9px}
        [data-gl][data-intro] .mark,[data-gl][data-intro] .wm,[data-gl][data-intro] .links a,[data-gl][data-intro] .nav .btn,[data-gl][data-intro] .burger{opacity:0;translate:0 6px}
        [data-gl][data-intro] .badge{opacity:0;translate:0 11px;scale:.985}
        [data-gl][data-intro] .h1{opacity:0;translate:0 15px;clip-path:inset(100% 0 -30% 0)}
        [data-gl][data-intro] .sub{opacity:0;translate:0 10px}
        [data-gl][data-intro] .cta2{opacity:0;translate:0 13px;scale:.985}
        [data-gl][data-intro] .ring{opacity:0;translate:0 18px;scale:.99}
        [data-gl][data-intro] .browser{opacity:0;translate:0 26px}
        [data-gl][data-intro] .wa{opacity:0;scale:.88}
        @media(prefers-reduced-motion:reduce){
          [data-gl][data-intro] .nav,[data-gl][data-intro] .mark,[data-gl][data-intro] .wm,[data-gl][data-intro] .links a,
          [data-gl][data-intro] .nav .btn,[data-gl][data-intro] .burger,[data-gl][data-intro] .badge,[data-gl][data-intro] .h1,
          [data-gl][data-intro] .sub,[data-gl][data-intro] .cta2,[data-gl][data-intro] .ring,[data-gl][data-intro] .browser,[data-gl][data-intro] .wa
          {opacity:1;translate:none;scale:none;clip-path:none}
        }
      `}</style>

      <div ref={rootRef} data-gl="1" data-intro="1">
        {/* ═══ HERO STAGE ═══ */}
        <div className="stage">
          <div className="canvas" ref={canvasRef} id="gl-canvas">
            <div className="bg" />
            <div className="stars" ref={stARef} />
            <div className="stars" ref={stBRef} />

            <div className="showcase">
              <div className="ring" ref={ringRef} />
            </div>

            {/* Browser mock */}
            {/* <div className="browser">
              <div className="bar">
                <div className="dots"><i /><i /><i /></div>
                <div className="omni">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2" />
                    <path d="M20 20l-3.8-3.8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                  <span>Shop Focused - Skin Care</span>
                </div>
                <div className="tools">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V4m0 0L8 8m4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15v5h16v-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3 3 8l9 5 9-5-9-5Z" fill="#fff" opacity=".95" />
                    <path d="M3 13l9 5 9-5" stroke="#fff" strokeWidth="1.4" fill="none" opacity=".55" />
                  </svg>
                </div>
              </div>
              <div className="page">
                <div className="ann">
                  <u style={{ left: 20 }}>‹</u>
                  <span>Moisturized daily at home</span>
                  <u style={{ right: 20 }}>›</u>
                </div>
                <div className="shoplogo"><em>GLOW</em><i>SKIN CARE</i></div>
                <div className="shopicons">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#222" strokeWidth="2" />
                    <path d="M20 20l-3.8-3.8" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#222" strokeWidth="2" />
                    <path d="M4.5 21c0-4.2 3.4-6.6 7.5-6.6s7.5 2.4 7.5 6.6" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5.5 8h13l-1.2 12H6.7L5.5 8Z" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M9 8V6.2A3 3 0 0 1 15 6.2V8" stroke="#222" strokeWidth="2" />
                  </svg>
                </div>
                <div className="pagebody">
                  <div className="pghero">
                    <img alt="Warm amber and ivory skincare collection in golden morning light" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_0316394c-37bd-432b-a1f2-ee46a461c22b.png" />
                    <div className="scrim" />
                    <div className="copy">
                      <u>Just added</u>
                      <em>Let your beauty<br />be sacred.</em>
                      <i>EXPLORE TODAY</i>
                    </div>
                  </div>
                  <div className="pgsec"><b>Best reviewed</b><u>see more</u></div>
                  <div className="pggrid">
                    <div className="pgcard">
                      <div className="ph">
                        <span className="tag">-24%</span>
                        {/* eslint-disable-next-line @next/next/no-img-element
                        <img alt="Vitamin C serum in amber glass" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110423_3b5dcf24-cc07-4f3b-8423-b597fffcdbfb.png" />
                      </div>
                      <b>Serum Radiance C</b><i>Brightens · 30ml</i>
                      <s>$ 129.90 <span>$ 169.90</span></s>
                    </div>
                    <div className="pgcard">
                      <div className="ph">
                        {/* eslint-disable-next-line @next/next/no-img-element 
                        <img alt="Nourishing lotion jar on soft linen" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_50ec81be-8341-447f-a0c2-a5673a465447.png" />
                      </div>
                      <b>Nourishing Lotion</b><i>Arid skin · 50g</i><s>$ 89.90</s>
                    </div>
                    <div className="pgcard">
                      <div className="ph">
                        <span className="tag">SET</span>
                        {/* eslint-disable-next-line @next/next/no-img-element 
                        <img alt="Three-piece Sunset Renewal skincare kit" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_fd208d72-9112-4cde-b509-8d273b470c6f.png" />
                      </div>
                      <b>Kit Sunset Renewal</b><i>3 products</i>
                      <s>$ 219.90 <span>$ 289.90</span></s>
                    </div>
                    <div className="pgcard">
                      <div className="ph">
                        <span className="tag">JUST</span>
                        {/* eslint-disable-next-line @next/next/no-img-element 
                        <img alt="Lightweight facial sunscreen beside clear water" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_9731544c-a83b-48c4-bacb-e31e4d4b9f42.png" />
                      </div>
                      <b>Defender SPF 60</b><i>Light feel · 40g</i><s>$ 74.90</s>
                    </div>
                  </div>
                  <div className="pgstrip">
                    <span>Ships gratis north of $ 199</span>
                    <span>Pay 12x nil rates</span>
                    <span>Swaps in 30 days</span>
                    <span>Hypoallergenically checked</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Stack: nav + badge + hero copy + cta */}
            <div className="stack">
              <nav className="nav" ref={navRef} id="gl-nav">
                <svg className="mark" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="gl-sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#8ef4ff" />
                      <stop offset=".5" stopColor="#35d8ff" />
                      <stop offset="1" stopColor="#0a86d8" />
                    </linearGradient>
                    <linearGradient id="gl-sw2" x1="40" y1="10" x2="10" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#a6f7ff" />
                      <stop offset="1" stopColor="#0f9ae0" stopOpacity=".25" />
                    </linearGradient>
                  </defs>
                  <g transform="rotate(-32 24 24)">
                    <ellipse cx="24" cy="24" rx="18.5" ry="9.6" fill="none" stroke="url(#gl-sw2)" strokeWidth="3.1" strokeLinecap="round" strokeDasharray="58 30" strokeDashoffset="14" />
                    <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
                  </g>
                  <circle cx="24" cy="24" r="6.6" fill="url(#gl-sw)" />
                  <circle cx="24" cy="24" r="2.6" fill="#fff" />
                </svg>
                <div className="wm">
                  <span className="kick">SHOPS</span>
                  <span className="name" id="gl-wmName">VERTEX</span>
                </div>
                <div className="navmenu" ref={navmenuRef} id="gl-navmenu">
                  <div className="links">
                    <Link href="#origin">Origin</Link>
                    <Link href="#how">Learn how</Link>
                    <Link href="#features">Core Vertex</Link>
                    <Link href="#pricing">Prices</Link>
                    <Link href="#support">Support</Link>
                  </div>
                  <Link href="#" className="btn"><span id="gl-ctaLabel">Build new shop</span></Link>
                </div>
                <button type="button" className="burger" ref={burgerRef} id="gl-burger" aria-label="Opens menu" aria-expanded="false" aria-controls="gl-navmenu">
                  <span /><span /><span />
                </button>
              </nav>

              <div className="badge">
                <i>
                  <svg viewBox="5 1 14 22" preserveAspectRatio="none">
                    <path d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z" fill="rgba(16,112,152,.72)" stroke="rgba(190,236,255,.6)" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </i>
                <b id="gl-badgeTxt">Professionals at store startup</b>
              </div>

              <h1 className="h1 l1" id="gl-h1a">Streamline the shop</h1>
              <h1 className="h1 l2" id="gl-h1b">Process</h1>
              <p className="sub s1" id="gl-sub1">
                <b>Restructuring store systems / <span className="nb">E-commerce</span></b> orchestrated with
              </p>
              <p className="sub s2" id="gl-sub2">checkouts, performance, a sustainable expansion.</p>

              <Link href="#" className="btn cta2"><span id="gl-vpLabel">See prices</span></Link>
            </div>
          </div>

          {/* WhatsApp FAB */}
          {/* <Link href="#" className="wa" aria-label="WhatsApp">
            <svg viewBox="0 0 32 32" fill="none">
              <path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.9 2 7L3 29l6.6-2.2c2 1.1 4.2 1.7 6.4 1.7 7 0 12.7-5.6 12.7-12.6C28.7 8.6 23 3 16 3Zm0 22.9c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1.3 1.3-3.8-.3-.4a10.2 10.2 0 0 1-1.6-5.5C5.5 9.9 10.1 5.3 16 5.3S26.5 9.9 26.5 15.6 21.9 25.9 16 25.9Zm5.7-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.3.2-.6 0a8.1 8.1 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.6 3.6 0 0 0-1.1 2.7c0 1.6 1.2 3.2 1.3 3.4.2.2 2.4 3.7 5.8 5.1.8.3 1.4.6 1.9.7.8.3 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5s-.3-.2-.6-.4Z" />
            </svg>
          </Link> */}
        </div>

        {/* ═══ CONTENT SECTIONS ═══ */}
        {/* <div className="content">
          <section className="stats" id="origin">
            <div className="stat"><b>12,400+</b><span>Shops launched</span></div>
            <div className="stat"><b>98.7%</b><span>Checkout uptime</span></div>
            <div className="stat"><b>41</b><span>Countries served</span></div>
            <div className="stat"><b>4.9/5</b><span>Merchant rating</span></div>
          </section>

          <section className="section" id="features">
            <div className="section-head">
              <span className="eyebrow">Core Vertex</span>
              <h2>Everything a modern storefront needs, in one place</h2>
              <p className="lead">Vertex Shops brings checkout, inventory, and growth tooling together so your team ships faster and stops stitching plugins together.</p>
            </div>
            <div className="features">
              <div className="feature">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h12" stroke="#bff6ff" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <h3>Unified checkout</h3>
                <p>ACH, card, and instalments in a single flow, tuned to convert across devices.</p>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10l8-6 8 6v10" stroke="#bff6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3>Real-time inventory</h3>
                <p>Stock syncs across every channel the moment it changes, no manual reconciling.</p>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5m6 14V9m6 10V3" stroke="#bff6ff" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <h3>Built-in analytics</h3>
                <p>Track performance and expansion opportunities without bolting on a BI tool.</p>
              </div>
            </div>
          </section>

          <section className="section" id="how">
            <div className="section-head">
              <span className="eyebrow">Learn how</span>
              <h2>From idea to storefront in three steps</h2>
            </div>
            <div className="steps">
              <div className="step"><h3>Structure your catalog</h3><p>Import products, set pricing tiers, and organize collections in minutes.</p></div>
              <div className="step"><h3>Connect checkout</h3><p>Turn on the payment methods your customers already trust.</p></div>
              <div className="step"><h3>Launch and scale</h3><p>Go live, then lean on analytics and automation as orders grow.</p></div>
            </div>
          </section>

          <section className="section" id="support">
            <div className="section-head">
              <span className="eyebrow">Support</span>
              <h2>Trusted by teams shipping real orders</h2>
            </div>
            <div className="quotes">
              <div className="quote">
                <p>"We moved our whole catalog over in a weekend. Checkout conversion went up almost immediately."</p>
                <footer><span className="av" /><div><b>Renata Alves</b><span>Founder, Glow Skin Care</span></div></footer>
              </div>
              <div className="quote">
                <p>"Support actually answers. That alone was worth switching platforms for."</p>
                <footer><span className="av" /><div><b>Marcus Feld</b><span>Ops Lead, MahaveerTrans</span></div></footer>
              </div>
              <div className="quote">
                <p>"The inventory sync finally stopped our overselling problem across channels."</p>
                <footer><span className="av" /><div><b>Priya Nair</b><span>COO, Nostalgia Co.</span></div></footer>
              </div>
            </div>
          </section>

          <section className="section" id="pricing">
            <div className="finalcta">
              <h2>Ready to streamline the shop process?</h2>
              <p>Start free, launch in a day, and only pay as your store grows.</p>
              <Link href="#" className="btn inline"><span>Build new shop</span></Link>
            </div>
          </section>

          <footer className="sitefoot">
            <div className="footgrid">
              <div className="footbrand">
                <b>VERTEX SHOPS</b>
                <p>The e-commerce SaaS for teams who&apos;d rather ship than stitch plugins together.</p>
              </div>
              <div className="footcols">
                <div className="footcol">
                  <b>Product</b>
                  <Link href="#features">Core Vertex</Link>
                  <Link href="#how">Learn how</Link>
                  <Link href="#pricing">Prices</Link>
                </div>
                <div className="footcol">
                  <b>Company</b>
                  <Link href="#origin">Origin</Link>
                  <Link href="#">Careers</Link>
                  <Link href="#">Press</Link>
                </div>
                <div className="footcol">
                  <b>Support</b>
                  <Link href="#">Help center</Link>
                  <Link href="#">Status</Link>
                  <Link href="#">Contact</Link>
                </div>
              </div>
            </div>
            <div className="footbottom">
              <span>© 2026 Vertex Shops. All rights reserved.</span>
              <span>Made for merchants, not for middlemen.</span>
            </div>
          </footer>
        </div> */}
      </div>
    </>
  );
}
