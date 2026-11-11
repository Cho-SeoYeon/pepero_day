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
  let actx, master;
  function ctx() {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = 1;
      master.connect(actx.destination);
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, t, dur, type, vol) {
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  let noiseBuf;
  function noise(t, dur, vol, cutoff) {
    if (!noiseBuf) {
      noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = actx.createBufferSource();
    s.buffer = noiseBuf;
    const f = actx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = cutoff || 1200;
    const g = actx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f).connect(g).connect(master);
    s.start(t);
    s.stop(t + dur + 0.02);
  }
  function beep(notes) {
    if (!soundOn) return;
    try {
      ctx();
      const t0 = actx.currentTime;
      notes.forEach(([freq, at, dur, type, vol]) => tone(freq, t0 + at, dur, type, vol || 0.05));
    } catch (e) { /* 오디오 미지원 */ }
  }
  // 두구두구 드럼롤 (1.5초 동안 점점 빠르고 크게)
  function drumroll() {
    if (!soundOn) return;
    try {
      ctx();
      const t0 = actx.currentTime;
      let t = 0;
      for (let i = 0; t < 1.45; i++) {
        noise(t0 + t, 0.06, 0.05 + t * 0.06, 900);
        tone(140 - i, t0 + t, 0.05, 'triangle', 0.05 + t * 0.03);
        t += Math.max(0.045, 0.11 - i * 0.004);
      }
    } catch (e) { /* 무시 */ }
  }
  function cymbal() {
    if (!soundOn) return;
    try { ctx(); noise(actx.currentTime, 0.8, 0.12, 5000); } catch (e) { /* 무시 */ }
  }

  // ---------- 배경음악 (직접 작곡한 8비트 루프) ----------
  const NOTE = (n) => {
    const m = /^([A-G])(#?)(\d)$/.exec(n);
    const idx = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0);
    return 440 * Math.pow(2, (idx + (+m[3] + 1) * 12 - 69) / 12);
  };
  const MELODY = (
    'E5 G5 C6 G5 A5 G5 E5 - F5 A5 C6 A5 G5 - E5 - D5 F5 A5 F5 G5 F5 D5 - E5 G5 C6 - B5 - G5 - ' +
    'E5 G5 C6 G5 A5 G5 E5 C5 F5 A5 C6 A5 D6 C6 A5 - G5 F5 E5 D5 C5 E5 G5 B5 C6 - G5 - C6 - - -'
  ).split(' ');
  const BASS = [['C3', 'G3'], ['F2', 'C3'], ['D3', 'A3'], ['G2', 'D3'], ['C3', 'G3'], ['F2', 'C3'], ['G2', 'D3'], ['C3', 'G3']];
  const STEP = 60 / 138 / 2;
  const bgm = { timer: null, step: 0, next: 0 };
  function scheduleBgm() {
    while (bgm.next < actx.currentTime + 0.3) {
      const i = bgm.step % MELODY.length;
      const n = MELODY[i];
      if (n !== '-') tone(NOTE(n), bgm.next, STEP * 0.9, 'square', 0.022);
      const k = i % 8;
      if (k % 2 === 0) tone(NOTE(BASS[Math.floor(i / 8)][k % 4 === 0 ? 0 : 1]), bgm.next, STEP * 1.7, 'triangle', 0.05);
      if (k === 2 || k === 6) noise(bgm.next, 0.03, 0.012, 7000);
      bgm.next += STEP;
      bgm.step++;
    }
  }
  function startBgm() {
    if (!soundOn || bgm.timer) return;
    try {
      ctx();
      bgm.next = actx.currentTime + 0.05;
      bgm.timer = setInterval(scheduleBgm, 60);
    } catch (e) { /* 무시 */ }
  }
  function stopBgm() { clearInterval(bgm.timer); bgm.timer = null; }
  // 브라우저 정책상 첫 터치 후에 음악 시작
  document.addEventListener('pointerdown', startBgm, { once: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopBgm(); else if (actx) startBgm(); });

  const SFX = {
    shake: drumroll,
    open: () => beep([[523, 0, 0.12, 'triangle', 0.08], [659, 0.08, 0.12, 'triangle', 0.08], [784, 0.16, 0.12, 'triangle', 0.08], [1047, 0.24, 0.12, 'triangle', 0.08], [1319, 0.32, 0.12, 'triangle', 0.08], [1568, 0.4, 0.4, 'triangle', 0.08]]),
    rare: () => beep([[1568, 0, 0.1, 'sine', 0.06], [2093, 0.1, 0.1, 'sine', 0.06], [2637, 0.2, 0.1, 'sine', 0.06], [2093, 0.3, 0.1, 'sine', 0.06], [2637, 0.4, 0.5, 'sine', 0.06]]),
    click: () => beep([[660, 0, 0.05]]),
  };
  function renderSound() {
    const b = $('#sound');
    b.setAttribute('aria-pressed', String(soundOn));
    b.innerHTML = `${soundOn ? '🔊' : '🔈'} 사운드 <b>${soundOn ? 'ON' : 'OFF'}</b>`;
  }

  // ---------- 픽셀 볼 ----------
  const BALL = [
    '.....KKKKKK.....',
    '...KKRRRRRRKK...',
    '..KRRRRRRRRRRK..',
    '.KRHHRRRRRRRRrK.',
    '.KRHRRRRRRRRRrK.',
    'KRRRRRRRRRRRRRrK',
    'KRRRRKKKKKKRRrrK',
    'KKKKKKWWWWKKKKKK',
    'KKKKKKWWgWKKKKKK',
    'KWWWWKKKKKKWWWgK',
    'KWWWWWWWWWWWWWgK',
    '.KWWWWWWWWWWWgK.',
    '.KWWWWWWWWWWggK.',
    '..KWWWWWWWWggK..',
    '...KKggggggKK...',
    '.....KKKKKK.....',
  ];
  const PX = { K: '#1a1a1a', R: '#e3242b', r: '#a8141a', H: '#ffffff', W: '#ffffff', g: '#c9c9c9' };
  function pixelSVG(rows, offset) {
    let s = `<svg viewBox="0 0 16 8" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">`;
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === '.') return;
      const btn = (y + offset === 7 || y + offset === 8) && x >= 6 && x <= 9 && ch !== 'K';
      s += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${PX[ch]}"${btn ? ' class="btn"' : ''}/>`;
    }));
    return s + '</svg>';
  }
  $('#ballTop').innerHTML = pixelSVG(BALL.slice(0, 8), 0);
  $('#ballBottom').innerHTML = pixelSVG(BALL.slice(8), 8);

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

  // img/peperos.png 안에서 각 제품 위치 [x, y, w, h] (id 기준)
  const SPRITE = {
    1: [128, 2, 42, 76], 2: [32, 6, 40, 66], 3: [232, 8, 32, 56], 4: [331, 5, 34, 67],
    5: [33, 110, 38, 61], 6: [128, 103, 48, 73], 7: [230, 104, 42, 73], 8: [335, 110, 28, 58],
    9: [32, 214, 34, 51], 10: [136, 214, 31, 53], 11: [229, 202, 43, 74], 12: [328, 204, 42, 73],
    13: [25, 311, 47, 66], 14: [129, 304, 55, 72], 15: [212, 304, 72, 73], 16: [332, 312, 29, 65],
    17: [27, 404, 45, 71], 18: [136, 412, 32, 52], 19: [232, 413, 32, 56], 20: [329, 408, 39, 64],
  };
  const spriteSVG = (id, x, y, w, h) => {
    const [sx, sy, sw, sh] = SPRITE[id];
    return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${sx} ${sy} ${sw} ${sh}" preserveAspectRatio="xMidYMid meet"><image href="img/peperos.png" width="399" height="501" style="mix-blend-mode:multiply"/></svg>`;
  };
  // 나무위키에서 받은 고화질 이미지가 있는 제품 (img/p/{id}.webp)
  // [원본 w, h, 여백 잘라낸 x, y, w, h]
  const HIRES = {
    1: [441, 706, 31, 34, 368, 649], 2: [720, 720, 189, 55, 339, 601], 3: [400, 400, 103, 34, 186, 325],
    5: [406, 600, 47, 68, 290, 495], 7: [370, 612, 0, 0, 370, 612], 9: [300, 300, 82, 32, 133, 236],
    11: [360, 360, 70, 0, 215, 360], 12: [1000, 1299, 0, 0, 1000, 1299], 13: [300, 300, 82, 32, 133, 236],
    14: [500, 500, 157, 113, 187, 274], 15: [294, 377, 0, 0, 294, 377], 16: [325, 600, 0, 0, 325, 600],
    17: [360, 360, 75, 1, 210, 359], 18: [300, 300, 82, 32, 133, 236], 19: [185, 175, 43, 0, 99, 174],
    20: [550, 550, 128, 12, 298, 529],
  };
  const productSVG = (id, x, y, w, h) => {
    const c = HIRES[id];
    if (!c) return spriteSVG(id, x, y, w, h);
    return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${c[2]} ${c[3]} ${c[4]} ${c[5]}" preserveAspectRatio="xMidYMid meet"><image href="img/p/${id}.webp" width="${c[0]}" height="${c[1]}" style="mix-blend-mode:multiply"/></svg>`;
  };
  Object.keys(HIRES).forEach((id) => { new Image().src = `img/p/${id}.webp`; }); // 미리 불러오기

  function artSVG(p) {
    const T = TYPES[p.type];
    const id = `a${p.id}`;
    let s = `<svg viewBox="0 0 300 230" xmlns="http://www.w3.org/2000/svg" aria-label="${p.name} 빼빼로 그림">`;
    s += `<defs><radialGradient id="${id}" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${T.l}"/><stop offset=".75" stop-color="${T.c}"/><stop offset="1" stop-color="${T.t2}"/></radialGradient>
      <clipPath id="${id}c"><rect width="300" height="230"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}c)"><rect width="300" height="230" fill="url(#${id})"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (Math.PI * 2 * i) / 18;
      s += `<path d="M150 115L${(150 + Math.cos(a - 0.06) * 280).toFixed(0)} ${(115 + Math.sin(a - 0.06) * 280).toFixed(0)}L${(150 + Math.cos(a + 0.06) * 280).toFixed(0)} ${(115 + Math.sin(a + 0.06) * 280).toFixed(0)}Z" fill="#fff" opacity=".22"/>`;
    }
    // 실제 제품 이미지 (흰 배경은 multiply로 투명하게)
    s += productSVG(p.id, 10, 4, 280, 222);
    const star = (x, y, k) => `<path d="M${x} ${y - k}Q${x} ${y} ${x + k} ${y}Q${x} ${y} ${x} ${y + k}Q${x} ${y} ${x - k} ${y}Q${x} ${y} ${x} ${y - k}Z" fill="#fff"/>`;
    s += star(34, 34, 9) + star(268, 190, 11) + star(262, 30, 6) + star(40, 196, 6);
    return s + '</g></svg>';
  }

  const energy = (T) => `<span class="en" style="background:${T.c}">${T.icon}</span>`;
  const cost = (n, T) => energy(T) + '<span class="en cl">★</span>'.repeat(Math.max(0, n - 1));

  // 칼로리·가격은 대략적인 추정치 (초콜릿 과자 약 5.1kcal/g, 아몬드류 5.4kcal/g)
  const PREMIUM = new Set([6, 15, 16, 17, 19]);
  function info(p) {
    const kcal = Math.round((p.g * (p.top === 'almond' ? 5.4 : 5.1)) / 5) * 5;
    const price = PREMIUM.has(p.id) ? 2000 : 1800;
    return [['🔥', '칼로리', `${kcal}kcal`], ['💰', '가격', `${price.toLocaleString('ko-KR')}원`], ['⚖️', '중량', `${p.g}g`]];
  }

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
      <div class="moves">${info(p).map(([icon, label, val]) => `
        <div class="move"><span class="cost"><span class="en cl">${icon}</span></span><b>${label}</b><span class="dmg">${label === '중량' ? '' : '<small>약 </small>'}${val}</span></div>`).join('')}
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
      el.style.cssText = `--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;--s:${3 + Math.floor(Math.random() * 3)}px;--c:${colors[i % colors.length]};--d:${(Math.random() * 0.4).toFixed(2)}s`;
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
      return `<div class="slot" style="--t1:${T.t1};--t2:${T.t2};${T.tx ? `--tx:${T.tx}` : ''}"><svg class="mini" viewBox="0 0 40 50">${productSVG(p.id, 0, 0, 40, 50)}</svg>${p.name}<span>${RAR[p.r].mark}</span></div>`;
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
    $('#title').textContent = '두구두구...';
    say(['두구두구두구...']);
    SFX.shake();
    setTimeout(() => {
      arena.classList.remove('shaking');
      arena.classList.add('opening');
      burst(p.r);
      cymbal();
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
      say([`${p.name} 빼빼로를`, '얻었다!'], () => setTimeout(showChoice, 350));
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
    say(['볼 안에 무언가 들어 있다...', '볼을 눌러서 열어 보자!']);
  }

  // ---------- 예 / 아니오 선택창 ----------
  const choice = $('#choice');
  const choiceOpen = () => !choice.classList.contains('hidden');
  function pickOpt(i) { choice.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i)); }
  function showChoice() { if (!arena.classList.contains('revealed')) return; pickOpt(0); choice.classList.remove('hidden'); SFX.click(); }
  function answer(yes) {
    choice.classList.add('hidden');
    SFX.click();
    if (yes) { reset(); setTimeout(open, 450); }
  }
  choice.querySelectorAll('button').forEach((b, i) => {
    b.addEventListener('pointerenter', () => pickOpt(i));
    b.addEventListener('click', () => answer(i === 0));
  });
  document.addEventListener('keydown', (e) => {
    if (!choiceOpen()) return;
    const cur = choice.querySelector('.on') === choice.querySelectorAll('button')[0] ? 0 : 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); pickOpt(1 - cur); SFX.click(); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); answer(cur === 0); }
  });
  // '아니오' 후 대화창을 누르면 다시 물어봄
  $('#dialog').addEventListener('click', () => { if (!choiceOpen() && !typing) showChoice(); });

  // 게임 대화창: 한 글자씩 타이핑
  let typing = null;
  function say(lines, done) {
    clearInterval(typing);
    const el = $('#dialogText');
    const text = lines.join('\n');
    let i = 0;
    el.textContent = '';
    $('#caret').classList.remove('show');
    typing = setInterval(() => {
      i++;
      el.textContent = text.slice(0, i);
      if (i % 3 === 0 && text[i - 1] !== ' ') beep([[1200, 0, 0.025, 'square', 0.02]]);
      if (i >= text.length) { clearInterval(typing); typing = null; $('#caret').classList.add('show'); if (done) done(); }
    }, 40);
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
  $('#dexBtn').addEventListener('click', () => {
    SFX.click();
    $('#dex').classList.toggle('hidden');
    if (!$('#dex').classList.contains('hidden')) $('#dex').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#sound').addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('pepero-sound', soundOn ? 'on' : 'off'); } catch (e) { /* 무시 */ }
    renderSound();
    if (soundOn) { startBgm(); SFX.click(); } else stopBgm();
  });

  // ?to=서아&from=베프 로 받는 사람 표시
  const q = new URLSearchParams(location.search);
  const to = (q.get('to') || '').slice(0, 20);
  const from = (q.get('from') || '').slice(0, 20);
  if (to) {
    $('#toLine').textContent = `To. ${to} — ${from ? `${from}의 ` : ''}빼빼로 카드팩이 도착했어요 🎁`;
    document.title = `${to}에게 온 빼빼로 카드팩`;
  }

  // ---------- 픽셀 숲길 배경 ----------
  function tileSVG(map, pal, w) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${map.length}" shape-rendering="crispEdges">`;
    map.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[ch]}"/>`; }));
    return `url("data:image/svg+xml,${encodeURIComponent(s + '</svg>')}")`;
  }
  const TREE = [
    '....KKKKKKKK....',
    '..KKGGGGGGGGKK..',
    '.KGGLLGGGGGGGGK.',
    '.KGLLGGGGGGDGGK.',
    'KGGLGGGGGGGDDGGK',
    'KGGGGGGDGGGGDGGK',
    'KGGGGGDDGGGGGGGK',
    'KGDGGGGGGGLGGDGK',
    'KGDDGGGGGLLGGDGK',
    '.KGGGGGGGGGGDDK.',
    '.KGGDGGGGGGGGGK.',
    '..KKGGGGGGGGKK..',
    '....KKKBBKKK....',
    '......KBBK......',
    '......KBBK......',
    '.....KKKKKK.....',
  ];
  const GRASS = [
    '................', '..v.v...........', '...v............', '................',
    '................', '..........v.v...', '...........v....', '................',
    '................', '....v.v.........', '.....v..........', '................',
    '.............v.v', '..............v.', '................', '................',
  ];
  const PATH = [
    'e..............................................................e',
    'e.......o......................o...............................e',
    'e....................o.......................o.................e',
    'e..........................................................o...e',
    'e...o..........o...............................o...............e',
    'e..................................o...........................e',
    'e........................o.....................................e',
    'e.............o......................................o.........e',
  ];
  const treeBand = TREE.map((r) => r + r);
  const bgTree = tileSVG(treeBand, { K: '#1f4a1f', G: '#4ea04a', L: '#8fd46c', D: '#2f7a2f', B: '#7a4f24', '.': '#a6d877' }, 32);
  const bgGrass = tileSVG(GRASS, { '.': '#a6d877', v: '#79b955' }, 16);
  const bgPath = tileSVG(PATH, { '.': '#efdfaa', o: '#d6bf7f', e: '#c9ae6a' }, 64);
  document.body.style.background = `${bgPath} center top / 200px 25px repeat-y, ${bgTree} left top / 80px 40px repeat-y, ${bgTree} right top / 80px 40px repeat-y, ${bgGrass} 0 0 / 40px 40px, #a6d877`;

  renderSound();
  renderDex();
  say(['볼 안에 무언가 들어 있다...', '볼을 눌러서 열어 보자!']);
})();
