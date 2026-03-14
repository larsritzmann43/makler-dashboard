/* ============================================================
   IQ INBOX – Ausbaustufe 1 – Click-Dummy
   ============================================================ */

// ── MOCK DATA ──────────────────────────────────────────────

const items = [
  {
    id: 1,
    channel: 'whatsapp',
    contactId: '+49 172 4471 889',   // alles was wir beim Eingang wissen
    senderName: null,                 // wird nach DOS-Match gesetzt
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    preview: 'Hallo, mein Auto wurde heute Nacht beschädigt. Was muss ich tun?',
    keywordCategory: 'Schadensmeldung',
    urgent: true,
    messages: [
      {
        type: 'text',
        text: 'Hallo, mein Auto wurde heute Nacht beschädigt. Jemand hat die Stoßstange eingefahren und ist einfach weitergefahren. Was muss ich jetzt tun?',
        time: '08:12',
      },
      {
        type: 'photo',
        label: 'Unfallschaden_Stossstange.jpg',
        time: '08:13',
      },
      {
        type: 'text',
        text: 'Meine KFZ-Versicherungsnummer lautet: VS-KFZ-2019-4471. Ich bräuchte das möglichst schnell, da die Werkstatt schon gefragt hat.',
        time: '08:15',
      },
    ],
    suggestions: [
      {
        id: 's1', kind: 'procedural', isInfo: true,
        text: 'Erkannte Vorgangsart: Schadensmeldung',
        detail: 'KFZ-Schaden · WhatsApp-Eingang · Priorität: Dringend',
      },
      {
        id: 's2', kind: 'procedural', isInfo: false,
        text: 'An Schadenteam weiterleiten',
        detail: 'Regelbasiert: Schadensmeldungen → Schadenteam-Queue',
      },
      {
        id: 's3', kind: 'procedural', isInfo: false,
        text: 'Schadennummer anfordern & Eingangsbestätigung senden',
        detail: 'Nächster Prozessschritt im Schadenmeldungsverfahren',
      },
    ],
    status: 'open',
    dosResult: null,
    selectedContract: null,
  },
  {
    id: 2,
    channel: 'email',
    contactId: 'p.schmidt@web.de',
    senderName: null,
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
    preview: 'hiermit kündige ich meinen Vertrag fristgerecht…',
    keywordCategory: 'Kündigung',
    urgent: true,
    messages: [
      {
        type: 'text',
        text: 'Betreff: Kündigung Hausrat-Versicherungsvertrag HR-2021-8834\n\nSehr geehrte Damen und Herren,\n\nhiermit kündige ich meinen Hausrat-Versicherungsvertrag mit der Vertragsnummer HR-2021-8834 fristgerecht zum nächstmöglichen Termin.\n\nBitte bestätigen Sie mir die Kündigung sowie das Vertragsende schriftlich per E-Mail.\n\nMit freundlichen Grüßen\nPetra Schmidt',
        time: '09:28',
      },
    ],
    suggestions: [
      {
        id: 's4', kind: 'procedural', isInfo: true,
        text: 'Erkannte Vorgangsart: Kündigung',
        detail: 'Hausrat · E-Mail · Priorität: Dringend',
      },
      {
        id: 's5', kind: 'procedural', isInfo: false,
        text: 'Retention-Gespräch einleiten',
        detail: 'Regelbasiert: Kündigung → Rückgewinnungsversuch vor Bestätigung',
      },
      {
        id: 's6', kind: 'procedural', isInfo: false,
        text: 'Kündigungseingang bestätigen',
        detail: 'Pflichtschritt: schriftliche Eingangsbestätigung innerhalb 24h',
      },
    ],
    status: 'open',
    dosResult: null,
    selectedContract: null,
  },
  {
    id: 3,
    channel: 'sms',
    contactId: '+49 151 2345 6789',
    senderName: null,
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    preview: 'Deckt meine Hausratsversicherung auch Fahrraddiebstahl ab?',
    keywordCategory: 'Produktanfrage',
    urgent: false,
    messages: [
      {
        type: 'text',
        text: 'Hallo, deckt meine Hausratsversicherung eigentlich auch Fahrraddiebstahl ab? Mein Fahrrad wurde gestern Nacht gestohlen.',
        time: '10:42',
      },
    ],
    suggestions: [
      {
        id: 's7', kind: 'procedural', isInfo: true,
        text: 'Erkannte Vorgangsart: Produktanfrage / möglicher Schaden',
        detail: 'Hausrat · SMS-Eingang',
      },
      {
        id: 's8', kind: 'procedural', isInfo: false,
        text: 'Vertragsprüfung Hausrat empfehlen',
        detail: 'Regelbasiert: Produktanfrage → Vertrag im DOS prüfen',
      },
      {
        id: 's9', kind: 'rag', isInfo: false,
        text: 'Fahrradklausel prüfen (Einschluss möglich)',
        detail: 'IQ-Wissen: Hausrat schließt Fahrrad i.d.R. bis 500 € ein – abhängig vom Tarif',
      },
    ],
    status: 'open',
    dosResult: null,
    selectedContract: null,
  },
];

const DOS_DB = {
  '+49 172 4471 889': {
    name: 'MÜLLER, KLAUS DIETER',
    displayName: 'Klaus Müller',
    id: '10047832',
    dob: '15.04.1978',
    phone: '+49 172 4471 889',
    address: 'Kemnader Str. 44, 44795 Bochum',
    contracts: [
      {
        id: 'VS-KFZ-2019-4471',
        type: 'KFZ',
        label: 'KFZ · Volkswagen Golf · BO-MM 471',
        detail: 'Vollkasko · Tarif Comfort · seit 01.03.2019',
        active: true,
      },
      {
        id: 'VS-KFZ-2022-8821',
        type: 'KFZ',
        label: 'KFZ · BMW 3er · BO-MM 882',
        detail: 'Haftpflicht + Teilkasko · Tarif Basic · seit 15.07.2022',
        active: true,
      },
      {
        id: 'VS-HR-2020-1122',
        type: 'Hausrat',
        label: 'Hausrat · Kemnader Str. 44',
        detail: 'Deckungssumme 45.000 € · seit 01.06.2020',
        active: true,
      },
    ],
  },
  'p.schmidt@web.de': {
    name: 'SCHMIDT, PETRA MARIA',
    displayName: 'Petra Schmidt',
    id: '20093417',
    dob: '22.09.1965',
    phone: '+49 234 887 2210',
    address: 'Hattinger Str. 129, 44789 Bochum',
    contracts: [
      {
        id: 'HR-2021-8834',
        type: 'Hausrat',
        label: 'Hausrat · Hattinger Str. 129',
        detail: 'Deckungssumme 30.000 € · Tarif Standard · seit 01.09.2021',
        active: true,
      },
      {
        id: 'HP-2018-3301',
        type: 'Haftpflicht',
        label: 'Privathaftpflicht · Familie Schmidt',
        detail: 'Deckungssumme 5 Mio. € · seit 01.01.2018',
        active: true,
      },
    ],
  },
  '+49 151 2345 6789': {
    name: 'BAUER, THOMAS GEORG',
    displayName: 'Thomas Bauer',
    id: '20118830',
    dob: '07.03.1990',
    phone: '+49 151 2345 6789',
    address: 'Querenburger Str. 88, 44801 Bochum',
    contracts: [
      {
        id: 'VS-HR-2023-5511',
        type: 'Hausrat',
        label: 'Hausrat · Querenburger Str. 88',
        detail: 'Deckungssumme 20.000 € · inkl. Fahrradklausel bis 800 € · seit 01.03.2023',
        active: true,
      },
      {
        id: 'VS-KFZ-2021-3301',
        type: 'KFZ',
        label: 'KFZ · VW Polo · BO-TB 330',
        detail: 'Haftpflicht · Tarif Basic · seit 01.06.2021',
        active: true,
      },
    ],
  },
};

const QUEUES = [
  '– Queue auswählen –',
  'Schadenteam',
  'Backoffice / Innendienst',
  'Retention-Team',
  'KFZ-Abteilung',
  'Dokumenten-Service',
  'Führungskraft (eskalieren)',
];

// ── STATE ──────────────────────────────────────────────────

const state = {
  selectedId: null,
  activeTab: 'reply',
  feedback: {},
  dosOpen: false,
};

// ── HELPERS ────────────────────────────────────────────────

function formatTime(date) {
  const diff = Math.floor((Date.now() - date) / 60000);
  if (diff < 1)  return 'jetzt';
  if (diff < 60) return `vor ${diff} Min.`;
  const h = Math.floor(diff / 60);
  if (h < 24)   return `vor ${h} Std.`;
  return `vor ${Math.floor(h / 24)} Tagen`;
}

function channelLabel(ch) {
  return { whatsapp: 'WhatsApp', email: 'E-Mail', sms: 'SMS' }[ch] || ch;
}

function channelIcon(ch) {
  return { whatsapp: '💬', email: '✉️', sms: '📱' }[ch] || '📨';
}

function getSelectedItem() {
  return items.find(i => i.id === state.selectedId) || null;
}

function contractTypeIcon(type) {
  return { KFZ: '🚗', Hausrat: '🏠', Haftpflicht: '🛡️', Leben: '❤️' }[type] || '📄';
}

// ── TOAST ──────────────────────────────────────────────────

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('is-visible');
  setTimeout(() => el.classList.remove('is-visible'), 2800);
}

// ── RENDER: INBOX ──────────────────────────────────────────

function renderInbox() {
  const open = items.filter(i => i.status === 'open');
  const done = items.filter(i => i.status === 'done');

  let html = '';

  open.forEach(item => {
    const active      = item.id === state.selectedId ? 'is-active' : '';
    // Nach DOS-Match: zeige Name; vorher: zeige Kontaktdaten
    const displayName = item.senderName || item.contactId;
    const isIdentified = !!item.senderName;

    html += `
      <div class="inbox-item ${active}" data-id="${item.id}">
        <div class="item-dot ${item.urgent ? 'urgent' : 'normal'}"></div>
        <div class="item-body">
          <div class="item-top">
            <span class="item-sender ${isIdentified ? '' : 'unidentified'}">${displayName}</span>
            <span class="item-time">${formatTime(item.timestamp)}</span>
          </div>
          <div class="item-preview">${item.preview}</div>
          <div class="item-meta">
            <span class="channel-badge ${item.channel}">${channelLabel(item.channel)}</span>
            <span class="category-badge">${item.urgent ? '🔴 ' : ''}${item.keywordCategory}</span>
            ${item.selectedContract ? `<span class="category-badge" style="color:var(--green-700);border-color:#a5d6a7">✓ ${item.selectedContract.id}</span>` : ''}
          </div>
        </div>
      </div>`;
  });

  if (done.length > 0) {
    html += `<div class="inbox-section-label">Erledigt (letzte 24 Std.)</div>`;
    done.forEach(item => {
      html += `
        <div class="inbox-item is-done" data-id="${item.id}">
          <span class="done-check">✓</span>
          <div class="item-body">
            <div class="item-top">
              <span class="item-sender">${item.senderName || item.contactId}</span>
              <span class="item-time">${formatTime(item.timestamp)}</span>
            </div>
            <div class="item-preview">${item.preview}</div>
            <div class="item-meta">
              <span class="channel-badge ${item.channel}">${channelLabel(item.channel)}</span>
            </div>
          </div>
        </div>`;
    });
  }

  if (open.length === 0 && done.length === 0) {
    html = `<div style="padding:28px 16px;text-align:center;color:var(--gray-400);font-size:13px;">Keine Vorgänge 🎉</div>`;
  }

  document.getElementById('inbox-list').innerHTML = html;
  document.getElementById('inbox-count').textContent = open.length;

  document.querySelectorAll('.inbox-item').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedId = parseInt(el.dataset.id);
      state.activeTab = 'reply';
      renderAll();
    });
  });
}

// ── RENDER: SPALTE 2 ───────────────────────────────────────

function renderDetail() {
  const col2 = document.getElementById('col-2');
  const item = getSelectedItem();

  if (!item) {
    col2.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📬</div>
        <div class="empty-title">Vorgang auswählen</div>
        <div class="empty-sub">Klicke links auf einen Eingang, um ihn zu bearbeiten.</div>
      </div>`;
    return;
  }

  // Welcher Schritt sind wir?
  const hasDos      = !!item.dosResult;
  const hasContract = !!item.selectedContract;

  // ── HEADER ──
  const headerName = item.senderName
    ? `<div class="detail-sender">${item.senderName}</div>`
    : `<div class="detail-sender unidentified">Unbekannter Absender</div>`;

  // ── SCHRITT 1: DOS-SUCHE (immer oben, bis Match) ──
  let dosBlock = '';
  if (!hasDos) {
    dosBlock = `
      <div class="flow-step flow-step--active">
        <div class="flow-step-num">1</div>
        <div class="flow-step-body">
          <div class="flow-step-title">Mandant identifizieren</div>
          <div class="flow-step-sub">Erkannte Kontaktdaten aus der Nachricht:</div>
          <div class="dos-contact-row">
            <span class="dos-contact-val">${item.contactId}</span>
            <button class="btn-sm btn-primary" id="btn-dos">Im DOS suchen ▶</button>
          </div>
        </div>
      </div>`;
  } else {
    const r = item.dosResult;
    dosBlock = `
      <div class="flow-step flow-step--done">
        <div class="flow-step-num">✓</div>
        <div class="flow-step-body">
          <div class="mandant-result">
            <div class="mandant-name">${r.displayName}</div>
            <div class="mandant-detail">Mandant-Nr. ${r.id} · Geb. ${r.dob}</div>
            <div class="mandant-detail">${r.address}</div>
          </div>
        </div>
      </div>`;
  }

  // ── SCHRITT 2: VERTRAGSAUSWAHL ──
  let contractBlock = '';
  if (hasDos && !hasContract) {
    const contractCards = item.dosResult.contracts.map(c => `
      <div class="contract-card" data-cid="${c.id}">
        <span class="contract-icon">${contractTypeIcon(c.type)}</span>
        <div class="contract-info">
          <div class="contract-label">${c.label}</div>
          <div class="contract-detail">${c.detail}</div>
          <div class="contract-id">${c.id}</div>
        </div>
        <button class="btn-sm btn-outline btn-contract-select" data-cid="${c.id}">Auswählen</button>
      </div>`).join('');

    contractBlock = `
      <div class="flow-step flow-step--active">
        <div class="flow-step-num">2</div>
        <div class="flow-step-body">
          <div class="flow-step-title">Welcher Vertrag ist betroffen?</div>
          <div class="flow-step-sub">${item.dosResult.contracts.length} Verträge gefunden – bitte auswählen:</div>
          <div class="contract-list">${contractCards}</div>
        </div>
      </div>`;
  } else if (hasDos && hasContract) {
    const c = item.selectedContract;
    contractBlock = `
      <div class="flow-step flow-step--done">
        <div class="flow-step-num">✓</div>
        <div class="flow-step-body">
          <div class="mandant-result" style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">${contractTypeIcon(c.type)}</span>
            <div>
              <div class="mandant-name" style="font-size:13px">${c.label}</div>
              <div class="mandant-detail">${c.id} · ${c.detail}</div>
            </div>
          </div>
        </div>
      </div>`;
  } else if (!hasDos) {
    // Schritt 2 noch gesperrt anzeigen
    contractBlock = `
      <div class="flow-step flow-step--locked">
        <div class="flow-step-num">2</div>
        <div class="flow-step-body">
          <div class="flow-step-title" style="color:var(--gray-400)">Vertrag auswählen</div>
          <div class="flow-step-sub">Erst Mandant identifizieren (Schritt 1)</div>
        </div>
      </div>`;
  }

  // ── NACHRICHTEN ──
  const msgsHtml = item.messages.map(m => {
    if (m.type === 'photo') {
      return `
        <div class="photo-attachment">
          <span class="photo-icon">🖼️</span>
          <div>
            <div class="photo-label">${m.label}</div>
            <div class="photo-sub">Empfangen ${m.time} · Klicken zum Anzeigen</div>
          </div>
          <button class="photo-view-btn" onclick="showToast('Bildvorschau – in der Produktivversion inline angezeigt.')">Anzeigen</button>
        </div>`;
    }
    return `
      <div class="message-bubble incoming">
        <div class="message-text">${m.text}</div>
        <div class="message-time">${m.time} · ${channelIcon(item.channel)} ${channelLabel(item.channel)}</div>
      </div>`;
  }).join('');

  // ── AKTIONS-BEREICH (nur wenn Mandant + Vertrag gewählt) ──
  let actionsBlock = '';
  if (hasDos && hasContract) {
    const isWhatsAppOrPhone = item.channel === 'whatsapp' || item.channel === 'phone';
    const channelSel = isWhatsAppOrPhone
      ? `<div class="reply-channel-row">
           <span>Antwortkanal:</span>
           <select class="channel-select" id="reply-channel">
             <option>E-Mail</option><option>SMS</option>
           </select>
         </div>`
      : `<div class="reply-channel-row">
           <span>Antwortkanal:</span>
           <span class="dos-contact-val">${channelLabel(item.channel)}</span>
         </div>`;

    const tabs = ['reply', 'forward', 'archive'];
    const tabLabels = { reply: 'Antworten', forward: 'Weiterleiten', archive: 'Abschließen' };
    const tabsHtml = tabs.map(t =>
      `<button class="action-tab ${state.activeTab === t ? 'is-active' : ''}" data-tab="${t}">${tabLabels[t]}</button>`
    ).join('');

    const queueOptions = QUEUES.map(q => `<option>${q}</option>`).join('');

    actionsBlock = `
      <div class="flow-step flow-step--active" style="border:none;padding:0">
        <div class="flow-step-body" style="width:100%">
          <div class="actions-section">
            <div class="action-tabs">${tabsHtml}</div>

            <div class="action-panel ${state.activeTab === 'reply' ? 'is-active' : ''}">
              ${channelSel}
              <textarea class="reply-textarea" id="reply-text" placeholder="Antwort formulieren…"></textarea>
              <div class="action-footer">
                <button class="btn-sm btn-ghost" id="btn-done">Als erledigt markieren</button>
                <button class="btn-sm btn-primary" id="btn-send">Antwort senden</button>
              </div>
            </div>

            <div class="action-panel ${state.activeTab === 'forward' ? 'is-active' : ''}">
              <div class="action-label">Weiterleiten an</div>
              <div class="forward-row">
                <select class="queue-select" id="forward-queue">${queueOptions}</select>
              </div>
              <textarea class="reply-textarea" id="forward-text" placeholder="Weiterleitungsnachricht (optional)…" style="min-height:60px"></textarea>
              <div class="action-footer">
                <button class="btn-sm btn-ghost" id="btn-done-fwd">Als erledigt markieren</button>
                <button class="btn-sm btn-primary" id="btn-forward-send">Weiterleiten</button>
              </div>
            </div>

            <div class="action-panel ${state.activeTab === 'archive' ? 'is-active' : ''}">
              <div class="archive-info">
                Abschließen exportiert die vollständige Konversation als <strong>Plaintext-Notiz</strong> in das DOS-Konto von <strong>${item.senderName}</strong> (Mandant-Nr. ${item.dosResult.id}).<br><br>
                Nachrichten, die danach eingehen, starten automatisch einen <strong>neuen Vorgang</strong>.
              </div>
              <div class="action-footer">
                <button class="btn-sm btn-danger" id="btn-archive">Abschließen & ins DOS archivieren</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  } else if (!hasDos || !hasContract) {
    // Schritt 3 gesperrt
    actionsBlock = `
      <div class="flow-step flow-step--locked">
        <div class="flow-step-num">3</div>
        <div class="flow-step-body">
          <div class="flow-step-title" style="color:var(--gray-400)">Antworten / Weiterleiten / Abschließen</div>
          <div class="flow-step-sub">Erst Mandant und Vertrag zuordnen (Schritte 1 & 2)</div>
        </div>
      </div>`;
  }

  col2.innerHTML = `
    <div class="detail-wrap">
      <div class="detail-header">
        ${headerName}
        <div class="detail-meta">
          <span class="channel-badge ${item.channel}">${channelLabel(item.channel)}</span>
          <span class="category-badge">${item.urgent ? '🔴 ' : ''}${item.keywordCategory}</span>
          <span class="detail-contact">${item.contactId}</span>
          <span class="detail-contact" style="color:var(--gray-400)">${formatTime(item.timestamp)}</span>
        </div>
      </div>

      <div class="detail-body">
        ${dosBlock}
        ${contractBlock}

        <div class="messages-section">
          <div class="messages-label">${channelIcon(item.channel)} ${item.messages.length > 1 ? `${item.messages.length} Nachrichten` : 'Nachricht'} eingegangen</div>
          ${msgsHtml}
        </div>

        ${actionsBlock}
      </div>
    </div>`;

  // Events
  const dosBtn = document.getElementById('btn-dos');
  if (dosBtn) dosBtn.addEventListener('click', () => renderDosModal(item));

  document.querySelectorAll('.btn-contract-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const cid = btn.dataset.cid;
      item.selectedContract = item.dosResult.contracts.find(c => c.id === cid);
      renderAll();
    });
  });

  document.querySelectorAll('.action-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.activeTab = tab.dataset.tab;
      renderDetail();
    });
  });

  const sendBtn = document.getElementById('btn-send');
  if (sendBtn) sendBtn.addEventListener('click', () => {
    const txt = (document.getElementById('reply-text') || {}).value || '';
    if (!txt.trim()) { showToast('Bitte erst eine Antwort formulieren.'); return; }
    markDone(item.id, `Antwort gesendet via ${channelLabel(item.channel)}`);
  });

  const doneBtn = document.getElementById('btn-done');
  if (doneBtn) doneBtn.addEventListener('click', () => markDone(item.id, 'Vorgang als erledigt markiert'));

  const doneFwdBtn = document.getElementById('btn-done-fwd');
  if (doneFwdBtn) doneFwdBtn.addEventListener('click', () => markDone(item.id, 'Vorgang als erledigt markiert'));

  const fwdBtn = document.getElementById('btn-forward-send');
  if (fwdBtn) fwdBtn.addEventListener('click', () => {
    const queue = (document.getElementById('forward-queue') || {}).value || '';
    if (queue === QUEUES[0]) { showToast('Bitte eine Queue auswählen.'); return; }
    markDone(item.id, `Weitergeleitet an: ${queue}`);
  });

  const archBtn = document.getElementById('btn-archive');
  if (archBtn) archBtn.addEventListener('click', () =>
    markDone(item.id, 'Konversation archiviert · Notiz ins DOS exportiert')
  );
}

function markDone(itemId, msg) {
  const item = items.find(i => i.id === itemId);
  if (item) item.status = 'done';
  state.selectedId = null;
  showToast(`✓ ${msg}`);
  renderAll();
}

// ── RENDER: SPALTE 3 ───────────────────────────────────────

function renderIntelligence() {
  const col3 = document.getElementById('col-3');
  const item = getSelectedItem();

  if (!item) {
    col3.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧠</div>
        <div class="empty-title">IQ Analyse</div>
        <div class="empty-sub">Wähle einen Vorgang aus.</div>
      </div>`;
    return;
  }

  const categoryInfo    = item.suggestions.find(s => s.isInfo);
  const actionSuggestions = item.suggestions.filter(s => !s.isInfo);
  const acceptedCount   = actionSuggestions.filter(s => state.feedback[s.id] === 'accepted').length;

  const suggestionsHtml = actionSuggestions.map(s => {
    const fb = state.feedback[s.id];
    return `
      <div class="suggestion-card ${fb ? 'is-' + fb : ''}">
        <div class="suggestion-top">
          <span class="suggestion-type ${s.kind}">${s.kind === 'rag' ? 'IQ-Wissen' : 'Prozessregel'}</span>
          <div>
            <div class="suggestion-text">${s.text}</div>
            <div class="suggestion-detail">${s.detail}</div>
          </div>
        </div>
        ${fb
          ? `<div class="suggestion-result ${fb}">${fb === 'accepted' ? '✓ Akzeptiert' : '✕ Abgelehnt'}</div>`
          : `<div class="suggestion-actions">
               <button class="btn-accept" data-sid="${s.id}">✓ Akzeptieren</button>
               <button class="btn-reject" data-sid="${s.id}">✕ Ablehnen</button>
             </div>`
        }
      </div>`;
  }).join('');

  col3.innerHTML = `
    <div class="intel-wrap">
      <div class="intel-header">
        <div class="intel-title">🧠 IQ Analyse</div>
        <div class="intel-sub">Bewertungs- und Vorschlagsebene</div>
      </div>
      <div class="intel-body">
        ${categoryInfo ? `
          <div class="category-detect">
            <div class="category-detect-label">Erkannte Vorgangsart</div>
            <div class="category-detect-value">
              ${item.urgent ? '🔴' : '⚪'} ${item.keywordCategory}
            </div>
            <div class="category-detect-detail">${categoryInfo.detail}</div>
          </div>` : ''}

        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--gray-400);padding:4px 0 2px">
          Vorschläge
        </div>
        ${suggestionsHtml}
      </div>
      <div class="intel-footer">
        ${acceptedCount > 0
          ? `📊 ${acceptedCount} Vorschlag${acceptedCount > 1 ? 'e' : ''} bewertet · Lerndaten werden erfasst`
          : 'Bewertungen fließen als Trainingsdaten zurück.'}
      </div>
    </div>`;

  document.querySelectorAll('.btn-accept, .btn-reject').forEach(btn => {
    btn.addEventListener('click', () => {
      state.feedback[btn.dataset.sid] = btn.classList.contains('btn-accept') ? 'accepted' : 'rejected';
      renderIntelligence();
    });
  });
}

// ── DOS MODAL ──────────────────────────────────────────────

function renderDosModal(item) {
  const contact = item.contactId;
  const result  = DOS_DB[contact];
  const modal   = document.getElementById('dos-modal');
  const win     = document.getElementById('dos-window');

  let resultHtml;
  if (result) {
    resultHtml = `
      <div class="dos-line green">▶  1 DATENSATZ GEFUNDEN</div>
      <div class="dos-result-box">
        <div class="dos-result-row"><span class="dos-result-key">NAME</span><span class="dos-result-val">${result.name}</span></div>
        <div class="dos-result-row"><span class="dos-result-key">MANDANT-NR.</span><span class="dos-result-val">${result.id}</span></div>
        <div class="dos-result-row"><span class="dos-result-key">GEB.-DATUM</span><span class="dos-result-val">${result.dob}</span></div>
        <div class="dos-result-row"><span class="dos-result-key">TELEFON</span><span class="dos-result-val">${result.phone}</span></div>
        <div class="dos-result-row"><span class="dos-result-key">ADRESSE</span><span class="dos-result-val">${result.address}</span></div>
        <div class="dos-result-row"><span class="dos-result-key">VERTRÄGE</span><span class="dos-result-val">${result.contracts.length} aktiv</span></div>
      </div>
      <div class="dos-buttons">
        <button class="dos-btn primary" id="dos-btn-accept">F2  ÜBERNEHMEN</button>
        <button class="dos-btn secondary" id="dos-btn-new">F8  NEU ANLEGEN</button>
        <button class="dos-btn danger" id="dos-btn-cancel">ESC  ABBRECHEN</button>
      </div>`;
  } else {
    resultHtml = `
      <div class="dos-line" style="color:#ff6666">▶  KEIN DATENSATZ GEFUNDEN</div>
      <div class="dos-line dim">    Keine Übereinstimmung für "${contact}".</div>
      <div class="dos-buttons">
        <button class="dos-btn secondary" id="dos-btn-new">F8  NEU ANLEGEN</button>
        <button class="dos-btn danger" id="dos-btn-cancel">ESC  ABBRECHEN</button>
      </div>`;
  }

  win.innerHTML = `
    <div class="dos-titlebar">
      <span class="dos-titlebar-text">TELIS FINANZ AG  –  DOS MANDANTENSUCHE  v2.3</span>
      <span class="dos-titlebar-meta">Modul: MKLS_SUCHE</span>
    </div>
    <div class="dos-body">
      <div class="dos-line dim">══════════════════════════════════════════════════════════</div>
      <div class="dos-search-row">
        <span class="dos-search-label">SUCHBEGRIFF :</span>
        <input class="dos-search-val" value="${contact}" readonly>
      </div>
      <div class="dos-line dim">──────────────────────────────────────────────────────────</div><br>
      ${resultHtml}
    </div>`;

  modal.classList.add('is-open');

  const acceptBtn = document.getElementById('dos-btn-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      item.dosResult  = result;
      item.senderName = result.displayName;
      closeDosModal();
      showToast(`✓ Mandant übernommen: ${result.displayName}`);
      renderAll();
    });
  }

  document.getElementById('dos-btn-new')?.addEventListener('click', () => {
    closeDosModal();
    showToast('Neuen Mandanten anlegen – Formular wird vorbereitet…');
  });

  document.getElementById('dos-btn-cancel')?.addEventListener('click', closeDosModal);

  modal.addEventListener('click', e => { if (e.target === modal) closeDosModal(); }, { once: true });
}

function closeDosModal() {
  document.getElementById('dos-modal').classList.remove('is-open');
}

// ── RENDER ALL ─────────────────────────────────────────────

function renderAll() {
  renderInbox();
  renderDetail();
  renderIntelligence();
}

// ── INIT ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  document.getElementById('btn-new').addEventListener('click', () =>
    showToast('Neuen Vorgang anlegen – kommt in Kürze.')
  );

  document.getElementById('search-input').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.inbox-item').forEach(el => {
      el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});
