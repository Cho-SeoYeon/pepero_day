(() => {
  'use strict';

  // ---------- 타입 (카드 배경/에너지) ----------
  const TYPES = {
    choco: { n: '초코', icon: '🍫', t1: '#f6e2c6', t2: '#c99366', c: '#c58f62', l: '#fff1dc' },
    nut: { n: '견과', icon: '🥜', t1: '#f9e8c2', t2: '#d9a45f', c: '#e8bd7c', l: '#fff6df' },
    strawberry: { n: '딸기', icon: '🍓', t1: '#ffe6ee', t2: '#f39bb7', c: '#ffc2d4', l: '#fff1f5' },
    milk: { n: '밀크', icon: '🥛', t1: '#fffdf6', t2: '#d7e3ef', c: '#e6eef6', l: '#ffffff' },
    greentea: { n: '녹차', icon: '🍵', t1: '#eaf5d9', t2: '#9cc66b', c: '#c4e19f', l: '#f6fcec' },
    cheese: { n: '치즈', icon: '🧀', t1: '#fff8d4', t2: '#f4c94a', c: '#ffe58a', l: '#fffbe6' },
    flower: { n: '플라워', icon: '🌹', t1: '#fde8ee', t2: '#d97fa0', c: '#f6b9cc', l: '#fff3f6' },
    salt: { n: '솔트', icon: '🧂', t1: '#eef6fc', t2: '#a6c8e6', c: '#d3e6f6', l: '#f8fcff' },
    dark: { n: '다크', icon: '🌑', t1: '#7d5f86', t2: '#251729', c: '#9b7aa6', l: '#c9a9cf', tx: '#fff' },
  };

  const RAR = {
    C: { w: 10, mark: '●', label: '노멀' },
    U: { w: 6, mark: '◆', label: '언커먼' },
    R: { w: 3.5, mark: '★', label: '레어 ✨' },
    EX: { w: 2.5, mark: '★★', label: '울트라 레어 🌈' },
  };

  // [에너지 개수, 기술 이름, 데미지, 설명]
  const PEPEROS = [
    { id: 1, name: '오리지널', type: 'choco', kind: 'coat', coat: '#4a2a1c', r: 'C', hp: 70, g: 54, retreat: 1,
      moves: [[1, '톡 부러뜨리기', 20], [3, '원조의 품격', 60, '모든 빼빼로는 이 카드에게 경의를 표한다.']],
      flavor: '막대 과자에 초콜릿을 입힌, 모든 것의 시작.' },
    { id: 2, name: '초코필드', type: 'choco', kind: 'field', coat: '#3d2216', top: 'chunk', r: 'EX', hp: 160, g: 43, retreat: 3,
      moves: [[2, '초코 듬뿍', 50], [4, '필드 오브 초코', 180, '자신의 에너지를 2개 트래시한다. 그래도 초코는 남는다.']],
      flavor: '과자가 안 보일 만큼 초콜릿을 꽉 채운 전설의 막대.' },
    { id: 3, name: '크런키', type: 'choco', kind: 'coat', coat: '#6b3f2a', top: 'crunch', r: 'C', hp: 80, g: 39, retreat: 1,
      moves: [[1, '바삭', 20], [2, '크런치 펀치', 50, '코인을 1번 던져 앞면이면 20데미지를 추가한다.']],
      flavor: '한 입 깨물면 바사삭 소리가 교실 끝까지 울린다.' },
    { id: 4, name: '크런키 초코', type: 'choco', kind: 'coat', coat: '#3f2318', top: 'crunch', drz: '#2a160e', r: 'U', hp: 90, g: 39, retreat: 2,
      moves: [[1, '바사삭', 30], [3, '더블 크런치', 70, '이 기술은 상대의 다이어트 결심을 무효로 한다.']],
      flavor: '초코에 초코를 더하고 바삭함까지. 욕심쟁이 막대.' },
    { id: 5, name: '크런키 그래놀라', type: 'nut', kind: 'coat', coat: '#c99a6b', top: 'granola', r: 'U', hp: 90, g: 37, retreat: 1,
      moves: [[1, '곡물 샤워', 20, '자신의 HP를 20 회복한다.'], [3, '그래놀라 러시', 70]],
      flavor: '아침 대용이라고 우기면 아침이 된다.' },
    { id: 6, name: '산리오 크런키', type: 'strawberry', kind: 'coat', coat: '#f9b4c9', top: 'crunch', drz: '#ffffff', r: 'R', hp: 100, g: 39, retreat: 1,
      moves: [[1, '핑크 팡팡', 30], [3, '러블리 크런치', 90, '상대를 귀여움에 혼란 상태로 만든다.']],
      flavor: '보기만 해도 기분이 몽글몽글해지는 핑크빛 막대.' },
    { id: 7, name: '아몬드', type: 'nut', kind: 'coat', coat: '#4a2a1c', top: 'almond', r: 'R', hp: 110, g: 32, retreat: 2,
      moves: [[1, '아몬드 탄', 40], [3, '고소한 일격', 100, '다음 턴, 상대는 한 개 더 먹고 싶어진다.']],
      flavor: '오독오독 아몬드가 박힌 고소함의 정점.' },
    { id: 8, name: '스노위아몬드', type: 'milk', kind: 'coat', coat: '#f8f2e4', top: 'almond', r: 'U', hp: 90, g: 32, retreat: 1,
      moves: [[1, '눈송이', 20], [3, '스노우 아몬드', 70, '상대를 마비 상태로 만든다. 너무 맛있어서.']],
      flavor: '하얀 눈이 소복이 쌓인 듯한 화이트 아몬드.' },
    { id: 9, name: '화이트쿠키', type: 'milk', kind: 'coat', coat: '#fbf6ea', top: 'cookie', bits: '#3a2216', r: 'U', hp: 90, g: 37, retreat: 1,
      moves: [[1, '쿠키 크럼블', 30], [3, '화이트 블리자드', 70]],
      flavor: '하얀 초콜릿 위에 까만 쿠키가 콕콕.' },
    { id: 10, name: '누드초코', type: 'choco', kind: 'nude', fill: '#4a2a1c', r: 'C', hp: 70, g: 50, retreat: 1,
      moves: [[1, '속이 꽉', 20], [2, '반전 매력', 60, '겉은 과자, 속은 초코. 상대는 방심한다.']],
      flavor: '초콜릿이 과자 속에 숨어 있어 손에 묻지 않는다.' },
    { id: 11, name: '누드녹차', type: 'greentea', kind: 'nude', fill: '#6e9f45', r: 'U', hp: 80, g: 50, retreat: 1,
      moves: [[1, '말차 한 모금', 20, '자신의 HP를 30 회복한다.'], [3, '녹차 명상', 70]],
      flavor: '쌉싸름한 녹차가 속까지 꽉 찬 어른의 맛.' },
    { id: 12, name: '딸기', type: 'strawberry', kind: 'coat', coat: '#f48fb1', top: 'berry', r: 'C', hp: 70, g: 32, retreat: 1,
      moves: [[1, '새콤', 20], [2, '딸기 폭탄', 60, '상대의 볼을 분홍빛으로 물들인다.']],
      flavor: '새콤달콤 딸기 초콜릿에 딸기 조각까지.' },
    { id: 13, name: '누드크림치즈', type: 'cheese', kind: 'nude', fill: '#fff1cf', r: 'U', hp: 90, g: 50, retreat: 2,
      moves: [[1, '크림 쭉', 30], [3, '치즈케이크 웨이브', 80]],
      flavor: '막대 속에 치즈케이크가 들어 있다는 소문이 있다.' },
    { id: 14, name: '누드치즈', type: 'cheese', kind: 'nude', fill: '#ffcf4a', r: 'C', hp: 70, g: 50, retreat: 1,
      moves: [[1, '쭉 늘어나기', 20], [2, '치즈 홀릭', 60]],
      flavor: '짭짤 고소한 치즈가 가득. 멈출 수 없다.' },
    { id: 15, name: '로즈블랙티', type: 'flower', kind: 'coat', coat: '#f2b8c6', top: 'rose', r: 'EX', hp: 150, g: 32, retreat: 2,
      moves: [[2, '장미 꽃잎', 50], [4, '애프터눈 티 타임', 170, '이 공격 후, 자신은 우아하게 차를 마시며 쉰다.']],
      flavor: '장미 향과 홍차 향이 만나 피어난 귀한 막대.' },
    { id: 16, name: '솔티바닐라', type: 'salt', kind: 'coat', coat: '#fff8e7', top: 'salt', r: 'R', hp: 100, g: 32, retreat: 1,
      moves: [[1, '소금 한 꼬집', 30], [3, '바닐라 웨이브', 90, '단맛과 짠맛이 파도처럼 번갈아 밀려온다.']],
      flavor: '바닐라의 달콤함 끝에 살짝 스치는 소금 한 알.' },
    { id: 17, name: '단짠크런치', type: 'salt', kind: 'coat', coat: '#8b5a3c', top: 'saltcrunch', r: 'R', hp: 110, g: 37, retreat: 2,
      moves: [[1, '단', 30], [3, '짠', 100, '단짠의 굴레에서 상대는 벗어날 수 없다.']],
      flavor: '달고, 짜고, 바삭하고. 무한 반복 주의.' },
    { id: 18, name: '초코쿠키', type: 'choco', kind: 'coat', coat: '#3a2216', top: 'cookie', bits: '#f3e6cc', r: 'C', hp: 80, g: 37, retreat: 1,
      moves: [[1, '쿠키 투척', 20], [2, '쿠앤크 콤보', 60]],
      flavor: '진한 초코 위에 바삭한 쿠키 조각을 솔솔.' },
    { id: 19, name: '다크', type: 'dark', kind: 'coat', coat: '#24130e', drz: '#4a2a1c', r: 'EX', hp: 170, g: 32, retreat: 3,
      moves: [[2, '카카오 어택', 60], [4, '다크 매터', 190, '이 쌉싸름함을 아는 자만이 견딜 수 있다.']],
      flavor: '깊고 진한 카카오. 어둠 속에서 가장 빛나는 막대.' },
    { id: 20, name: '더 슬림', type: 'choco', kind: 'slim', coat: '#4a2a1c', r: 'C', hp: 60, g: 30, retreat: 0,
      moves: [[1, '날렵하게', 20, '코인을 던져 앞면이면 다음 상대 공격을 피한다.'], [2, '슬림 스트라이크', 50]],
      flavor: '더 얇게, 더 가볍게. 하나 더 먹어도 괜찮아.' },
  ];

  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(3, '0');
  const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // ---------- 사운드 ----------
  let soundOn = true;
  try { soundOn = localStorage.getItem('pepero-sound') !== 'off'; } catch (e) { /* 무시 */ }
  let actx;
  function beep(notes) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime;
      notes.forEach(([freq, at, dur, type, vol]) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = type || 'square';
        o.frequency.value = freq;
        g.gain.setValueAtTime(vol || 0.05, t0 + at);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + at + dur);
        o.connect(g).connect(actx.destination);
        o.start(t0 + at);
        o.stop(t0 + at + dur + 0.02);
      });
    } catch (e) { /* 오디오 미지원 */ }
  }
  const SFX = {
    shake: () => beep([[330, 0, 0.08], [330, 0.45, 0.08], [330, 0.9, 0.08], [392, 1.3, 0.1]]),
    open: () => beep([[523, 0, 0.12, 'triangle', 0.08], [659, 0.08, 0.12, 'triangle', 0.08], [784, 0.16, 0.12, 'triangle', 0.08], [1047, 0.24, 0.12, 'triangle', 0.08], [1319, 0.32, 0.12, 'triangle', 0.08], [1568, 0.4, 0.4, 'triangle', 0.08]]),
    rare: () => beep([[1568, 0, 0.1, 'sine', 0.06], [2093, 0.1, 0.1, 'sine', 0.06], [2637, 0.2, 0.1, 'sine', 0.06], [2093, 0.3, 0.1, 'sine', 0.06], [2637, 0.4, 0.5, 'sine', 0.06]]),
    click: () => beep([[660, 0, 0.05]]),
  };
  function renderSound() {
    const b = $('#sound');
    b.setAttribute('aria-pressed', String(soundOn));
    b.innerHTML = `${soundOn ? '🔊' : '🔈'} 사운드 <b>${soundOn ? 'ON' : 'OFF'}</b>`;
  }

  // ---------- 빼빼로 그리기 ----------
  function toppings(p, W, c, r) {
    let s = '';
    const rx = () => (2.5 + r() * (W - 5)).toFixed(1);
    const ry = () => (W / 2 + 4 + r() * (c - W / 2 - 12)).toFixed(1);
    const rot = () => Math.floor(r() * 180);
    const add = (n, f) => { for (let i = 0; i < n; i++) s += f(rx(), ry()); };
    switch (p.top) {
      case 'almond':
        add(10, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.1" fill="#dcaa6e" stroke="#8a5a2b" stroke-width=".8" transform="rotate(${rot()} ${x} ${y})"/>`);
        break;
      case 'crunch':
        add(28, (x, y) => `<circle cx="${x}" cy="${y}" r="${(1.1 + r() * 1.2).toFixed(1)}" fill="#f4e2b8" stroke="#b58a4a" stroke-width=".4"/>`);
        break;
      case 'saltcrunch':
        add(18, (x, y) => `<circle cx="${x}" cy="${y}" r="${(1.1 + r() * 1.1).toFixed(1)}" fill="#f4e2b8" stroke="#b58a4a" stroke-width=".4"/>`);
        add(12, (x, y) => `<rect x="${x}" y="${y}" width="1.8" height="1.8" fill="#fff" stroke="#9cc7e8" stroke-width=".4" transform="rotate(${rot()} ${x} ${y})"/>`);
        break;
      case 'cookie':
        add(16, (x, y) => `<rect x="${x}" y="${y}" width="${(2.2 + r() * 2).toFixed(1)}" height="${(1.8 + r() * 1.4).toFixed(1)}" rx=".5" fill="${p.bits}" transform="rotate(${rot()} ${x} ${y})"/>`);
        break;
      case 'granola':
        add(10, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.5" fill="#efd79f" stroke="#b58a4a" stroke-width=".5" transform="rotate(${rot()} ${x} ${y})"/>`);
        add(10, (x, y) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#7a4a22"/>`);
        break;
      case 'berry':
        add(18, (x, y) => `<rect x="${x}" y="${y}" width="2.2" height="2.2" rx=".6" fill="${r() > 0.5 ? '#d6335e' : '#ff9fbb'}" transform="rotate(${rot()} ${x} ${y})"/>`);
        break;
      case 'rose':
        add(10, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.3" fill="#ff6f91" transform="rotate(${rot()} ${x} ${y})"/>`);
        add(16, (x, y) => `<circle cx="${x}" cy="${y}" r=".7" fill="#3b2a2a"/>`);
        break;
      case 'salt':
        add(16, (x, y) => `<rect x="${x}" y="${y}" width="1.9" height="1.9" fill="#fff" stroke="#9cc7e8" stroke-width=".5" transform="rotate(${rot()} ${x} ${y})"/>`);
        break;
      case 'chunk':
        add(10, (x, y) => `<rect x="${x}" y="${y}" width="4.2" height="3.2" rx=".8" fill="${p.bits || '#2a160e'}" transform="rotate(${rot()} ${x} ${y})"/>`);
        break;
      default:
    }
    return s;
  }

  // (0,0) 기준 세로 막대: 위쪽 코팅, 아래쪽 과자
  function stickG(p, seed) {
    const r = rng(seed);
    const W = p.kind === 'slim' ? 10 : p.kind === 'field' ? 22 : 16;
    const L = 220;
    let s = `<rect x="0" y="0" width="${W}" height="${L}" rx="${W / 2.3}" fill="#e0ad6a" stroke="#6b4320" stroke-width="2"/>`;
    if (p.kind === 'nude') {
      s += `<rect x="${W / 2 - 2.5}" y="10" width="5" height="${L - 20}" rx="2.5" fill="${p.fill}" opacity=".28"/>`;
      for (let y = 22; y < L - 8; y += 20) s += `<path d="M3.5 ${y}h${W - 7}" stroke="#c48a48" stroke-width="1.4" stroke-linecap="round"/>`;
      for (let i = 0; i < 14; i++) s += `<circle cx="${(3 + r() * (W - 6)).toFixed(1)}" cy="${(10 + r() * (L - 20)).toFixed(1)}" r=".7" fill="#b07636"/>`;
      s += `<ellipse cx="${W / 2}" cy="3" rx="${W / 2 - 0.5}" ry="3.6" fill="#f0c587" stroke="#6b4320" stroke-width="1.5"/>`;
      s += `<ellipse cx="${W / 2}" cy="3" rx="${W / 2 - 3.6}" ry="2" fill="${p.fill}"/>`;
    } else {
      const c = Math.round(L * 0.7);
      for (let y = c + 14; y < L - 6; y += 16) s += `<path d="M3 ${y}h${W - 6}" stroke="#c48a48" stroke-width="1.4" stroke-linecap="round"/>`;
      s += `<path d="M0 ${W / 2}a${W / 2} ${W / 2} 0 0 1 ${W} 0V${c}q-${W / 4} 7 -${W / 2} 0q-${W / 4} 7 -${W / 2} 0Z" fill="${p.coat}" stroke="#2b2118" stroke-width="1.8" stroke-linejoin="round"/>`;
      if (p.drz) {
        const pts = [];
        for (let y = 8, k = 0; y <= c - 4; y += 12, k++) pts.push(`${k % 2 ? W - 3 : 3},${y}`);
        s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${p.drz}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`;
      }
      s += toppings(p, W, c, r);
    }
    s += `<rect x="${W * 0.18}" y="8" width="${Math.max(1.6, W * 0.14)}" height="70" rx="1" fill="#fff" opacity=".3"/>`;
    return { s, W, L };
  }

  function artSVG(p) {
    const T = TYPES[p.type];
    const id = `a${p.id}`;
    let s = `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" aria-label="${p.name} 빼빼로 그림">`;
    s += `<defs><radialGradient id="${id}" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="${T.l}"/><stop offset=".55" stop-color="${T.c}"/><stop offset="1" stop-color="${T.t2}"/></radialGradient>
      <clipPath id="${id}c"><rect width="300" height="180"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}c)"><rect width="300" height="180" fill="url(#${id})"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (Math.PI * 2 * i) / 18;
      s += `<path d="M150 90L${(150 + Math.cos(a - 0.06) * 260).toFixed(0)} ${(90 + Math.sin(a - 0.06) * 260).toFixed(0)}L${(150 + Math.cos(a + 0.06) * 260).toFixed(0)} ${(90 + Math.sin(a + 0.06) * 260).toFixed(0)}Z" fill="#fff" opacity=".22"/>`;
    }
    [[96, 92, -30, 2], [204, 92, 28, 3], [150, 90, 4, 1]].forEach(([x, y, a, seed]) => {
      const st = stickG(p, p.id * 31 + seed);
      s += `<g transform="translate(${x} ${y}) rotate(${a}) scale(.72) translate(${-st.W / 2} ${-st.L / 2})">${st.s}</g>`;
    });
    const star = (x, y, k) => `<path d="M${x} ${y - k}Q${x} ${y} ${x + k} ${y}Q${x} ${y} ${x} ${y + k}Q${x} ${y} ${x - k} ${y}Q${x} ${y} ${x} ${y - k}Z" fill="#fff"/>`;
    s += star(40, 34, 9) + star(262, 140, 11) + star(254, 30, 6) + star(52, 150, 6);
    return s + '</g></svg>';
  }

  const energy = (T) => `<span class="en" style="background:${T.c}">${T.icon}</span>`;
  const cost = (n, T) => energy(T) + '<span class="en cl">★</span>'.repeat(Math.max(0, n - 1));

  function cardHTML(p) {
    const T = TYPES[p.type];
    const ex = p.r === 'EX';
    return `<div class="tcg" style="--t1:${T.t1};--t2:${T.t2};${T.tx ? `--tx:${T.tx}` : ''}">
      <div class="tcg-head">
        <span class="stage-tag">빼빼로</span>
        <span class="nm">${p.name}${ex ? '<i>ex</i>' : ''}</span>
        <span class="hp"><small>HP</small>${p.hp}</span>${energy(T)}
      </div>
      <div class="art">${artSVG(p)}</div>
      <div class="dexline">No.${pad(p.id)} ${p.name} 빼빼로 · ${T.n} 타입 · 중량 ${p.g}g</div>
      <div class="moves">${p.moves.map((m) => `
        <div class="move"><span class="cost">${cost(m[0], T)}</span><b>${m[1]}</b><span class="dmg">${m[2]}</span>${m[3] ? `<p>${m[3]}</p>` : ''}</div>`).join('')}
      </div>
      <div class="stats"><span>약점 🔥×2</span><span>저항 ❄️-30</span><span>후퇴 ${p.retreat ? '★'.repeat(p.retreat) : '-'}</span></div>
      <div class="foot"><span class="rar">${RAR[p.r].mark}</span><span class="flv">${p.flavor}</span><span class="num">${pad(p.id)}/020</span></div>
      <div class="holo"></div>
    </div>`;
  }

  // ---------- 뽑기 ----------
  function pick() {
    const total = PEPEROS.reduce((a, p) => a + RAR[p.r].w, 0);
    let x = Math.random() * total;
    for (const p of PEPEROS) { x -= RAR[p.r].w; if (x <= 0) return p; }
    return PEPEROS[0];
  }

  function burst(rar) {
    const box = $('#sparkles');
    box.innerHTML = '';
    const n = rar === 'EX' ? 40 : rar === 'R' ? 28 : 18;
    const colors = rar === 'EX' ? ['#ff9dbd', '#ffe066', '#8fe3ff', '#c9a7ff', '#fff'] : ['#ffd54a', '#fff3b0', '#ff9dbd', '#fff'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 120 + Math.random() * 120;
      const el = document.createElement('i');
      el.textContent = Math.random() > 0.4 ? '✦' : '✧';
      el.style.cssText = `--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;--s:${(12 + Math.random() * 18).toFixed(0)}px;--c:${colors[i % colors.length]};--d:${(Math.random() * 0.4).toFixed(2)}s`;
      box.appendChild(el);
    }
  }

  // ---------- 도감 ----------
  const DEX_KEY = 'pepero-dex';
  let dex = new Set();
  try { dex = new Set(JSON.parse(localStorage.getItem(DEX_KEY)) || []); } catch (e) { /* 무시 */ }
  function renderDex() {
    $('#dexCount').textContent = `${dex.size}/${PEPEROS.length}`;
    $('#dexGrid').innerHTML = PEPEROS.map((p) => {
      if (!dex.has(p.id)) return `<div class="slot empty">?</div>`;
      const T = TYPES[p.type];
      return `<div class="slot" style="--t1:${T.t1};--t2:${T.t2};${T.tx ? `--tx:${T.tx}` : ''}"><span class="ic">${T.icon}</span>${p.name}<span>${RAR[p.r].mark}</span></div>`;
    }).join('');
  }

  // ---------- 흐름 ----------
  const arena = $('#arena');
  let busy = false;

  function open() {
    if (busy || arena.classList.contains('opening')) return;
    busy = true;
    const p = pick();
    $('#front').innerHTML = cardHTML(p);
    arena.classList.remove('rar-C', 'rar-U', 'rar-R', 'rar-EX');
    arena.classList.add('shaking', `rar-${p.r}`);
    $('#title').textContent = '두근두근...';
    SFX.shake();
    setTimeout(() => {
      arena.classList.remove('shaking');
      arena.classList.add('opening');
      burst(p.r);
      SFX.open();
      if (p.r === 'R' || p.r === 'EX') setTimeout(SFX.rare, 900);
    }, 1550);
    setTimeout(() => {
      arena.classList.add('revealed');
      const isNew = !dex.has(p.id);
      dex.add(p.id);
      try { localStorage.setItem(DEX_KEY, JSON.stringify([...dex])); } catch (e) { /* 무시 */ }
      renderDex();
      $('#title').textContent = `${p.name} 빼빼로 등장!`;
      $('#result').innerHTML = `${RAR[p.r].label} 카드를 뽑았어요${isNew ? ' · NEW!' : ''}<small>카드를 기울여 반짝임을 확인해보세요</small>`;
      $('#again').disabled = false;
      busy = false;
    }, 3300);
  }

  function reset() {
    if (busy) return;
    SFX.click();
    arena.className = 'arena';
    $('#tilt').style.cssText = '';
    $('#sparkles').innerHTML = '';
    $('#title').textContent = '볼을 눌러 빼빼로를 뽑아보세요!';
    $('#result').textContent = '';
    $('#again').disabled = true;
  }

  // 카드 기울이기 + 홀로그램
  const tilt = $('#tilt');
  function onMove(e) {
    if (!arena.classList.contains('revealed')) return;
    const rect = tilt.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    tilt.style.setProperty('--ry', `${((x - 0.5) * 22).toFixed(1)}deg`);
    tilt.style.setProperty('--rx', `${((0.5 - y) * 18).toFixed(1)}deg`);
    tilt.style.setProperty('--mx', `${(x * 100).toFixed(0)}%`);
    tilt.style.setProperty('--my', `${(y * 100).toFixed(0)}%`);
    arena.classList.add('tilted');
  }
  function onLeave() {
    tilt.style.removeProperty('--rx');
    tilt.style.removeProperty('--ry');
    arena.classList.remove('tilted');
  }
  $('#cardWrap').addEventListener('pointermove', onMove);
  $('#cardWrap').addEventListener('pointerleave', onLeave);
  $('#cardWrap').addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') onLeave(); });

  $('#ball').addEventListener('click', open);
  $('#again').addEventListener('click', reset);
  $('#dexBtn').addEventListener('click', () => {
    SFX.click();
    $('#dex').classList.toggle('hidden');
    if (!$('#dex').classList.contains('hidden')) $('#dex').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#sound').addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('pepero-sound', soundOn ? 'on' : 'off'); } catch (e) { /* 무시 */ }
    renderSound();
    SFX.click();
  });

  // ?to=서아&from=베프 로 받는 사람 표시
  const q = new URLSearchParams(location.search);
  const to = (q.get('to') || '').slice(0, 20);
  const from = (q.get('from') || '').slice(0, 20);
  if (to) {
    $('#toLine').textContent = `To. ${to} — ${from ? `${from}의 ` : ''}빼빼로 카드팩이 도착했어요 🎁`;
    document.title = `${to}에게 온 빼빼로 카드팩`;
  }

  renderSound();
  renderDex();
})();
