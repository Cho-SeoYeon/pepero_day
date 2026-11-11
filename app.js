(() => {
  'use strict';

  // ---------- 재료 ----------
  const COATS = [
    { n: '딸기', f: '#e8628f', s: '#7f3550', d: '상큼한 딸기 초콜릿' },
    { n: '밀크초코', f: '#8b5232', s: '#4a271f', d: '부드러운 밀크 초콜릿' },
    { n: '화이트', f: '#fbf3dc', s: '#9c8a60', d: '달콤한 화이트 초콜릿' },
    { n: '다크', f: '#3a2219', s: '#1a0e09', d: '카카오 70% 다크 초콜릿' },
    { n: '말차', f: '#5f8f3e', s: '#465b30', d: '쌉싸름한 제주 말차 초콜릿' },
    { n: '블루베리', f: '#8481c0', s: '#45428a', d: '새콤한 블루베리 초콜릿' },
  ];
  const TOPS = [
    { n: '없음', e: '🍫', w: '클래식', d: '' },
    { n: '하트', e: '💗', w: '러블리 하트', d: '하트를 콕콕' },
    { n: '별', e: '⭐', w: '반짝 스타', d: '별 사탕을 반짝반짝' },
    { n: '스프링클', e: '🎉', w: '파티 스프링클', d: '알록달록 스프링클을 듬뿍' },
    { n: '꽃', e: '🌸', w: '플라워 로맨스', d: '예쁜 핑크 꽃 장식' },
    { n: '진주', e: '🫧', w: '펄 드림', d: '진주 펄을 송송' },
  ];
  const DRIZ = [
    { n: '없음', c: null },
    { n: '화이트', c: '#fff6e6' },
    { n: '핑크', c: '#f4a6bd' },
    { n: '초코', c: '#4a2b24' },
    { n: '민트', c: '#3fb6cf' },
  ];
  const SPRINKLE = ['#e05a7a', '#3fb6cf', '#f2c94c', '#7fc77a', '#ffffff'];
  const DEFAULT = {
    to: '', from: '', msg: '',
    s: [[0, 1, 1], [1, 3, 0], [2, 3, 4], [3, 4, 2], [4, 5, 1]], // [코팅, 토핑, 드리즐]
  };

  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- 링크 인코딩 (UTF-8 안전 base64url) ----------
  const enc = (o) => {
    const bytes = new TextEncoder().encode(JSON.stringify(o));
    let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const dec = (str) => {
    const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
  };
  const clampInt = (v, max) => Math.min(max, Math.max(0, parseInt(v, 10) || 0));
  const sanitize = (d) => ({
    to: String(d.to || '').slice(0, 20),
    from: String(d.from || '').slice(0, 20),
    msg: String(d.msg || '').slice(0, 300),
    s: (Array.isArray(d.s) ? d.s : DEFAULT.s).slice(0, 5).map((x) => [
      clampInt(x && x[0], COATS.length - 1),
      clampInt(x && x[1], TOPS.length - 1),
      clampInt(x && x[2], DRIZ.length - 1),
    ]),
  });

  // ---------- 사운드 (WebAudio 짧은 효과음) ----------
  let soundOn = true;
  try { soundOn = localStorage.getItem('pepero-sound') !== 'off'; } catch (e) { /* 무시 */ }
  let actx;
  function beep(notes) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime;
      notes.forEach(([freq, at, dur, type]) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = type || 'square';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.06, t0 + at);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + at + dur);
        o.connect(g).connect(actx.destination);
        o.start(t0 + at);
        o.stop(t0 + at + dur + 0.02);
      });
    } catch (e) { /* 오디오 미지원 */ }
  }
  const SFX = {
    tap: () => beep([[880, 0, 0.07], [1320, 0.05, 0.08]]),
    pick: () => beep([[660, 0, 0.06]]),
    open: () => beep([[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.25]]),
    letter: () => beep([[784, 0, 0.12, 'triangle'], [1175, 0.12, 0.3, 'triangle']]),
  };
  function renderSound() {
    const b = $('#sound');
    b.setAttribute('aria-pressed', String(soundOn));
    b.innerHTML = `${soundOn ? '🔊' : '🔈'} 사운드 <b>${soundOn ? 'ON' : 'OFF'}</b>`;
  }

  // ---------- 그림 ----------
  const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function topping(type, x, y, r) {
    switch (type) {
      case 1: // 하트
        return `<path d="M${x} ${y + 2.8}C${x - 4.8} ${y - 0.8},${x - 2.8} ${y - 5.6},${x} ${y - 2.4}C${x + 2.8} ${y - 5.6},${x + 4.8} ${y - 0.8},${x} ${y + 2.8}Z" fill="#c8285a" stroke="#2b2118" stroke-width=".7"/>`;
      case 2: { // 별
        const p = [];
        for (let i = 0; i < 10; i++) {
          const a = (Math.PI / 5) * i - Math.PI / 2;
          const rad = i % 2 ? 1.5 : 3.6;
          p.push(`${(x + rad * Math.cos(a)).toFixed(1)},${(y + rad * Math.sin(a)).toFixed(1)}`);
        }
        return `<polygon points="${p.join(' ')}" fill="#f6c430" stroke="#2b2118" stroke-width=".6"/>`;
      }
      case 3: // 스프링클
        return `<rect x="${x - 0.9}" y="${y - 2.8}" width="1.8" height="5.6" rx=".9" fill="${SPRINKLE[Math.floor(r() * SPRINKLE.length)]}" transform="rotate(${Math.floor(r() * 180)} ${x} ${y})"/>`;
      case 4: { // 꽃
        let s = '';
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 / 5) * i;
          s += `<circle cx="${(x + 1.9 * Math.cos(a)).toFixed(1)}" cy="${(y + 1.9 * Math.sin(a)).toFixed(1)}" r="1.5" fill="#ff8fb3"/>`;
        }
        return s + `<circle cx="${x}" cy="${y}" r="1.1" fill="#f6c430"/>`;
      }
      case 5: // 진주
        return `<circle cx="${x}" cy="${y}" r="${(1.6 + r() * 0.8).toFixed(1)}" fill="#fff8e1" stroke="#b89a4d" stroke-width=".5"/>`;
      default:
        return '';
    }
  }

  // 위쪽 = 초콜릿 코팅, 아래쪽 = 과자 손잡이
  function stickSVG([c, t, d], i) {
    const C = COATS[c];
    const r = rng(i * 97 + c * 13 + t * 7 + d + 11);
    let s = `<svg class="stick" viewBox="0 0 28 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
    s += '<rect x="8.5" y="96" width="11" height="111" rx="2" fill="#dfa863" stroke="#2b2118" stroke-width="2.2"/>';
    s += '<path d="M11 122h6M11 146h6M11 170h6M11 194h6" stroke="#b98443" stroke-width="1.4" stroke-linecap="round"/>';
    s += `<path d="M5 14a9 9 0 0 1 18 0V104q-4.5 6 -9 0q-4.5 6 -9 0Z" fill="${C.f}" stroke="#2b2118" stroke-width="2.2" stroke-linejoin="round"/>`;
    if (DRIZ[d].c) {
      const pts = [];
      for (let y = 14, k = 0; y <= 100; y += 14, k++) pts.push(`${k % 2 ? 19 : 9},${y}`);
      s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${DRIZ[d].c}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    if (t) {
      const n = t === 3 ? 12 : 5;
      for (let k = 0; k < n; k++) {
        const y = 16 + ((k + r() * 0.8) / n) * 82;
        const x = 9.5 + r() * 9;
        s += topping(t, +x.toFixed(1), +y.toFixed(1), r);
      }
    }
    s += '<rect x="8" y="10" width="2.4" height="34" rx="1.2" fill="#fff" opacity=".35"/>';
    return s + '</svg>';
  }

  function stickInfo([c, t, d]) {
    const C = COATS[c], T = TOPS[t], D = DRIZ[d];
    const title = `${T.e} ${C.n} ${T.w} 빼빼로`;
    let desc = T.d ? `${C.d} 위에 ${T.d}` : `${C.d} 그대로, 깔끔한 맛`;
    if (D.c) desc += ` + ${D.n} 드리즐`;
    return { title, desc: desc + '!' };
  }

  function stampSVG() {
    const W = 64, H = 54, step = 4;
    const pts = [];
    for (let x = 2; x <= W - 2; x += step) pts.push(`${x},${(x / step) % 2 ? 0 : 3}`);
    for (let y = 2; y <= H - 2; y += step) pts.push(`${(y / step) % 2 ? W : W - 3},${y}`);
    for (let x = W - 2; x >= 2; x -= step) pts.push(`${x},${(x / step) % 2 ? H : H - 3}`);
    for (let y = H - 2; y >= 2; y -= step) pts.push(`${(y / step) % 2 ? 0 : 3},${y}`);
    return `<svg viewBox="-2 -2 ${W + 4} ${H + 4}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${pts.join(' ')}" fill="#fff" stroke="#1e1b1b" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="10" y="9" width="44" height="36" fill="none" stroke="#1e1b1b" stroke-width="1.8"/>
      <rect x="18" y="17" width="28" height="20" fill="#fff" stroke="#1e1b1b" stroke-width="1.8"/>
      <path d="M18 17L32 29L46 17M18 37L28 27M46 37L36 27" fill="none" stroke="#1e1b1b" stroke-width="1.6"/>
    </svg>`;
  }

  function doodleSVG(sticks) {
    let s = '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    sticks.forEach(([c], i) => {
      const x = 30 + i * 30;
      const rot = -6 + i * 3;
      s += `<g transform="rotate(${rot} ${x + 6} 40)">
        <rect x="${x}" y="2" width="12" height="52" rx="3" fill="${COATS[c].f}" stroke="${COATS[c].s}" stroke-width="1"/>
        <rect x="${x + 1}" y="54" width="10" height="20" rx="2" fill="#f5c84c"/></g>`;
    });
    const star = (x, y) => `<path d="M${x} ${y - 6}L${x + 1.6} ${y - 1.6}L${x + 6} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 6}L${x - 1.6} ${y + 1.6}L${x - 6} ${y}L${x - 1.6} ${y - 1.6}Z" fill="#f5b53c"/>`;
    s += star(16, 62) + star(184, 58);
    s += '<path d="M184 24C178 18 180 12 185 14C186 10 193 11 191 18C190 22 186 24 184 24Z" fill="#e5383b"/>';
    return s + '</svg>';
  }

  function sticksHTML(list, sel) {
    return list.map((st, i) =>
      `<button class="stick-btn ${i === sel ? 'on' : ''}" style="--i:${i}" data-i="${i}" type="button" aria-label="${i + 1}번 빼빼로">${stickSVG(st, i + 1)}</button>`
    ).join('');
  }
  function setInfo(el, title, desc) {
    el.innerHTML = `<strong>${esc(title)}</strong><span>${esc(desc)}</span>`;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  // ---------- 공통 ----------
  let toastTimer;
  function toast(text) {
    const el = $('#toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- 만들기 ----------
  const STORE_KEY = 'pepero-draft-v2';
  let state;
  try { state = sanitize(JSON.parse(localStorage.getItem(STORE_KEY)) || DEFAULT); } catch (e) { state = sanitize(DEFAULT); }
  let sel = 0;
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 무시 */ } };

  function renderMaker() {
    $('#mTray').innerHTML = sticksHTML(state.s, sel);
    const [c, t, d] = state.s[sel];
    const info = stickInfo(state.s[sel]);
    setInfo($('#mInfo'), info.title, info.desc);
    $('#selLabel').textContent = `${sel + 1}번 빼빼로 꾸미기`;
    $('#coatSw').innerHTML = COATS.map((x, i) =>
      `<button class="sw ${i === c ? 'on' : ''}" data-k="0" data-v="${i}" style="background:${x.f}" title="${x.n}" aria-label="${x.n}" type="button"></button>`).join('');
    $('#topCh').innerHTML = TOPS.map((x, i) =>
      `<button class="chip ${i === t ? 'on' : ''}" data-k="1" data-v="${i}" type="button">${x.n}</button>`).join('');
    $('#drzSw').innerHTML = DRIZ.map((x, i) =>
      `<button class="sw ${x.c ? '' : 'none'} ${i === d ? 'on' : ''}" data-k="2" data-v="${i}" style="background:${x.c || '#fff'}" title="${x.n}" aria-label="드리즐 ${x.n}" type="button"></button>`).join('');
  }

  function initMaker() {
    $('#to').value = state.to;
    $('#from').value = state.from;
    $('#msg').value = state.msg;
    $('#msgCount').textContent = state.msg.length;
    renderMaker();

    $('#mTray').addEventListener('click', (e) => {
      const b = e.target.closest('.stick-btn');
      if (!b) return;
      sel = +b.dataset.i;
      SFX.tap();
      renderMaker();
    });
    $('#controls').addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      state.s[sel][+b.dataset.k] = +b.dataset.v;
      SFX.pick();
      renderMaker(); save();
    });
    $('#random').addEventListener('click', () => {
      state.s = state.s.map(() => [
        Math.floor(Math.random() * COATS.length),
        1 + Math.floor(Math.random() * (TOPS.length - 1)),
        Math.floor(Math.random() * DRIZ.length),
      ]);
      SFX.open();
      renderMaker(); save();
    });
    ['to', 'from', 'msg'].forEach((k) => {
      $('#' + k).addEventListener('input', (e) => {
        state[k] = e.target.value;
        if (k === 'msg') $('#msgCount').textContent = state.msg.length;
        $('#result').classList.add('hidden');
        save();
      });
    });

    $('#make').addEventListener('click', () => {
      if (!state.to.trim()) { $('#to').focus(); toast('받는 사람 이름을 적어주세요'); return; }
      if (!state.msg.trim()) { $('#msg').focus(); toast('편지를 한 줄이라도 적어주세요'); return; }
      SFX.letter();
      $('#link').value = location.href.split('#')[0] + '#g=' + enc(state);
      $('#result').classList.remove('hidden');
      $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    $('#copy').addEventListener('click', async () => {
      const url = $('#link').value;
      try { await navigator.clipboard.writeText(url); }
      catch (e) { $('#link').select(); document.execCommand('copy'); }
      toast('링크를 복사했어요 💝');
    });
    $('#share').addEventListener('click', async () => {
      const url = $('#link').value;
      if (navigator.share) {
        try { await navigator.share({ title: '초콜릿 선물이 도착했어요 🎁', text: `${state.to}에게 빼빼로 선물이 왔어요!`, url }); } catch (e) { /* 취소 */ }
      } else {
        $('#copy').click();
      }
    });
    $('#preview').addEventListener('click', () => window.open($('#link').value, '_blank'));
  }

  // ---------- 받는 화면 ----------
  let gift = null;
  let vSel = -1;
  function renderViewerTray() { $('#vTray').innerHTML = sticksHTML(gift.s, vSel); }

  function showViewer(data) {
    gift = data;
    vSel = -1;
    $('#gift').classList.remove('open');
    $('#openLetter').classList.remove('show');
    renderViewerTray();
    $('#lidName').textContent = data.to ? `To. ${data.to}` : 'Yours';
    setInfo($('#vInfo'), '🎁 선물 상자가 도착했어요', '리본 상자를 톡 눌러서 열어보세요.');
    $('#lTo').textContent = data.to;
    $('#lMsg').textContent = data.msg;
    $('#lFrom').textContent = data.from;
    $('#doodle').innerHTML = doodleSVG(data.s.slice(0, 4));
    $('#stamp').innerHTML = stampSVG();
    document.title = `${data.to}에게 온 빼빼로 선물`;
  }

  function initViewer() {
    $('#lid').addEventListener('click', () => {
      const g = $('#gift');
      if (g.classList.contains('open')) return;
      g.classList.add('open');
      SFX.open();
      setInfo($('#vInfo'), `🍫 빼빼로 ${gift.s.length}개가 들어있어요`, '하나씩 눌러서 어떤 맛인지 확인해보세요!');
      setTimeout(() => $('#openLetter').classList.add('show'), 1400);
    });
    $('#vTray').addEventListener('click', (e) => {
      const b = e.target.closest('.stick-btn');
      if (!b || !$('#gift').classList.contains('open')) return;
      vSel = +b.dataset.i;
      SFX.tap();
      $('#vTray').querySelectorAll('.stick-btn').forEach((x, i) => x.classList.toggle('on', i === vSel));
      const info = stickInfo(gift.s[vSel]);
      setInfo($('#vInfo'), info.title, info.desc);
    });

    const overlay = $('#overlay');
    const close = () => { overlay.classList.remove('show'); overlay.setAttribute('aria-hidden', 'true'); };
    $('#openLetter').addEventListener('click', () => {
      SFX.letter();
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
    });
    $('#closeLetter').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // ---------- 라우팅 ----------
  function route() {
    const m = location.hash.match(/^#g=([\w-]+)$/);
    let data = null;
    if (m) { try { data = sanitize(dec(m[1])); } catch (e) { console.warn('잘못된 선물 링크', e); } }
    $('#maker').classList.toggle('hidden', !!data);
    $('#viewer').classList.toggle('hidden', !data);
    $('#overlay').classList.remove('show');
    if (data) showViewer(data);
    else document.title = '빼빼로 선물 만들기';
    window.scrollTo(0, 0);
  }

  $('#sound').addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('pepero-sound', soundOn ? 'on' : 'off'); } catch (e) { /* 무시 */ }
    renderSound();
    SFX.pick();
  });
  renderSound();
  initMaker();
  initViewer();
  route();
  window.addEventListener('hashchange', route);
})();
