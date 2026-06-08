// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}

// State
const sel = {
  mode: 'focused', time: '3days', impact: 'medium',
  value: 'medium', focus: 'medium', hasAlt: 'no'
};

// Pill selection
document.querySelectorAll('.pill-row').forEach(row => {
  row.addEventListener('click', e => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    row.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sel[row.dataset.group] = btn.dataset.val;
    if (row.dataset.group === 'hasAlt') {
      document.getElementById('alt-row').style.display =
        btn.dataset.val === 'yes' ? 'flex' : 'none';
    }
  });
});

// Decision logic
function decide() {
  const title = document.getElementById('task-title').value.trim();
  document.getElementById('error-area').innerHTML = '';

  if (!title) {
    document.getElementById('error-area').innerHTML =
      '<div class="error-msg">請先輸入任務名稱</div>';
    return;
  }

  const { mode, time, impact, value, focus, hasAlt } = sel;
  const altTask = document.getElementById('alt-task').value.trim();

  // Score
  const timeScore   = { today: 40, '3days': 25, '30days': 10, later: 0 }[time] ?? 0;
  const impactScore = { high: 25, medium: 15, low: 5, minimal: 0 }[impact] ?? 0;
  const valueScore  = { high: 20, medium: 12, low: 4, minimal: 0 }[value] ?? 0;
  const focusPenalty = (focus === 'high' && (mode === 'tired' || mode === 'chill')) ? -15 : 0;
  const altPenalty   = hasAlt === 'yes' ? -10 : 0;
  const score = Math.min(100, Math.max(0,
    timeScore + impactScore + valueScore + focusPenalty + altPenalty
  ));

  // Decision
  const highBoth     = impact === 'high' && value === 'high';
  const lowValue     = value === 'low' || value === 'minimal';
  const focusMismatch = focus === 'high' && (mode === 'tired' || mode === 'chill');
  const hasHigherAlt  = hasAlt === 'yes' && (lowValue || impact === 'low' || impact === 'minimal');

  let decision, reason, suggestion;

  if (hasHigherAlt) {
    decision = 'SWITCH';
    reason = altTask
      ? `「${altTask}」優先度更高，先切換過去。`
      : '有更值得做的替代任務，先切換。';
    suggestion = altTask ? `先執行「${altTask}」` : '先處理替代任務';
  } else if (time === 'today' || (highBoth && hasAlt === 'no')) {
    decision = 'NOW';
    reason = time === 'today'
      ? '今天截止，立即執行避免風險。'
      : '影響與價值雙高，現在是好時機。';
    suggestion = null;
  } else {
    decision = 'LATER';
    if (focusMismatch) {
      reason = '任務需要高專注，但當下模式不適合。';
      suggestion = '等進入專注模式後再處理。';
    } else if (time === 'later') {
      reason = '時間充裕，暫時不需要佔用注意力。';
      suggestion = '放入長期清單，30 天內再重新評估。';
    } else {
      reason = '時間壓力不緊迫，不需要現在處理。';
      suggestion = '排進本週計畫，不用現在分心。';
    }
  }

  // Breakdown
  const desc = document.getElementById('task-desc').value.trim();
  const isLarge = desc.length > 30 || title.length > 20;
  let breakdown;
  if (decision === 'NOW' && focus === 'high' && isLarge) {
    breakdown = { yes: true, note: '任務較大，建議先拆出第一步再執行。' };
  } else if (decision === 'LATER' && (impact === 'high' || value === 'high')) {
    breakdown = { yes: true, note: '拆解成小步驟，下次更容易啟動。' };
  } else {
    breakdown = { yes: false, note: '' };
  }

  renderResult({ decision, score, reason, suggestion, breakdown });
}

function renderResult({ decision, score, reason, suggestion, breakdown }) {
  const card = document.getElementById('result-card');
  card.classList.add('visible');

  const badgeMap = { NOW: 'badge-NOW', LATER: 'badge-LATER', SWITCH: 'badge-SWITCH' };
  const labelMap = { NOW: 'NOW — 立即執行', LATER: 'LATER — 稍後處理', SWITCH: 'SWITCH — 換個任務' };
  const colorMap = { NOW: '#16a34a', LATER: '#b45309', SWITCH: '#1d4ed8' };

  const badge = document.getElementById('decision-badge');
  badge.className = 'decision-badge ' + (badgeMap[decision] || 'badge-LATER');
  document.getElementById('badge-text').textContent = labelMap[decision] || decision;

  document.getElementById('score-num').textContent = score + ' / 100';
  const fill = document.getElementById('score-fill');
  fill.style.background = colorMap[decision] || '#888';
  fill.style.width = '0%';
  setTimeout(() => { fill.style.width = score + '%'; }, 50);

  document.getElementById('reason-val').textContent = reason;

  const suggSec = document.getElementById('suggestion-section');
  if (suggestion) {
    document.getElementById('suggestion-val').textContent = suggestion;
    suggSec.style.display = 'block';
  } else {
    suggSec.style.display = 'none';
  }

  const bdEl = document.getElementById('breakdown-val');
  bdEl.innerHTML =
    `<span class="breakdown-tag ${breakdown.yes ? 'breakdown-yes' : 'breakdown-no'}">${breakdown.yes ? '建議拆解' : '不需拆解'}</span>`
    + (breakdown.note
      ? `<span style="font-size:12px;color:var(--text-muted);margin-left:8px;">${breakdown.note}</span>`
      : '');

  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('decide-btn').addEventListener('click', decide);
