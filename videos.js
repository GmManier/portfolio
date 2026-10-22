/* =========================================================
   영상 링크 설정 — 시안 1·2 공용
   - 유튜브: 영상 주소 전체 또는 ID만 넣는다
       예) 'https://youtu.be/abcd1234XYZ'  또는  'abcd1234XYZ'
   - 직접 올린 파일: 'video/wolha_main.mp4' 처럼 경로를 넣는다
   - 비워 두면 대표 이미지 + "영상 추가 예정" 표시
   ========================================================= */
window.PORTFOLIO_VIDEOS = {
  wolha_main:    '', // 월하일검 대표 플레이 영상
  wolha_ai:      '', // 월하일검 공용 AI 시연
  wolha_gas:     '', // 월하일검 GAS 전투 (패링·가드·피격)
  wolha_fx:      '', // 월하일검 전투 연출 (사운드·카메라 흔들림)
  rolling_main:  '', // 롤링레오 플레이 영상
  rolling_gstar: '', // 롤링레오 지스타 2025 시연
  unreal_ai:     '', // 언리얼 BT·State Tree AI 구현
  unity_shooting:'', // 유니티 슈팅 게임
  ai_tool:       ''  // AI 가중치 검증 툴 시연
};

/* =========================================================
   기획서 링크 설정 — 구글 드라이브 공유 링크를 그대로 넣는다
     예) 'https://drive.google.com/file/d/파일ID/view?usp=sharing'
   - "기획서 보기"는 이 링크를 새 창으로 연다
   - "다운로드"는 드라이브 파일 링크면 바로 받기 주소로 자동 변환한다
   - 비워 두면 버튼에 "링크 추가 예정" 표시
   ========================================================= */
window.PORTFOLIO_LINKS = {
  doc_common_ai:    '', // 공용 AI 기획서 [다크소울]
  doc_common_skill: ''  // 공용 스킬 시스템 기획서 [POE2]
};

/* 유튜브를 페이지 안에서 재생할지 (false = 유튜브 새 창으로 열기) */
if (window.PORTFOLIO_VIDEO_EMBED === undefined) window.PORTFOLIO_VIDEO_EMBED = true;

/* ---------- 아래는 수정할 필요 없음 ---------- */
(function () {
  /* 기획서 링크 버튼: data-link="키" data-mode="view|download" */
  function driveDownload(url) {
    var m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]+)/);
    return m ? 'https://drive.google.com/uc?export=download&id=' + m[1] : url;
  }
  function renderLinks() {
    var L = window.PORTFOLIO_LINKS || {};
    document.querySelectorAll('a[data-link]').forEach(function (a) {
      var url = (L[a.dataset.link] || '').trim();
      if (!url) {
        a.classList.add('is-empty');
        a.removeAttribute('href');
        a.setAttribute('aria-disabled', 'true');
        a.textContent = a.dataset.mode === 'download' ? '다운로드 · 링크 추가 예정' : '기획서 보기 · 링크 추가 예정';
        return;
      }
      a.href = a.dataset.mode === 'download' ? driveDownload(url) : url;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }
  document.addEventListener('DOMContentLoaded', renderLinks);
})();

(function () {
  function ytId(v) {
    var m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : null);
  }

  function renderSlots() {
    var V = window.PORTFOLIO_VIDEOS || {};
    document.querySelectorAll('[data-video]').forEach(function (el) {
      var src = (V[el.dataset.video] || '').trim();
      var title = el.dataset.title || '영상';
      var poster = el.dataset.poster || '';
      el.classList.add('vslot');
      if (!src) {
        el.classList.add('is-empty');
        el.innerHTML =
          (poster ? '<img src="' + poster + '" alt="" loading="lazy">' : '') +
          '<div class="vslot-ui"><span class="vslot-play" aria-hidden="true"></span>' +
          '<span class="vslot-title">' + title + '</span>' +
          '<span class="vslot-note">영상 추가 예정</span></div>';
        return;
      }
      var id = ytId(src);
      /* 유튜브를 페이지 안에 넣을 수 없는 곳(claude.ai 공유 링크)에서는 새 창으로 연다 */
      if (id && window.PORTFOLIO_VIDEO_EMBED === false) {
        el.innerHTML =
          (poster ? '<img src="' + poster + '" alt="" loading="lazy">' : '') +
          '<a class="vslot-ui" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener" aria-label="' + title + ' 유튜브에서 보기">' +
          '<span class="vslot-play" aria-hidden="true"></span>' +
          '<span class="vslot-title">' + title + '</span>' +
          '<span class="vslot-note">YOUTUBE ↗</span></a>';
        return;
      }
      el.innerHTML =
        (poster ? '<img src="' + poster + '" alt="" loading="lazy">' : '') +
        '<button class="vslot-ui" type="button" aria-label="' + title + ' 재생">' +
        '<span class="vslot-play" aria-hidden="true"></span>' +
        '<span class="vslot-title">' + title + '</span>' +
        '<span class="vslot-note">PLAY VIDEO</span></button>';
      el.querySelector('button').addEventListener('click', function () {
        el.innerHTML = id
          ? '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + title + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'
          : '<video src="' + src + '" controls autoplay playsinline></video>';
      });
    });
  }

  /* 이미지 확대 (같은 data-gal 묶음 안에서 좌우 이동) */
  function lightbox() {
    var box = document.createElement('div');
    box.className = 'lb';
    box.innerHTML =
      '<button class="lb-x" aria-label="닫기">×</button>' +
      '<button class="lb-prev" aria-label="이전">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-next" aria-label="다음">›</button>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cap = box.querySelector('figcaption');
    var list = [], idx = 0;
    function show(i) {
      idx = (i + list.length) % list.length;
      var t = list[idx];
      img.src = t.currentSrc || t.src;
      cap.textContent = t.dataset.cap || t.alt || '';
      box.querySelector('.lb-prev').style.display = list.length > 1 ? '' : 'none';
      box.querySelector('.lb-next').style.display = list.length > 1 ? '' : 'none';
    }
    function close() { box.classList.remove('on'); document.body.style.overflow = ''; }
    document.addEventListener('click', function (e) {
      var t = e.target.closest('img[data-zoom]');
      if (!t) return;
      var g = t.closest('[data-gal]');
      list = g ? Array.prototype.slice.call(g.querySelectorAll('img[data-zoom]')) : [t];
      show(list.indexOf(t));
      box.classList.add('on');
      document.body.style.overflow = 'hidden';
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-x')) close();
      if (e.target.classList.contains('lb-prev')) show(idx - 1);
      if (e.target.classList.contains('lb-next')) show(idx + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  document.addEventListener('DOMContentLoaded', function () { renderSlots(); lightbox(); });
})();
