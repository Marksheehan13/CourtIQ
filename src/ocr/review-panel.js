export function reviewPanelHtml({fixture, screenshot, fields=[]}) {
  const escape = s => String(s ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  return `<section class="ocr-review" data-fixture="${escape(fixture.id)}" data-screenshot="${escape(screenshot.id)}">
    <div class="ocr-review-header"><div><span class="eyebrow">OCR REVIEW</span><h2>${escape(fixture.home)} vs ${escape(fixture.away)}</h2><span>${escape(screenshot.name)}</span></div><span class="badge">UNVERIFIED</span></div>
    <div class="ocr-review-grid"><div class="ocr-source"><img src="${screenshot.data}" alt="${escape(screenshot.name)}"></div><div class="ocr-fields">
      ${fields.map((f,i)=>`<label class="ocr-field"><span>${escape(f.label||f.key)}</span><input data-ocr-index="${i}" value="${escape(f.value)}"><small class="confidence ${f.band||'medium'}">${escape((f.band||'medium').toUpperCase())} CONFIDENCE · ${Math.round((f.confidence??.5)*100)}%</small></label>`).join('')}
    </div></div><div class="ocr-review-actions"><button class="secondary" data-ocr-action="reject">Reject</button><button class="primary" data-ocr-action="save">Save corrections</button><button class="primary" data-ocr-action="verify">Verify screenshot</button></div>
  </section>`;
}
