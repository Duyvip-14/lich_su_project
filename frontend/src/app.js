import { periods, events, people, formatYear, search } from './data.js';
import { art } from './art.js';
import { read, write } from './storage.js';

const main = document.querySelector('main');
const state = { period: null, group: null, event: null, saved: read('saved', []), savedOnly: false };
if (!Array.isArray(state.saved)) state.saved = [];
let homeScroll = 0;
let scrollTimer;
let restoring = false;
let disposeDrum = () => {};
let drumGeneration = 0;
const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const bookmark = e => `<button class="bookmark ${state.saved.includes(e.id) ? 'is-saved' : ''}" data-save="${e.id}" aria-label="${state.saved.includes(e.id) ? 'Bỏ kẹp sách' : 'Kẹp sách'}: ${escape(e.title)}" aria-pressed="${state.saved.includes(e.id)}"><svg width="18" height="23" viewBox="0 0 18 23" aria-hidden="true"><path d="M3 2h12v18l-6-4-6 4z" fill="${state.saved.includes(e.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></button>`;
function toast(message) { const el = document.querySelector('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3200); }
function updateCount() { document.querySelector('#saved-count').textContent = state.saved.length; }
function eventCard(e) {
  const open = state.event === e.id;
  return `<article class="event ${e.major ? 'major' : 'minor'}" id="event-${e.id}"><span class="event-year">${escape(e.date || formatYear(e.year))}</span><div class="event-content">${e.major ? `<div class="event-art">${art(e.art)}</div>` : ''}<div class="event-copy"><div class="event-top"><span class="eyebrow">${e.major ? 'DẤU MỐC NỔI BẬT' : 'DẤU MỐC LỊCH SỬ'}</span>${bookmark(e)}</div><button class="event-title" data-event="${e.id}" aria-expanded="${open}" aria-controls="summary-${e.id}"><h4>${e.title}</h4><span aria-hidden="true">${open ? '−' : '+'}</span></button>${e.major || open ? `<p>${e.summary}</p>` : ''}<div id="summary-${e.id}" ${open ? '' : 'hidden'}><p class="metadata">${e.location || 'Việt Nam'}</p><a class="text-link" href="#/event/${e.id}">Xem chi tiết <span aria-hidden="true">↗</span></a></div>${!open && e.major ? `<button class="text-link" data-event="${e.id}">Đọc sơ lược <span aria-hidden="true">↓</span></button>` : ''}</div></div></article>`;
}
function periodMarkup(p) {
  const open = p.id === state.period;
  return `<section class="period ${open ? 'is-open' : ''}" id="period-${p.id}"><button class="period-toggle" data-period="${p.id}" aria-expanded="${open}" aria-controls="content-${p.id}"><span class="period-number">${p.number}</span><span class="period-info"><span class="eyebrow">${p.range}</span><h3>${p.title}</h3><span class="period-intro">${p.intro}</span></span><span class="period-thumbnail">${art(p.art)}</span><span class="period-arrow" aria-hidden="true">${open ? '−' : '+'}</span></button><div id="content-${p.id}" ${open ? '' : 'hidden'}>${p.groups.map(g => {
    const active = state.group === g.id;
    const items = events.filter(e => e.group === g.id);
    return `<section class="dynasty" id="group-${g.id}"><button class="dynasty-toggle" data-group="${g.id}" aria-expanded="${active}" aria-controls="events-${g.id}"><span><strong>${g.name}</strong><small>${g.range}</small></span><span>${items.length} dấu mốc <b aria-hidden="true">${active ? '−' : '+'}</b></span></button><div id="events-${g.id}" ${active ? '' : 'hidden'} class="event-list">${items.map(eventCard).join('')}</div></section>`;
  }).join('')}</div></section>`;
}
function hero() {
  return `<section class="hero"><div class="hero-art" aria-hidden="true">${art('citadel')}<div class="hero-overlay"></div></div><div class="hero-content"><span class="eyebrow"><span class="little-star">✺</span> MỘT DÒNG CHẢY · NGÀN CÂU CHUYỆN</span><h1>Theo dấu ngàn năm.<br><em>Hiểu thêm Việt Nam.</em></h1><p>Đi qua những thời kỳ, gặp những con người.<br>Khám phá lịch sử từ những điều khiến bạn tò mò.</p><a class="button" href="#timeline">Bắt đầu hành trình <span aria-hidden="true">↓</span></a><span class="hero-caption">DỰNG NƯỚC · GIỮ NƯỚC · DỰNG XÂY TƯƠNG LAI</span></div><span class="art-credit">TRANH MINH HỌA · CẢM HỨNG DI SẢN VIỆT</span></section>`;
}
function home() {
  const resume = read('position', null);
  return `${hero()}<section class="explore" id="timeline"><div class="section-heading"><div><span class="eyebrow">LỊCH SỬ KHÔNG CHỈ LÀ NHỮNG CON SỐ</span><h2>Một dòng chảy. Bốn chặng đường.</h2></div><span class="section-note">Cuộn để khám phá <span aria-hidden="true">↓</span></span></div><div class="explore-layout"><aside class="timeline-aside"><span class="eyebrow">BẠN ĐANG KHÁM PHÁ</span><nav aria-label="Các thời kỳ">${periods.map(p => `<button data-jump="${p.id}" class="${state.period === p.id ? 'active' : ''}"><span>${p.number}</span>${p.title}</button>`).join('')}</nav><div class="aside-note"><span aria-hidden="true">✺</span><p>Lịch sử nối tiếp.<br>Khám phá theo cách của bạn.</p></div><p class="small-note">Khoảng cách các mốc được bố trí theo nội dung, không theo tỷ lệ thời gian.</p></aside><div class="timeline-main"><form class="search-form" role="search"><span aria-hidden="true">⌕</span><label class="sr-only" for="search">Tìm sự kiện, nhân vật hoặc năm</label><input id="search" type="search" placeholder="Bạn muốn tìm sự kiện, nhân vật hay năm nào?" autocomplete="off"><kbd aria-hidden="true">↵</kbd></form><div id="search-results" aria-live="polite"></div>${resume ? `<div class="resume"><span>↳ Hành trình của bạn vẫn ở đây</span><button class="text-link" id="resume">Tiếp tục từ vị trí đã xem →</button></div>` : ''}<p class="data-note">Nội dung chọn lọc cho bản trải nghiệm · Các dấu mốc đang được bổ sung dần</p><div id="periods">${periods.map(periodMarkup).join('')}</div><p class="timeline-end">✺<br>Lịch sử vẫn đang được viết tiếp.</p></div></div></section><section class="artifact"><div class="artifact-copy"><span class="eyebrow">CHẠM VÀO DI SẢN</span><h2>Một mặt trống.<br>Cả một nền văn hóa.</h2><p>Thử xoay mô phỏng trống đồng lấy cảm hứng từ hoa văn Đông Sơn. Một góc nhìn khác về dấu ấn của người Việt cổ.</p><p class="small-note">Mô hình cách điệu để trải nghiệm tương tác, không phải bản số hóa hiện vật khảo cổ.</p></div><div class="drum-area"><div class="drum-control" role="slider" tabindex="0" aria-label="Xoay mô phỏng trống đồng" aria-valuemin="0" aria-valuemax="360" aria-valuenow="0" aria-valuetext="0 độ"><div class="drum"><div class="drum-side"></div><div class="drum-top"><div class="drum-ring"><span>✺</span></div></div></div></div><span class="drum-hint">↔ Kéo để xoay · Phím ← → khi chọn mô hình</span><button class="button-quiet" id="spin-drum" type="button" hidden>Tiếp tục xoay</button><button class="button-quiet" id="reset-drum">Đặt lại góc nhìn ↺</button></div></section>`;
}
function detail(id, kind) {
  const item = (kind === 'event' ? events : people).find(e => e.id === id);
  if (!item) return `<section class="empty"><h1>Chưa tìm thấy nội dung này</h1><a class="button" href="#/">Về dòng thời gian</a></section>`;
  const isEvent = kind === 'event';
  const group = isEvent && periods.flatMap(p => p.groups).find(g => g.id === item.group);
  const related = isEvent ? people.filter(p => item.people.includes(p.id)) : events.filter(e => e.people.includes(item.id));
  return `<article class="article"><a href="#/" class="text-link back-home">← Trở về dòng thời gian</a><div class="article-heading"><span class="eyebrow">${isEvent ? `${escape(group.name)} · ${escape(item.date || formatYear(item.year))}` : 'NHÂN VẬT LỊCH SỬ'}</span><h1>${escape(isEvent ? item.title : item.name)}</h1><div class="article-meta"><span>${escape(isEvent ? item.location || 'Việt Nam' : item.years)}</span>${isEvent ? bookmark(item) : ''}</div><p class="article-lead">${item.summary}</p></div>${art(isEvent ? item.art : 'citadel', 'article-image')}<p class="image-caption">Tranh minh họa cách điệu, không phải tư liệu hình ảnh của sự kiện.</p><div class="article-body">${isEvent ? ['Bối cảnh', 'Diễn biến', 'Ý nghĩa'].map((label, index) => `<section><span class="eyebrow">0${index + 1}</span><h2>${label}</h2><p>${[item.context, item.development, item.meaning][index] || 'Phần nội dung này đang được biên soạn và đối chiếu nguồn. Bạn có thể xem tóm tắt phía trên và tài liệu tham khảo ở cuối bài.'}</p></section>`).join('') : `<section><h2>Về nhân vật</h2><p>${item.summary}</p>${item.alias ? `<p>Tên gọi khác: ${item.alias}.</p>` : ''}</section>`}${item.note ? `<details class="source-note"><summary>Chú thích về niên đại và cách trình bày</summary><p>${item.note}</p></details>` : ''}<section class="related"><span class="eyebrow">NHỮNG MỐI NỐI LỊCH SỬ</span><h2>${isEvent ? 'Nhân vật liên quan' : 'Dấu chân trong lịch sử'}</h2>${related.length ? related.slice(0, 3).map(r => `<a class="related-row" href="#/${isEvent ? 'person' : 'event'}/${r.id}"><span>${isEvent ? r.years : formatYear(r.year)}</span><strong>${isEvent ? r.name : r.title}</strong><span aria-hidden="true">↗</span></a>`).join('') : '<p>Thông tin liên quan đang được bổ sung.</p>'}${related.length > 3 ? `<details><summary>Xem tất cả sự kiện liên quan</summary>${related.slice(3).map(r => `<a class="related-row" href="#/event/${r.id}">${formatYear(r.year)} · ${r.title} ↗</a>`).join('')}</details>` : ''}</section><section class="sources"><h2>Nguồn tham khảo</h2><ol>${(isEvent ? item.sources : [item.source]).map(s => `<li>${s}</li>`).join('')}</ol><p class="small-note">Bản nội dung chọn lọc. Chú thích đối chiếu giữa các nguồn sẽ được bổ sung trong quá trình biên tập.</p></section></div></article>`;
}
function collection(saved) {
  return `<section class="collection"><span class="eyebrow">${saved ? 'HÀNH TRÌNH CỦA RIÊNG BẠN' : 'GẶP NHỮNG CON NGƯỜI LÀM NÊN LỊCH SỬ'}</span><h1>${saved ? 'Những trang đã kẹp' : 'Nhân vật lịch sử'}</h1><p>${saved ? 'Lưu một dấu mốc hôm nay, trở lại với câu chuyện vào ngày mai. Kẹp sách được lưu trên thiết bị này.' : 'Từ mỗi cuộc đời, mở ra những mối nối với dòng chảy lịch sử.'}</p>${saved ? (state.saved.length ? `<div class="saved-list">${events.filter(e => state.saved.includes(e.id)).map(e => `<div class="saved-item">${art(e.art)}<div><span class="eyebrow">${formatYear(e.year)}</span><h2><a href="#/event/${e.id}">${e.title}</a></h2><p>${e.summary}</p></div>${bookmark(e)}</div>`).join('')}</div>` : '<div class="empty"><span aria-hidden="true">♧</span><h2>Chưa có sự kiện được kẹp sách</h2><p>Chọn biểu tượng kẹp sách bên cạnh sự kiện để lưu lại.</p><a class="button" href="#/">Khám phá dòng thời gian →</a></div>') : `<div class="people-grid">${people.map((p, i) => `<a href="#/person/${p.id}" class="person-card"><span class="person-monogram">${['陳', '吳', '✺', '★'][i]}</span><span class="eyebrow">${p.years}</span><h2>${p.name}</h2><p>${p.summary}</p><span class="text-link">Tìm hiểu nhân vật ↗</span></a>`).join('')}</div>`}</section>`;
}
function render({ focus = false } = {}) {
  disposeDrum();
  const route = location.hash.slice(1) || '/';
  const parts = route.split('/');
  const y = window.scrollY;
  main.innerHTML = parts[1] === 'event' || parts[1] === 'person' ? detail(parts[2], parts[1]) : parts[1] === 'people' ? collection(false) : parts[1] === 'saved' ? collection(true) : home();
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === (parts[1] === 'people' ? 'people' : parts[1] === 'saved' ? 'saved' : 'home')));
  document.title = `${parts[1] === 'event' ? events.find(e => e.id === parts[2])?.title || 'Sự kiện' : parts[1] === 'person' ? people.find(p => p.id === parts[2])?.name || 'Nhân vật' : parts[1] === 'saved' ? 'Kẹp sách' : 'Theo dấu ngàn năm'} · Dòng Sử Việt`;
  updateCount(); bindSearch(); bindDrum();
  if (focus) { main.focus({ preventScroll: true }); window.scrollTo(0, route === '/' ? homeScroll : 0); } else window.scrollTo(0, y);
}
function bindSearch() {
  const input = document.querySelector('#search');
  if (!input) return;
  const showResults = () => {
    const results = search(input.value);
    document.querySelector('#search-results').innerHTML = !input.value.trim() ? '' : `<div class="results"><span class="eyebrow">${results.length} KẾT QUẢ</span>${results.length ? results.map(r => `<a href="#/${r.kind}/${r.id}"><span class="result-kind">${r.kind === 'event' ? 'Sự kiện' : 'Nhân vật'}</span><span><strong>${escape(r.label)}</strong><small>${escape(r.meta)}</small></span><span aria-hidden="true">↗</span></a>`).join('') : '<p>Chưa có kết quả. Thử “Bạch Đằng”, “Trần Hưng Đạo” hoặc “1945”.</p>'}</div>`;
  };
  input.addEventListener('input', showResults);
  input.closest('form').addEventListener('submit', e => { e.preventDefault(); showResults(); document.querySelector('.results a')?.focus(); });
}
function bindCSSDrum() {
  const control = document.querySelector('.drum-control');
  if (!control) return;
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let angle = 0, start = null;
  const setAngle = value => { angle = (value % 360 + 360) % 360; control.style.setProperty('--rotation', `${angle}deg`); control.setAttribute('aria-valuenow', Math.round(angle)); control.setAttribute('aria-valuetext', `${Math.round(angle)} độ`); };
  control.addEventListener('pointerdown', e => { start = e.clientX; control.setPointerCapture(e.pointerId); }, options);
  control.addEventListener('pointermove', e => { if (start === null) return; setAngle(angle + (e.clientX - start)); start = e.clientX; }, options);
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) control.addEventListener(type, () => { start = null; }, options);
  control.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); setAngle(e.key === 'Home' || e.key === 'End' ? 0 : angle + (e.key === 'ArrowRight' ? 10 : -10)); } }, options);
  document.querySelector('#reset-drum').addEventListener('click', () => setAngle(0), options);
  return () => abort.abort();
}

function bindDrum() {
  const area = document.querySelector('.drum-area');
  const generation = ++drumGeneration;
  if (!area) { disposeDrum = () => { drumGeneration++; }; return; }
  let active = true;
  let cleanup = bindCSSDrum();
  const fallback = () => {
    if (!active || !area.isConnected) return;
    const host = area.querySelector('.drum-control');
    host.setAttribute('role', 'slider'); host.tabIndex = 0;
    host.setAttribute('aria-valuemin', '0'); host.setAttribute('aria-valuemax', '360');
    host.setAttribute('aria-valuenow', '0'); host.setAttribute('aria-valuetext', '0 độ');
    cleanup = bindCSSDrum();
  };
  disposeDrum = () => { active = false; drumGeneration++; cleanup?.(); };
  import('../dist/drum.js').then(({ mountDrum }) => {
    if (!active || generation !== drumGeneration || !area.isConnected) return;
    cleanup?.();
    const host = area.querySelector('.drum-control');
    host.removeAttribute('role'); host.removeAttribute('tabindex');
    for (const name of ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext']) host.removeAttribute(name);
    try { cleanup = mountDrum(area, fallback); }
    catch { fallback(); }
  }).catch(() => { /* CSS controls remain usable if the bundle cannot load. */ });
}

document.addEventListener('click', e => {
  const target = e.target.closest('button, a'); if (!target) return;
  if (target.dataset.save) {
    const id = target.dataset.save;
    const next = state.saved.includes(id) ? state.saved.filter(x => x !== id) : [...state.saved, id];
    if (!write('saved', next)) { toast('Không thể lưu kẹp sách. Hãy kiểm tra quyền lưu trữ của trình duyệt.'); return; }
    state.saved = next; const added = next.includes(id); render();
    document.querySelector(`[data-save="${id}"]`)?.focus({ preventScroll: true }); toast(added ? 'Đã kẹp sách trên thiết bị này' : 'Đã bỏ kẹp sách');
  }
  if (target.dataset.period) {
    state.period = state.period === target.dataset.period ? null : target.dataset.period; state.group = null; state.event = null; render();
    document.querySelector(`[data-period="${target.dataset.period}"]`)?.focus({ preventScroll: true });
  }
  if (target.dataset.group) {
    state.group = state.group === target.dataset.group ? null : target.dataset.group; state.event = null; render(); document.querySelector(`[data-group="${target.dataset.group}"]`)?.focus({ preventScroll: true });
  }
  if (target.dataset.event) { state.event = state.event === target.dataset.event ? null : target.dataset.event; render(); document.querySelector(`[data-event="${target.dataset.event}"]`)?.focus({ preventScroll: true }); }
  if (target.dataset.jump) { state.period = target.dataset.jump; state.group = null; state.event = null; render(); document.querySelector(`#period-${target.dataset.jump}`).scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  if (target.id === 'resume') {
    const saved = read('position', null); if (!saved) return;
    restoring = true; clearTimeout(scrollTimer); state.period = saved.period; state.group = saved.group; state.event = saved.event; render();
    requestAnimationFrame(() => { window.scrollTo(0, saved.y || 0); setTimeout(() => { restoring = false; }, 100); });
  }
  if (target.id === 'account') document.querySelector('#account-dialog').showModal();
  if (target.matches('.dialog-close, .dialog-close-action')) document.querySelector('#account-dialog').close();
  if (target.getAttribute('href') === '#timeline') { e.preventDefault(); document.querySelector('#timeline').scrollIntoView({ behavior: 'smooth' }); }
  if (target.matches('a[href^="#/"]') && (location.hash === '#/' || !location.hash)) homeScroll = window.scrollY;
});
function savePosition() {
  if ((location.hash === '#/' || !location.hash) && !restoring && window.scrollY > 100) write('position', { y: window.scrollY, period: state.period, group: state.group, event: state.event });
}
window.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(savePosition, 200); }, { passive: true });
window.addEventListener('pagehide', () => { savePosition(); disposeDrum(); });
window.addEventListener('pageshow', e => { if (e.persisted) bindDrum(); });
window.addEventListener('hashchange', () => { clearTimeout(scrollTimer); render({ focus: true }); });
window.addEventListener('storage', e => { if (e.key === 'dong-su-viet:saved') { const value = read('saved', []); state.saved = Array.isArray(value) ? value : []; render(); } });
render();
