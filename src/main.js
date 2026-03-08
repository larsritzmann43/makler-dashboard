// Main application entry point

import './style.css';
import {
  mockRequests,
  channels,
  categories,
  priorities,
  getSortedRequests,
  formatTimeAgo,
  formatDateTime,
  initialFinanzanalysen
} from './mockData.js';
import { templates } from './templates.js';
import {
  generateResponse,
  getAppointmentSuggestion,
  initApiKey,
  showApiKeyDialog
} from './ai.js';

// Action plan templates per category
const actionPlans = {
  damage: [
    {
      text: 'Schadenvorgang an das Backoffice übergeben',
      recipient: 'Backoffice-Team (intern)',
      blocksOnSend: [1, 2, 3],
      draft: (request) => `Hallo Team,\n\nhiermit übergebe ich folgenden Schadenvorgang zur weiteren Bearbeitung:\n\nMandant: ${request.sender.name}\nVertrag: ${request.sender.contracts?.[0]?.vertragsnummer ?? '–'}\nGesellschaft: ${request.sender.contracts?.[0]?.gesellschaft ?? '–'}\n\nBitte übernehmt die Kommunikation mit dem Versicherer, die Beauftragung eines Gutachters sowie ggf. die Kontaktaufnahme mit Polygon. Ich halte den Mandanten über den weiteren Status informiert.\n\nDanke!`
    },
    {
      text: 'Versicherer informieren',
      recipient: 'Versicherer',
      draft: (request) => `Sehr geehrte Damen und Herren,\n\nim Auftrag unseres Mandanten ${request.sender.name} (Vertrag: ${request.sender.contracts?.[0]?.vertragsnummer ?? '–'}) melden wir hiermit einen Schadenfall.\n\nSchadenhergang:\n${request.summary}\n\nBitte bestätigen Sie den Eingang dieser Meldung und teilen Sie uns den zuständigen Sachbearbeiter mit.\n\nMit freundlichen Grüßen`
    },
    {
      text: 'Schadenformulare an Mandanten senden',
      recipient: 'Mandant',
      draft: (request) => `Guten Tag, ${request.sender.name.split(' ').pop()},\n\nfür die weitere Bearbeitung Ihres Schadens benötigen wir noch einige Unterlagen von Ihnen:\n\n• Ausgefülltes Schadenformular (Link folgt)\n• Fotos des Schadens\n• Ggf. Polizeibericht / Gutachten\n\nBitte senden Sie die Unterlagen so bald wie möglich zurück.\n\nBei Fragen stehe ich Ihnen gerne zur Verfügung.`
    },
    {
      text: 'Schadensersatzbeauftragter beauftragen (Polygon)',
      recipient: 'Polygon GmbH',
      draft: (request) => `Guten Tag,\n\nwir bitten um die Beauftragung eines Schadensersatzbeauftragten für folgenden Fall:\n\nMandant: ${request.sender.name}\nSchaden: ${request.summary}\nVertragsnummer: ${request.sender.contracts?.[0]?.vertragsnummer ?? '–'}\n\nBitte nehmen Sie baldmöglichst Kontakt mit dem Mandanten auf.\n\nMit freundlichen Grüßen`
    },
    {
      text: 'Mandanten über Status informieren',
      recipient: 'Mandant',
      draft: (request) => `Guten Tag, ${request.sender.name.split(' ').pop()},\n\nik wollte Sie kurz über den aktuellen Stand Ihres Schadenfalls informieren:\n\nIhr Schadenfall ist bei uns eingegangen und wird aktuell bearbeitet. Der zuständige Versicherer wurde informiert. Sobald es Neuigkeiten gibt, melde ich mich umgehend bei Ihnen.\n\nBei Fragen stehe ich Ihnen jederzeit zur Verfügung.`
    }
  ],
  appointment: [
    { text: 'Verfügbare Termine prüfen', detail: 'Kalender auf passende Slots checken' },
    { text: 'Terminvorschlag an Kunden senden', detail: '2-3 Alternativen anbieten' },
    { text: 'Beratungsunterlagen vorbereiten', detail: 'Relevante Produktinfos zusammenstellen' },
    { text: 'Termin im Kalender bestätigen', detail: 'Nach Rückmeldung des Kunden eintragen' }
  ],
  contractChange: [
    { text: 'Aktuelle Vertragsdaten prüfen', detail: 'Bestehendes Vertragsprofil und Konditionen sichten' },
    { text: 'Änderungsantrag vorbereiten', detail: 'Formular mit gewünschten Anpassungen ausfüllen' },
    { text: 'Gesundheitsprüfung klären', detail: 'Prüfen, ob erneute Risikoprüfung erforderlich ist' },
    { text: 'Benötigte Unterlagen anfordern', detail: 'Einkommensnachweise etc. vom Kunden anfordern' },
    { text: 'Antrag an Versicherer weiterleiten', detail: 'Nach Rücklauf der Unterlagen einreichen' }
  ],
  cancellation: [
    { text: 'Kündigungsfristen prüfen', detail: 'Vertragslaufzeit und Stichtag im System nachsehen' },
    { text: 'Alternativangebot prüfen', detail: 'Mögliche Vertragsanpassung als Alternative anbieten' },
    { text: 'Kündigungsbestätigung erstellen', detail: 'Schriftliche Bestätigung mit Termin aufsetzen' },
    { text: 'Kunden über Folgen informieren', detail: 'Versicherungslücken und Handlungsbedarf klären' }
  ],
  question: [
    { text: 'Vertragsbedingungen prüfen', detail: 'Relevante Klauseln im Versicherungsvertrag nachschlagen' },
    { text: 'Fachinformation zusammenstellen', detail: 'Antwort mit Vertragsdetails und Hinweisen formulieren' },
    { text: 'Kunden antworten', detail: 'Verständliche Antwort per bevorzugtem Kanal senden' }
  ],
  documents: [
    { text: 'Gewünschtes Dokument identifizieren', detail: 'Klären, welche Bescheinigung genau benötigt wird' },
    { text: 'Dokument ausstellen', detail: 'Bestätigung / Nachweis mit aktuellen Vertragsdaten erstellen' },
    { text: 'Adressdaten aktualisieren (falls nötig)', detail: 'Neue Adresse im Vertragssystem hinterlegen' },
    { text: 'Dokument an Kunden senden', detail: 'Per E-Mail oder Post zustellen' }
  ],
  yearEnd: [
    { text: 'Mandanten-Dashboard sichten', detail: 'Bestehende Verträge und Versorgungslücken prüfen' },
    { text: 'Beratungstermin vereinbaren', detail: 'Telefonisch oder per E-Mail Termin abstimmen' },
    { text: 'Steuerliche Situation besprechen', detail: 'Sonderausgaben-Potenzial und Freibeträge klären' },
    { text: 'Produktvorschlag erstellen', detail: 'Passendes Angebot mit Berechnung vorbereiten' },
    { text: 'Antrag aufnehmen', detail: 'Unterschriften und Unterlagen einholen' },
    { text: 'Nachbereitung & Dokumentation', detail: 'Beratungsprotokoll erstellen und ablegen' }
  ],
  birthday: [
    { text: 'Gratulationsweg wählen', detail: 'E-Mail, WhatsApp, Anruf oder Karte auswählen' },
    { text: 'Persönliche Nachricht senden', detail: 'Glückwünsche mit persönlicher Note versenden' },
    { text: 'Beratungsanlass prüfen', detail: 'Runder Geburtstag = guter Anlass für Vertragscheck' }
  ]
};

// Application State
const state = {
  requests: [...mockRequests],
  answeredRequests: [],
  selectedRequest: null,
  selectedClient: null,
  clientProgress: {}, // tracks action plan progress per client
  currentFilter: 'all',
  currentView: 'requests', // for mobile
  searchQuery: '',
  finanzanalysen: JSON.parse(JSON.stringify(initialFinanzanalysen)),
  extractionStatus: {},   // requestId → 'pending' | 'accepted' | 'rejected' | 'undone'
  extractionSnapshots: {}, // requestId → { applied: [...keys], snapshot: { key: oldValue } }
  damageSteps: {}          // requestId → ['pending'|'selected'|'sent'|'blocked', ...]
};

// DOM Elements
const elements = {
  requestList: document.getElementById('requestList'),
  requestCount: document.getElementById('requestCount'),
  requestDetail: document.getElementById('requestDetail'),
  requestContent: document.getElementById('requestContent'),
  promptResults: document.getElementById('promptResults'),
  currentDate: document.getElementById('currentDate'),
  currentTime: document.getElementById('currentTime'),

  // Detail elements
  requestChannel: document.getElementById('requestChannel'),
  senderName: document.getElementById('senderName'),
  requestTime: document.getElementById('requestTime'),
  requestCategory: document.getElementById('requestCategory'),
  requestContracts: document.getElementById('requestContracts'),
  messageFeed: document.getElementById('messageFeed'),
  appointmentSuggestion: document.getElementById('appointmentSuggestion'),
  suggestedDate: document.getElementById('suggestedDate'),
  suggestedTime: document.getElementById('suggestedTime'),
  aiResponseText: document.getElementById('aiResponseText'),
  aiStatus: document.getElementById('aiStatus'),
  regenerateBtn: document.getElementById('regenerateBtn'),
  sendResponseBtn: document.getElementById('sendResponseBtn'),

  // Chat elements
  chatInput: document.getElementById('chatInput'),
  sendMessageBtn: document.getElementById('sendMessageBtn'),

  // Action plan elements
  actionPlanSection: document.getElementById('actionPlanSection'),
  actionPlanList: document.getElementById('actionPlanList'),
  actionPlanProgress: document.getElementById('actionPlanProgress'),

  impulseSection: document.getElementById('impulseSection'),
  impulseCard: document.getElementById('impulseCard'),

  extractionSection: document.getElementById('extractionSection'),
  extractionPanel: document.getElementById('extractionPanel'),

  damageDraftSection: document.getElementById('damageDraftSection'),
  damageDraftPanel: document.getElementById('damageDraftPanel'),

  aiResponseSection: document.getElementById('aiResponseSection'),

  searchInput: document.getElementById('searchInput')
};

// Initialize the application
function init() {
  initApiKey();
  updateDateTime();
  setInterval(updateDateTime, 1000);

  renderRequestList();

  setupEventListeners();
  setupMobileNav();
  setupResizeHandles();
  setupSearch();
}

// Update date and time display
function updateDateTime() {
  const now = new Date();
  elements.currentDate.textContent = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  elements.currentTime.textContent = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Render the request list
function renderRequestList() {
  const sortedRequests = getSortedRequests(
    state.requests.filter(r => !r.answered)
  );

  // Apply filter
  const filteredRequests = sortedRequests.filter(request => {
    if (state.currentFilter !== 'all') {
      const category = categories[request.category];
      const priority = category.priority;
      if (priority !== state.currentFilter) return false;
    }
    // Apply search filter
    if (state.searchQuery) {
      const name = request.sender.name.toLowerCase();
      const preview = request.preview.toLowerCase();
      const cat = categories[request.category].name.toLowerCase();
      if (!name.includes(state.searchQuery) && !preview.includes(state.searchQuery) && !cat.includes(state.searchQuery)) {
        return false;
      }
    }
    return true;
  });

  // Only update badge text when not in urgent mode
  if (state.currentFilter !== 'high') {
    elements.requestCount.textContent = filteredRequests.length;
  }

  elements.requestList.innerHTML = filteredRequests.map(request => {
    const channel = channels[request.channel];
    const category = categories[request.category];
    const priority = category.priority;
    const isActive = state.selectedRequest?.id === request.id;

    return `
      <div class="request-item ${isActive ? 'request-item--active' : ''}" 
           data-request-id="${request.id}">
        <div class="request-item__icon request-item__icon--${request.channel}">
          ${channel.icon}
        </div>
        <div class="request-item__content">
          <div class="request-item__header">
            <span class="request-item__sender">${request.sender.name}</span>
            <span class="request-item__meta">
              <span class="request-item__priority request-item__priority--${priority}"></span>
              <span class="request-item__time">${formatTimeAgo(request.timestamp)}</span>
            </span>
          </div>
          <div class="request-item__preview">${request.preview}</div>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers
  elements.requestList.querySelectorAll('.request-item').forEach(item => {
    item.addEventListener('click', () => {
      const requestId = parseInt(item.dataset.requestId);
      selectRequest(requestId);
    });
  });
}

// Select a request and show details
async function selectRequest(requestId) {
  const request = state.requests.find(r => r.id === requestId);
  if (!request) return;

  state.selectedRequest = request;
  state.selectedClient = null;
  renderRequestList(); // Update active state

  // Hide contextual panels by default; shown only when relevant
  elements.impulseSection.style.display = 'none';
  elements.extractionSection.style.display = 'none';

  // Handle special request types
  if (request.type === 'yearEnd') {
    renderYearEndView(request);
    return;
  }

  if (request.type === 'birthday') {
    renderBirthdayView(request);
    return;
  }

  if (request.type === 'rework') {
    renderReworkView(request);
    return;
  }

  // Standard request view
  renderStandardRequestView(request);
}

// Render standard request detail view
async function renderStandardRequestView(request) {
  const category = categories[request.category];
  const channel = channels[request.channel];

  // Remove any existing custom view
  const existing = elements.requestDetail.querySelector('.custom-list-view');
  if (existing) existing.remove();

  // Hide empty state, show content
  elements.requestDetail.querySelector('.request-detail__empty').style.display = 'none';
  elements.requestContent.style.display = 'block';

  // Header: Name + Category Chip + Channel Chip + Time
  elements.senderName.textContent = request.sender.name;
  elements.requestCategory.textContent = category.name;
  elements.requestCategory.className = `request-category request-category--${request.category}`;
  elements.requestChannel.innerHTML = `<span class="request-channel__icon">${channel.icon}</span>${channel.name}`;
  elements.requestChannel.className = `request-channel request-channel--${request.channel}`;
  elements.requestTime.textContent = formatDateTime(request.timestamp);

  // Contracts from sender
  if (request.sender.contracts && request.sender.contracts.length > 0) {
    elements.requestContracts.innerHTML = request.sender.contracts.map(c =>
      `<div class="contract-chip"><span class="contract-chip__sparte">${c.sparte}</span>${c.gesellschaft}, ${c.vertragsnummer}</div>`
    ).join('');
  } else {
    elements.requestContracts.innerHTML = '';
  }

  // Render messenger feed
  renderMessageFeed(request);

  // Show appointment suggestion for appointment requests
  if (request.category === 'appointment') {
    const appointment = getAppointmentSuggestion();
    elements.appointmentSuggestion.style.display = 'block';
    elements.suggestedDate.textContent = `${appointment.day}, ${appointment.date.split('-').reverse().join('.')}`;
    elements.suggestedTime.textContent = `${appointment.time} Uhr`;
  } else {
    elements.appointmentSuggestion.style.display = 'none';
  }

  // Render impulse panel if present
  if (request.impulse) {
    const imp = request.impulse;
    elements.impulseCard.innerHTML = `
      <div class="impulse-card impulse-card--${imp.variant}">
        <div class="impulse-card__header">
          <div class="impulse-card__label">
            <span class="impulse-card__dot"></span>
            <span class="impulse-card__title-text">${imp.title}</span>
          </div>
          <button class="impulse-card__dismiss" id="impulseCloseBtn" title="Schließen">×</button>
        </div>
        <p class="impulse-card__insight">${imp.insight}</p>
        <p class="impulse-card__text">${imp.text}</p>
      </div>
    `;
    elements.impulseSection.style.display = 'block';
    document.getElementById('impulseCloseBtn').addEventListener('click', () => {
      elements.impulseSection.style.display = 'none';
    });
  }

  // Render extraction panel if document contains extractable data
  renderExtractedDataPanel(request);

  // Damage category: use new step interaction model
  if (request.category === 'damage') {
    if (elements.aiResponseSection) elements.aiResponseSection.style.display = 'none';
    if (elements.damageDraftSection) elements.damageDraftSection.style.display = 'none';
    renderDamageActionPlan(request);
    return;
  }

  // Show AI section for non-damage requests
  if (elements.aiResponseSection) elements.aiResponseSection.style.display = '';
  if (elements.damageDraftSection) elements.damageDraftSection.style.display = 'none';

  // Render action plan for this category
  renderActionPlan(request.category);

  // For impulse requests: show the pre-written message draft in the AI response area
  if (request.impulse?.messageDraft) {
    const draftLabel = request.impulse.messageDraft.channel === 'whatsapp' ? 'WhatsApp-Entwurf' : 'E-Mail-Entwurf';
    elements.aiResponseText.value = request.impulse.messageDraft.text;
    elements.aiStatus.textContent = draftLabel;
    elements.aiStatus.classList.remove('ai-status--loading');
  } else {
    await generateAIResponse(request);
  }

  // On mobile, switch to current view
  if (window.innerWidth <= 1024) {
    switchMobileView('current');
  }
}

// ========================================
// Year-End Business View
// ========================================

function renderYearEndView(request) {
  elements.requestDetail.querySelector('.request-detail__empty').style.display = 'none';
  elements.requestContent.style.display = 'none';

  // Remove any existing custom view
  const existing = elements.requestDetail.querySelector('.custom-list-view');
  if (existing) existing.remove();

  const view = document.createElement('div');
  view.className = 'custom-list-view';
  view.innerHTML = `
    <div class="custom-list-view__header">
      <div class="custom-list-view__title">
        <span class="custom-list-view__icon">📊</span>
        <div>
          <h2>Potenziale Jahresendgeschäft</h2>
          <p class="custom-list-view__subtitle">Mandanten mit Beratungspotenzial kontaktieren</p>
        </div>
      </div>
      <div class="custom-list-view__stats">
        <div class="stat-card">
          <span class="stat-card__value">${request.clients.length}</span>
          <span class="stat-card__label">Mandanten</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">${request.clients.filter(c => c.status === 'erledigt').length}</span>
          <span class="stat-card__label">Erledigt</span>
        </div>
        <div class="stat-card stat-card--highlight">
          <span class="stat-card__value">${request.clients.filter(c => c.status === 'offen').length}</span>
          <span class="stat-card__label">Offen</span>
        </div>
      </div>
    </div>
    <div class="custom-list-view__info">
      <p>${request.originalMessage}</p>
    </div>
    <div class="client-list">
      <div class="client-list__header">
        <span>Mandant</span>
        <span>Thema</span>
        <span>Potenzial</span>
        <span>Status</span>
      </div>
      ${request.clients.map((client, index) => `
        <div class="client-list__item ${state.selectedClient?.id === client.id ? 'client-list__item--active' : ''}"
             data-client-id="${client.id}" data-client-index="${index}">
          <div class="client-list__name">
            <span class="client-list__avatar">${client.name.charAt(0)}</span>
            <div>
              <strong>${client.name}</strong>
              <span class="client-list__age">${client.age} Jahre</span>
            </div>
          </div>
          <div class="client-list__topic">${client.topic}</div>
          <div class="client-list__potential">${client.potential}</div>
          <div class="client-list__status client-list__status--${client.status}">
            <span class="status-dot"></span>
            ${client.status === 'offen' ? 'Offen' : 'Erledigt'}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  elements.requestDetail.appendChild(view);

  // Add click handlers for clients
  view.querySelectorAll('.client-list__item').forEach(item => {
    item.addEventListener('click', () => {
      const clientId = item.dataset.clientId;
      const client = request.clients.find(c => c.id === clientId);
      if (client) {
        selectYearEndClient(client, request);
      }
    });
  });

  // Show general action plan
  renderActionPlan('yearEnd');

  // Set AI response to guidance message
  elements.aiResponseText.value = 'Wählen Sie einen Mandanten aus der Liste, um den individuellen Vorgehensplan und Beratungshinweise zu sehen.';
  elements.aiStatus.textContent = 'Bereit';
}

function selectYearEndClient(client, request) {
  state.selectedClient = client;

  // Update active state in list
  const listItems = elements.requestDetail.querySelectorAll('.client-list__item');
  listItems.forEach(item => {
    item.classList.toggle('client-list__item--active', item.dataset.clientId === client.id);
  });

  // Show personalized action plan
  renderActionPlan('yearEnd', client);

  // Show AI guidance for this specific client
  elements.aiResponseText.value = `Beratungshinweise für ${client.name} (${client.age} J.):\n\n` +
    `Thema: ${client.topic}\n` +
    `Potenzial: ${client.potential}\n\n` +
    `Empfohlene Gesprächseröffnung:\n` +
    `"Guten Tag ${client.name.split(' ')[1] ? 'Herr/Frau ' + client.name.split(' ').pop() : client.name}, ` +
    `im Rahmen unserer Jahresend-Beratung möchte ich mit Ihnen über ${client.topic.toLowerCase()} sprechen. ` +
    `Hier gibt es für Sie ein interessantes Potenzial von ${client.potential}."\n\n` +
    `Kontakt:\n📞 ${client.phone}\n📧 ${client.email}`;
  elements.aiStatus.textContent = 'KI-Empfehlung';
}

// ========================================
// Birthday View
// ========================================

function renderBirthdayView(request) {
  elements.requestDetail.querySelector('.request-detail__empty').style.display = 'none';
  elements.requestContent.style.display = 'none';

  // Remove any existing custom view
  const existing = elements.requestDetail.querySelector('.custom-list-view');
  if (existing) existing.remove();

  const view = document.createElement('div');
  view.className = 'custom-list-view';
  view.innerHTML = `
    <div class="custom-list-view__header">
      <div class="custom-list-view__title">
        <span class="custom-list-view__icon">🎂</span>
        <div>
          <h2>Heutige & kommende Geburtstage</h2>
          <p class="custom-list-view__subtitle">Mandanten zum Geburtstag gratulieren</p>
        </div>
      </div>
      <div class="custom-list-view__stats">
        <div class="stat-card stat-card--highlight">
          <span class="stat-card__value">${request.clients.filter(c => c.daysUntil === 0).length}</span>
          <span class="stat-card__label">Heute</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">${request.clients.filter(c => c.daysUntil > 0).length}</span>
          <span class="stat-card__label">Kommende Tage</span>
        </div>
      </div>
    </div>
    <div class="birthday-list">
      ${request.clients.map(client => `
        <div class="birthday-card ${state.selectedClient?.id === client.id ? 'birthday-card--active' : ''} ${client.daysUntil === 0 ? 'birthday-card--today' : ''}"
             data-client-id="${client.id}">
          <div class="birthday-card__left">
            <div class="birthday-card__avatar">
              <span>${client.name.charAt(0)}</span>
              ${client.daysUntil === 0 ? '<span class="birthday-card__badge">🎉</span>' : ''}
            </div>
            <div class="birthday-card__info">
              <strong>${client.name}</strong>
              <span class="birthday-card__detail">wird ${client.age} Jahre · Mandant seit ${client.since}</span>
              <span class="birthday-card__date">
                ${client.daysUntil === 0 ? '🎂 Heute!' : client.daysUntil === 1 ? '📅 Morgen' : `📅 In ${client.daysUntil} Tagen (${client.birthday})`}
              </span>
            </div>
          </div>
          <div class="birthday-card__arrow">→</div>
        </div>
      `).join('')}
    </div>
  `;

  elements.requestDetail.appendChild(view);

  // Add click handlers for clients
  view.querySelectorAll('.birthday-card').forEach(item => {
    item.addEventListener('click', () => {
      const clientId = item.dataset.clientId;
      const client = request.clients.find(c => c.id === clientId);
      if (client) {
        selectBirthdayClient(client, request);
      }
    });
  });

  // Show general guidance
  elements.actionPlanSection.style.display = 'none';
  elements.aiResponseText.value = 'Wählen Sie einen Mandanten aus, um Gratulationsmöglichkeiten zu sehen.';
  elements.aiStatus.textContent = 'Bereit';
}

function selectBirthdayClient(client, request) {
  state.selectedClient = client;

  // Update active state
  const cards = elements.requestDetail.querySelectorAll('.birthday-card');
  cards.forEach(card => {
    card.classList.toggle('birthday-card--active', card.dataset.clientId === client.id);
  });

  // Show birthday actions in right sidebar
  renderBirthdayActions(client);
}

function renderBirthdayActions(client) {
  // Use the action plan section for birthday greeting options
  elements.actionPlanSection.style.display = '';

  const header = elements.actionPlanSection.querySelector('.action-plan__header h3');
  header.innerHTML = `<span class="action-plan__icon">🎂</span> Gratulieren: ${client.name}`;
  elements.actionPlanProgress.textContent = '';

  elements.actionPlanList.innerHTML = '';

  const actions = [
    { icon: '📧', text: 'E-Mail senden', detail: `Geburtstags-E-Mail an ${client.email} senden`, type: 'email' },
    { icon: '💬', text: 'WhatsApp senden', detail: `Persönliche WhatsApp-Nachricht an ${client.phone}`, type: 'whatsapp' },
    { icon: '🤖', text: 'KI-Anruf starten', detail: 'KI ruft den Mandanten mit persönlichen Glückwünschen an', type: 'ai-call' },
    { icon: '📞', text: 'Selbst anrufen', detail: `Mandant anrufen: ${client.phone}`, type: 'phone' },
    { icon: '💌', text: 'Geburtstagskarte versenden', detail: 'Physische Glückwunschkarte über Druckservice', type: 'card' },
    { icon: '🎁', text: 'Gutschein beilegen', detail: 'Kleines Aufmerksamkeitsgeschenk per Post', type: 'gift' }
  ];

  actions.forEach(action => {
    const actionEl = document.createElement('div');
    actionEl.className = 'action-plan__step birthday-action';
    actionEl.innerHTML = `
      <div class="action-plan__checkbox birthday-action__icon">${action.icon}</div>
      <div class="action-plan__step-content">
        <div class="action-plan__text">${action.text}</div>
        <div class="action-plan__detail">${action.detail}</div>
      </div>
    `;

    actionEl.addEventListener('click', () => {
      actionEl.classList.toggle('action-plan__step--done');
      const checkbox = actionEl.querySelector('.birthday-action__icon');
      if (actionEl.classList.contains('action-plan__step--done')) {
        checkbox.innerHTML = '✓';
      } else {
        checkbox.innerHTML = action.icon;
      }
    });

    elements.actionPlanList.appendChild(actionEl);
  });

  // Generate greeting suggestion
  const isRound = client.age % 10 === 0;
  const greeting = isRound
    ? `Liebe/r ${client.name.split(' ')[1] ? 'Herr/Frau ' + client.name.split(' ').pop() : client.name},\n\nherzlichen Glückwunsch zum ${client.age}. Geburtstag! 🎉\n\nEin runder Geburtstag ist immer ein besonderer Anlass – und auch ein guter Zeitpunkt, um Ihre Absicherung auf den neuesten Stand zu bringen.\n\nIch würde mich freuen, bei einem kurzen Gespräch Ihre aktuelle Situation zu besprechen.\n\nAlles Gute und beste Gesundheit!\n\nMit herzlichen Grüßen\nIhr TELIS-Berater`
    : `Liebe/r ${client.name.split(' ')[1] ? 'Herr/Frau ' + client.name.split(' ').pop() : client.name},\n\nherzlichen Glückwunsch zum Geburtstag! 🎂\n\nIch wünsche Ihnen alles Gute, Gesundheit und Zufriedenheit für das neue Lebensjahr.\n\nBei Fragen rund um Ihre Absicherung stehe ich Ihnen jederzeit gerne zur Verfügung.\n\nHerzliche Grüße\nIhr TELIS-Berater`;

  elements.aiResponseText.value = greeting;
  elements.aiStatus.textContent = isRound ? '🎉 Runder Geburtstag!' : 'Vorlage';
}

// ========================================
// Rework / Nacharbeit View
// ========================================

function renderReworkView(request) {
  elements.requestDetail.querySelector('.request-detail__empty').style.display = 'none';
  elements.requestContent.style.display = 'none';

  // Remove any existing custom view
  const existing = elements.requestDetail.querySelector('.custom-list-view');
  if (existing) existing.remove();

  const urgentCount = request.documents.filter(d => d.priority === 'high').length;

  const view = document.createElement('div');
  view.className = 'custom-list-view';
  view.innerHTML = `
    <div class="custom-list-view__header">
      <div class="custom-list-view__title">
        <span class="custom-list-view__icon">📋</span>
        <div>
          <h2>Nacharbeit – Offene Dokumente</h2>
          <p class="custom-list-view__subtitle">Unterschriften & Unterlagen von Mandanten einholen</p>
        </div>
      </div>
      <div class="custom-list-view__stats">
        <div class="stat-card stat-card--highlight">
          <span class="stat-card__value">${request.documents.length}</span>
          <span class="stat-card__label">Offen</span>
        </div>
        ${urgentCount > 0 ? `
        <div class="stat-card stat-card--urgent">
          <span class="stat-card__value">${urgentCount}</span>
          <span class="stat-card__label">Dringend</span>
        </div>` : ''}
      </div>
    </div>
    <div class="custom-list-view__info">
      <p>${request.originalMessage}</p>
    </div>
    <div class="rework-list">
      ${request.documents.map(doc => `
        <div class="rework-card ${state.selectedClient?.id === doc.id ? 'rework-card--active' : ''} ${doc.priority === 'high' ? 'rework-card--urgent' : ''}"
             data-doc-id="${doc.id}">
          <div class="rework-card__top">
            <div class="rework-card__client">
              <span class="rework-card__avatar">${doc.clientName.charAt(0)}</span>
              <div>
                <strong>${doc.clientName}</strong>
                <span class="rework-card__company">${doc.company}</span>
              </div>
            </div>
            <div class="rework-card__deadline ${doc.priority === 'high' ? 'rework-card__deadline--urgent' : ''}">
              <span>⏳</span> Frist: ${doc.deadline}
            </div>
          </div>
          <div class="rework-card__body">
            <div class="rework-card__doc-type">
              <span>📄</span> ${doc.documentType}
            </div>
            <div class="rework-card__contract">Vertrag: ${doc.contractNumber}</div>
            <p class="rework-card__description">${doc.description}</p>
          </div>
          <div class="rework-card__footer">
            <span class="rework-card__status rework-card__status--${doc.status}">
              <span class="status-dot"></span>
              ${doc.status === 'offen' ? 'Offen' : 'Erledigt'}
            </span>
            <span class="rework-card__arrow">→</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  elements.requestDetail.appendChild(view);

  // Add click handlers
  view.querySelectorAll('.rework-card').forEach(card => {
    card.addEventListener('click', () => {
      const docId = card.dataset.docId;
      const doc = request.documents.find(d => d.id === docId);
      if (doc) {
        selectReworkDocument(doc, request);
      }
    });
  });

  // Show general guidance
  elements.actionPlanSection.style.display = 'none';
  elements.aiResponseText.value = 'Wählen Sie einen Vorgang aus, um die Bearbeitungsschritte und Kontaktmöglichkeiten zu sehen.';
  elements.aiStatus.textContent = 'Bereit';
}

function selectReworkDocument(doc, request) {
  state.selectedClient = { id: doc.id };

  // Update active state
  const cards = elements.requestDetail.querySelectorAll('.rework-card');
  cards.forEach(card => {
    card.classList.toggle('rework-card--active', card.dataset.docId === doc.id);
  });

  // Show rework actions
  renderReworkActions(doc);
}

function renderReworkActions(doc) {
  elements.actionPlanSection.style.display = '';

  const header = elements.actionPlanSection.querySelector('.action-plan__header h3');
  header.innerHTML = `<span class="action-plan__icon">📋</span> Nacharbeit: ${doc.clientName}`;
  elements.actionPlanProgress.textContent = '0/6';

  elements.actionPlanList.innerHTML = '';

  const steps = [
    { icon: '📞', text: 'Mandant kontaktieren', detail: `${doc.clientName} anrufen: ${doc.clientPhone}` },
    { icon: '📄', text: 'Dokument vorbereiten', detail: `${doc.documentType} zum Versand vorbereiten` },
    { icon: '✉️', text: 'Zur Unterschrift zusenden', detail: 'Per E-Mail, Post oder persönliche Übergabe' },
    { icon: '✍️', text: 'Unterschriebenes Dokument einsammeln', detail: 'Rücklauf des Dokuments sicherstellen' },
    { icon: '📤', text: 'An Gesellschaft zurücksenden', detail: `Unterschriebenes Dokument an ${doc.company} senden` },
    { icon: '✅', text: 'Vorgang abschließen', detail: 'Bestätigung der Gesellschaft abwarten und dokumentieren' }
  ];

  steps.forEach(step => {
    const stepEl = document.createElement('div');
    stepEl.className = 'action-plan__step rework-action';
    stepEl.innerHTML = `
      <div class="action-plan__checkbox rework-action__icon">${step.icon}</div>
      <div class="action-plan__step-content">
        <div class="action-plan__text">${step.text}</div>
        <div class="action-plan__detail">${step.detail}</div>
      </div>
    `;

    stepEl.addEventListener('click', () => {
      stepEl.classList.toggle('action-plan__step--done');
      const checkbox = stepEl.querySelector('.rework-action__icon');
      if (stepEl.classList.contains('action-plan__step--done')) {
        checkbox.innerHTML = '✓';
      } else {
        checkbox.innerHTML = step.icon;
      }
      // Update progress
      const total = elements.actionPlanList.children.length;
      const done = elements.actionPlanList.querySelectorAll('.action-plan__step--done').length;
      elements.actionPlanProgress.textContent = `${done}/${total}`;
    });

    elements.actionPlanList.appendChild(stepEl);
  });

  // Generate client message
  const lastName = doc.clientName.split(' ').pop();
  elements.aiResponseText.value = `Sehr geehrte/r Herr/Frau ${lastName},\n\nim Rahmen Ihres Versicherungsantrags bei der ${doc.company} (Vertragsnr.: ${doc.contractNumber}) benötigen wir noch Ihre Unterschrift auf folgendem Dokument:\n\n📄 ${doc.documentType}\n\n${doc.description}\n\n⏳ Bitte senden Sie das unterschriebene Dokument bis zum ${doc.deadline} an uns zurück.\n\nSie haben folgende Möglichkeiten:\n• Digitale Unterschrift per E-Mail\n• Persönliche Übergabe im Büro\n• Per Post an unsere Adresse\n\nBei Fragen stehe ich Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen\nIhr TELIS-Berater\n\nKontakt: ${doc.clientPhone} | ${doc.clientEmail}`;
  elements.aiStatus.textContent = 'Vorlage';
}

// ========================================
// Intelligente Datenextraktion
// ========================================

function renderExtractedDataPanel(request) {
  if (!request.extractedData) {
    elements.extractionSection.style.display = 'none';
    return;
  }

  const status = state.extractionStatus[request.id] || 'pending';
  if (status === 'rejected' || status === 'undone') {
    elements.extractionSection.style.display = 'none';
    return;
  }

  elements.extractionSection.style.display = 'block';
  const data = request.extractedData;
  const clientProfile = state.finanzanalysen[request.sender.name] || {};

  if (status === 'pending') {
    elements.extractionPanel.innerHTML = `
      <div class="extraction-card">
        <div class="extraction-card__header">
          <span class="extraction-card__icon">🔍</span>
          <span class="extraction-card__title">Erkannte Daten · ${data.documentType}</span>
        </div>
        <div class="extraction-card__fields">
          ${data.fields.map(f => {
            const oldVal = clientProfile[f.key];
            const oldDisplay = oldVal ? `<span class="extraction-field__old">${oldVal}</span>` : `<span class="extraction-field__old extraction-field__old--empty">nicht erfasst</span>`;
            return `
              <label class="extraction-field">
                <input type="checkbox" class="extraction-field__checkbox" data-key="${f.key}" checked>
                <div class="extraction-field__content">
                  <span class="extraction-field__label">${f.label}</span>
                  <div class="extraction-field__values">
                    ${oldDisplay}
                    <span class="extraction-field__arrow">→</span>
                    <span class="extraction-field__new">${f.newValue}</span>
                  </div>
                </div>
              </label>`;
          }).join('')}
        </div>
        <div class="extraction-card__footer">
          <span class="extraction-card__confidence">KI-Konfidenz: ${data.fields[0]?.confidence || 'hoch'}</span>
          <div class="extraction-card__actions">
            <button class="extraction-btn extraction-btn--ghost" id="extractionRejectBtn">Ablehnen</button>
            <button class="extraction-btn extraction-btn--primary" id="extractionAcceptBtn">Übernehmen →</button>
          </div>
        </div>
      </div>`;

    document.getElementById('extractionRejectBtn').addEventListener('click', () => {
      state.extractionStatus[request.id] = 'rejected';
      elements.extractionSection.style.display = 'none';
    });

    document.getElementById('extractionAcceptBtn').addEventListener('click', () => {
      const checkboxes = elements.extractionPanel.querySelectorAll('.extraction-field__checkbox');
      const selectedKeys = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.dataset.key);
      if (selectedKeys.length > 0) applyExtraction(request, selectedKeys);
    });

  } else if (status === 'accepted') {
    const snap = state.extractionSnapshots[request.id];
    const appliedFields = data.fields.filter(f => snap?.applied?.includes(f.key));

    elements.extractionPanel.innerHTML = `
      <div class="extraction-card extraction-card--accepted">
        <div class="extraction-card__header">
          <span class="extraction-card__icon">✅</span>
          <span class="extraction-card__title">Finanzanalyse aktualisiert · ${data.documentType}</span>
        </div>
        <div class="extraction-card__applied">
          ${appliedFields.map(f => `
            <div class="extraction-applied-row">
              <span class="extraction-applied-row__label">${f.label}</span>
              <span class="extraction-applied-row__arrow">→</span>
              <span class="extraction-applied-row__value">${f.newValue}</span>
            </div>`).join('')}
        </div>
        <div class="extraction-card__undo-row">
          <button class="extraction-btn extraction-btn--ghost" id="extractionUndoBtn">Rückgängig machen</button>
        </div>
      </div>`;

    const undoBtn = document.getElementById('extractionUndoBtn');
    undoBtn.addEventListener('click', () => undoExtraction(request));
    setTimeout(() => { if (document.getElementById('extractionUndoBtn')) undoBtn.style.opacity = '0'; }, 28000);
    setTimeout(() => { if (document.getElementById('extractionUndoBtn')) undoBtn.style.display = 'none'; }, 30000);
  }
}

function applyExtraction(request, selectedKeys) {
  const clientProfile = state.finanzanalysen[request.sender.name] || {};
  const snapshot = {};
  selectedKeys.forEach(key => { snapshot[key] = clientProfile[key] ?? null; });

  state.extractionSnapshots[request.id] = { applied: selectedKeys, snapshot };

  if (!state.finanzanalysen[request.sender.name]) state.finanzanalysen[request.sender.name] = {};
  request.extractedData.fields.forEach(f => {
    if (selectedKeys.includes(f.key)) state.finanzanalysen[request.sender.name][f.key] = f.newValue;
  });

  state.extractionStatus[request.id] = 'accepted';
  renderExtractedDataPanel(request);
}

function undoExtraction(request) {
  const snap = state.extractionSnapshots[request.id];
  if (!snap) return;
  Object.entries(snap.snapshot).forEach(([key, val]) => {
    state.finanzanalysen[request.sender.name][key] = val;
  });
  state.extractionStatus[request.id] = 'undone';
  elements.extractionSection.style.display = 'none';
}

// Generate AI response for the selected request
async function generateAIResponse(request) {
  elements.aiStatus.textContent = 'Generiere...';
  elements.aiStatus.classList.add('ai-status--loading');
  elements.aiResponseText.value = '';
  elements.aiResponseText.placeholder = 'KI-Antwort wird generiert...';

  const result = await generateResponse(request);

  elements.aiStatus.classList.remove('ai-status--loading');

  if (result.success) {
    elements.aiResponseText.value = result.response;
    elements.aiStatus.textContent = result.source === 'ai' ? 'KI generiert' : 'Template';

    if (result.error) {
      elements.aiStatus.textContent = 'Fallback (API-Fehler)';
    }
  } else {
    elements.aiResponseText.value = 'Fehler bei der Generierung. Bitte versuchen Sie es erneut.';
    elements.aiStatus.textContent = 'Fehler';
  }
}

// Render templates list
function renderTemplates() {
  elements.templateList.innerHTML = templates.map(template => `
    <div class="template-item" data-template-id="${template.id}">
      <div class="template-item__title">${template.title}</div>
      <div class="template-item__preview">${template.content.substring(0, 80)}...</div>
    </div>
  `).join('');

  // Add click handlers
  elements.templateList.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      const templateId = item.dataset.templateId;
      applyTemplate(templateId);
    });
  });
}

// Apply a template to the response
function applyTemplate(templateId) {
  const template = templates.find(t => t.id === templateId);
  if (!template || !state.selectedRequest) return;

  let content = template.content;

  // Fill in sender name
  const lastName = state.selectedRequest.sender.name.split(' ').pop();
  const firstName = state.selectedRequest.sender.name.split(' ')[0];
  const salutation = firstName === 'Familie' ? state.selectedRequest.sender.name : `Herr/Frau ${lastName}`;
  content = content.replace('[NAME]', salutation);

  // Fill in appointment if relevant
  if (state.selectedRequest.category === 'appointment') {
    const appointment = getAppointmentSuggestion();
    content = content
      .replace('[DATUM]', `${appointment.day}, ${appointment.date.split('-').reverse().join('.')}`)
      .replace('[UHRZEIT]', `${appointment.time} Uhr`);
  }

  elements.aiResponseText.value = content;
  elements.aiStatus.textContent = 'Template angewendet';
}

// Render answered requests
function renderAnsweredList() {
  elements.answeredCount.textContent = state.answeredRequests.length;

  if (state.answeredRequests.length === 0) {
    elements.answeredList.innerHTML = '<div class="answered-list__empty">Noch keine beantworteten Anfragen</div>';
    return;
  }

  elements.answeredList.innerHTML = state.answeredRequests.map(request => {
    const channel = channels[request.channel];
    return `
      <div class="answered-item" data-answered-id="${request.id}">
        <div class="answered-item__top">
          <div class="answered-item__icon">${channel.icon}</div>
          <div class="answered-item__content">
            <div class="answered-item__sender">${request.sender.name}</div>
            <div class="answered-item__time">Beantwortet ${formatTimeAgo(request.answeredAt)}</div>
          </div>
          <div class="answered-item__check">✓</div>
        </div>
        <button class="btn-archive" data-archive-id="${request.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          Archivieren
        </button>
      </div>
    `;
  }).join('');

  // Add archive button click handlers
  elements.answeredList.querySelectorAll('.btn-archive').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const requestId = parseInt(btn.dataset.archiveId);
      showArchiveModal(requestId);
    });
  });
}

// Send response and mark as answered
function sendResponse() {
  if (!state.selectedRequest) return;

  const responseText = elements.aiResponseText.value.trim();
  if (!responseText) {
    alert('Bitte geben Sie eine Antwort ein.');
    return;
  }

  // Mark as answered
  state.selectedRequest.answered = true;
  state.selectedRequest.answeredAt = new Date();
  state.selectedRequest.response = responseText;

  // Move to answered list
  state.answeredRequests.unshift(state.selectedRequest);

  // Clear selection
  state.selectedRequest = null;

  // Reset detail view
  elements.requestDetail.querySelector('.request-detail__empty').style.display = 'flex';
  elements.requestContent.style.display = 'none';

  // Update lists
  renderRequestList();
  renderAnsweredList();

  // Show success feedback
  showNotification('Antwort erfolgreich gesendet! ✓');
}

// Show archive confirmation modal
function showArchiveModal(requestId) {
  const request = state.answeredRequests.find(r => r.id === requestId);
  if (!request) return;

  const modal = document.createElement('div');
  modal.className = 'archive-modal-overlay';
  modal.innerHTML = `
    <div class="archive-modal">
      <div class="archive-modal__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      </div>
      <h3>Vorgang archivieren</h3>
      <p>Möchten Sie den Vorgang von <strong>${request.sender.name}</strong> archivieren?</p>
      <p class="archive-modal__sub">Der Vorgang wird ins Online-System übertragen und in der Akte hinterlegt.</p>
      <div class="archive-modal__actions">
        <button class="btn btn--secondary" id="archiveCancelBtn">Abbrechen</button>
        <button class="btn btn--primary" id="archiveConfirmBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          Archivieren
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => modal.classList.add('archive-modal-overlay--visible'));

  // Cancel
  modal.querySelector('#archiveCancelBtn').addEventListener('click', () => {
    modal.classList.remove('archive-modal-overlay--visible');
    setTimeout(() => modal.remove(), 250);
  });

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('archive-modal-overlay--visible');
      setTimeout(() => modal.remove(), 250);
    }
  });

  // Confirm archive
  modal.querySelector('#archiveConfirmBtn').addEventListener('click', () => {
    archiveRequest(requestId);
    modal.classList.remove('archive-modal-overlay--visible');
    setTimeout(() => modal.remove(), 250);
  });
}

// Archive a request (remove from answered list)
function archiveRequest(requestId) {
  state.answeredRequests = state.answeredRequests.filter(r => r.id !== requestId);
  renderAnsweredList();
  showNotification('Vorgang erfolgreich archiviert 📁');
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: var(--color-primary);
    color: white;
    border-radius: 8px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideUp 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Setup event listeners
function setupEventListeners() {
  // Badge toggle filter (count ↔ 🔥)
  const badgeEl = document.getElementById('requestCount');

  // Global toggle function (for inline onclick fallback)
  window.toggleBadgeFilter = function () {
    const badge = document.getElementById('requestCount');
    if (!badge) return;

    if (state.currentFilter === 'all') {
      state.currentFilter = 'high';
      badge.classList.add('badge--urgent');
      badge.textContent = '🔥';
    } else {
      state.currentFilter = 'all';
      badge.classList.remove('badge--urgent');
    }
    renderRequestList();
  };

  if (badgeEl) {
    badgeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleBadgeFilter();
    });
  }

  // Regenerate button
  elements.regenerateBtn.addEventListener('click', async () => {
    if (state.selectedRequest) {
      await generateAIResponse(state.selectedRequest);
    }
  });

  // Send response button
  elements.sendResponseBtn.addEventListener('click', sendResponse);

  // Chat interactions
  elements.sendMessageBtn.addEventListener('click', sendChatMessage);
  elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });

  // Double-click on AI status to configure API key
  elements.aiStatus.addEventListener('dblclick', () => {
    if (showApiKeyDialog()) {
      if (state.selectedRequest) {
        generateAIResponse(state.selectedRequest);
      }
    }
  });

  // New Process Modal logic
  const newProcessBtn = document.getElementById('newProcessBtn');
  const newProcessModal = document.getElementById('newProcessModal');
  const closeProcessModalBtn = document.getElementById('closeProcessModalBtn');

  if (newProcessBtn && newProcessModal && closeProcessModalBtn) {
    newProcessBtn.addEventListener('click', () => {
      newProcessModal.style.display = 'flex';
      // Small timeout for the transition to take effect after display:flex
      setTimeout(() => newProcessModal.classList.add('new-process-overlay--visible'), 10);
    });

    const closeProcessModal = () => {
      newProcessModal.classList.remove('new-process-overlay--visible');
      setTimeout(() => newProcessModal.style.display = 'none', 250);
    };

    closeProcessModalBtn.addEventListener('click', closeProcessModal);

    newProcessModal.addEventListener('click', (e) => {
      if (e.target === newProcessModal) closeProcessModal();
    });

    document.querySelectorAll('.process-item').forEach(item => {
      item.addEventListener('click', () => {
        closeProcessModal();
        const processType = item.querySelector('.process-item__title').textContent;
        setTimeout(() => {
          showNotification(`Neuer Vorgang gestartet: ${processType} 🚀`);
        }, 300);
      });
    });
  }
}

// Send a chat message
async function sendChatMessage() {
  const text = elements.chatInput.value.trim();
  if (!text) return;

  // Add user message
  addChatMessage(text, 'user');
  elements.chatInput.value = '';

  // Simulate AI processing
  // In a real app, this would call an API
  // For now, we'll just acknowledge the input
  setTimeout(() => {
    addChatMessage('Ich habe Ihre Nachricht erhalten. Wie soll ich darauf reagieren? Ich kann den Antwortvorschlag rechts anpassen oder Fragen zur Nachricht beantworten.', 'ai');
  }, 1000);
}

// Add a message to the chat / feed
function addChatMessage(text, sender) {
  const type = sender === 'user' ? 'broker' : 'system';
  const html = renderMessageBubble(type, text, new Date(), 'Lars Ritzmann');
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const el = tmp.firstElementChild;
  if (el && elements.messageFeed) {
    elements.messageFeed.appendChild(el);
    if (elements.requestDetail) {
      elements.requestDetail.scrollTop = elements.requestDetail.scrollHeight;
    }
  }
}

// ========================================
// Messenger Feed
// ========================================

function renderMessageFeed(request) {
  if (!elements.messageFeed) return;

  const allMessages = [...(request.history ?? [])];

  // The current client message
  allMessages.push({
    type: 'client',
    text: request.originalMessage,
    timestamp: request.timestamp,
    senderName: request.sender.name
  });

  // Sort by timestamp ascending
  allMessages.sort((a, b) => a.timestamp - b.timestamp);

  // AI summary as system pill at the end
  allMessages.push({
    type: 'system',
    text: `KI: ${request.summary}`,
    timestamp: new Date(request.timestamp.getTime() + 60000)
  });

  elements.messageFeed.innerHTML = allMessages
    .map(m => renderMessageBubble(m.type, m.text, m.timestamp, m.senderName ?? request.sender.name))
    .join('');

  // Scroll to show the last message
  setTimeout(() => {
    if (elements.requestDetail) {
      elements.requestDetail.scrollTop = elements.messageFeed.offsetTop + elements.messageFeed.offsetHeight;
    }
  }, 50);
}

function renderMessageBubble(type, text, timestamp, senderName) {
  const safeText = (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  const timeStr = timestamp
    ? timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    : '';
  const dateStr = timestamp
    ? timestamp.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
    : '';
  const fullTime = timestamp ? `${dateStr} · ${timeStr}` : '';

  if (type === 'system') {
    return `<div class="msg msg--system"><div class="msg__bubble">${safeText}</div></div>`;
  }

  if (type === 'client') {
    const initial = (senderName || '?').charAt(0).toUpperCase();
    return `<div class="msg msg--client">
      <div class="msg__avatar">
        <div class="msg__avatar-circle">${initial}</div>
        <span class="msg__sender">${senderName || ''}</span>
      </div>
      <div class="msg__bubble">${safeText}</div>
      <div class="msg__time">${fullTime}</div>
    </div>`;
  }

  if (type === 'broker') {
    return `<div class="msg msg--broker">
      <div class="msg__sender">Sie</div>
      <div class="msg__bubble">${safeText}</div>
      <div class="msg__time">${fullTime}</div>
    </div>`;
  }

  return '';
}

// ========================================
// Action Plan
// ========================================

function renderActionPlan(category) {
  const steps = actionPlans[category];
  if (!steps || steps.length === 0) {
    elements.actionPlanSection.style.display = 'none';
    return;
  }

  elements.actionPlanSection.style.display = '';
  elements.actionPlanList.innerHTML = '';

  steps.forEach((step, index) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'action-plan__step';
    stepEl.dataset.index = index;
    stepEl.innerHTML = `
      <div class="action-plan__checkbox"></div>
      <div class="action-plan__step-content">
        <div class="action-plan__text">${step.text}</div>
        ${step.detail ? `<div class="action-plan__detail">${step.detail}</div>` : ''}
      </div>
    `;

    stepEl.addEventListener('click', () => {
      stepEl.classList.toggle('action-plan__step--done');
      const checkbox = stepEl.querySelector('.action-plan__checkbox');
      if (stepEl.classList.contains('action-plan__step--done')) {
        checkbox.innerHTML = '✓';
      } else {
        checkbox.innerHTML = '';
      }
      updateActionPlanProgress();
    });

    elements.actionPlanList.appendChild(stepEl);
  });

  updateActionPlanProgress();
}

function updateActionPlanProgress() {
  const total = elements.actionPlanList.children.length;
  const done = elements.actionPlanList.querySelectorAll('.action-plan__step--done').length;
  elements.actionPlanProgress.textContent = `${done}/${total}`;
}

// ========================================
// Damage Action Plan (Schadensmeldung)
// ========================================

const STEP_NUMBERS = ['①', '②', '③', '④', '⑤'];

function renderDamageActionPlan(request) {
  const steps = actionPlans.damage;

  // Init state if first time
  if (!state.damageSteps[request.id]) {
    state.damageSteps[request.id] = steps.map(() => 'pending');
  }
  const stepStatuses = state.damageSteps[request.id];

  elements.actionPlanSection.style.display = '';
  elements.actionPlanProgress.textContent = '';

  const header = elements.actionPlanSection.querySelector('.action-plan__header h3');
  header.innerHTML = `<span class="action-plan__icon">📋</span> Vorgehensplan`;

  elements.actionPlanList.innerHTML = steps.map((step, i) => {
    const status = stepStatuses[i];
    const isSent = status === 'sent';
    const isBlocked = status === 'blocked';
    const isSelected = status === 'selected';
    const isClickable = !isSent && !isBlocked;

    let indicator;
    if (isSent) indicator = '✓';
    else if (isBlocked) indicator = '🔒';
    else indicator = STEP_NUMBERS[i];

    return `
      <div class="damage-step damage-step--${status} ${isClickable ? 'damage-step--clickable' : ''}"
           data-step-index="${i}" ${!isClickable ? 'aria-disabled="true"' : ''}>
        <div class="damage-step__indicator">${indicator}</div>
        <div class="damage-step__content">
          <div class="damage-step__text">${step.text}</div>
          <div class="damage-step__recipient">An: ${step.recipient}</div>
        </div>
      </div>`;
  }).join('');

  // Wire click handlers
  elements.actionPlanList.querySelectorAll('.damage-step--clickable').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.stepIndex);
      // Deselect any previously selected
      const prev = stepStatuses.indexOf('selected');
      if (prev !== -1) stepStatuses[prev] = 'pending';
      stepStatuses[idx] = 'selected';
      renderDamageActionPlan(request);
      renderDamageDraft(request, idx);
    });
  });
}

function renderDamageDraft(request, stepIndex) {
  const step = actionPlans.damage[stepIndex];
  const draftText = step.draft(request);

  elements.damageDraftSection.style.display = 'block';
  elements.damageDraftPanel.innerHTML = `
    <div class="damage-draft">
      <div class="damage-draft__header">
        <span class="damage-draft__step">Schritt ${stepIndex + 1} · ${step.text}</span>
        <span class="damage-draft__recipient">An: ${step.recipient}</span>
      </div>
      <textarea class="damage-draft__textarea" id="damageDraftText">${draftText}</textarea>
      <div class="damage-draft__actions">
        <button class="btn btn--secondary" id="damageDraftCancelBtn">Abbrechen</button>
        <button class="btn btn--primary" id="damageDraftSendBtn">
          Absenden →
        </button>
      </div>
    </div>`;

  document.getElementById('damageDraftCancelBtn').addEventListener('click', () => {
    const statuses = state.damageSteps[request.id];
    if (statuses[stepIndex] === 'selected') statuses[stepIndex] = 'pending';
    elements.damageDraftSection.style.display = 'none';
    renderDamageActionPlan(request);
  });

  document.getElementById('damageDraftSendBtn').addEventListener('click', () => {
    sendDamageStep(request, stepIndex);
  });
}

function sendDamageStep(request, stepIndex) {
  const statuses = state.damageSteps[request.id];
  statuses[stepIndex] = 'sent';

  const step = actionPlans.damage[stepIndex];
  if (step.blocksOnSend) {
    step.blocksOnSend.forEach(i => { statuses[i] = 'blocked'; });
  }

  elements.damageDraftSection.style.display = 'none';
  renderDamageActionPlan(request);

  // Append system message to feed
  const systemText = `${STEP_NUMBERS[stepIndex]} Gesendet: ${step.text} · An: ${step.recipient}`;
  const html = renderMessageBubble('system', systemText, new Date());
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const el = tmp.firstElementChild;
  if (el && elements.messageFeed) {
    elements.messageFeed.appendChild(el);
    if (elements.requestDetail) {
      elements.requestDetail.scrollTop = elements.requestDetail.scrollHeight;
    }
  }

  showNotification('Nachricht gesendet ✓');
}

// Mobile navigation
function setupMobileNav() {
  document.querySelectorAll('.mobile-nav__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchMobileView(view);
    });
  });
}

function switchMobileView(view) {
  state.currentView = view;

  // Update nav buttons
  document.querySelectorAll('.mobile-nav__btn').forEach(btn => {
    btn.classList.toggle('mobile-nav__btn--active', btn.dataset.view === view);
  });

  // Hide all panels
  document.querySelector('.sidebar--left').classList.remove('is-visible');
  document.querySelector('.sidebar--right').classList.remove('is-visible');
  document.querySelector('.main-content').classList.remove('is-visible');

  // Show selected panel
  switch (view) {
    case 'requests':
      document.querySelector('.sidebar--left').classList.add('is-visible');
      break;
    case 'current':
      document.querySelector('.main-content').classList.add('is-visible');
      break;
    case 'templates':
      document.querySelector('.sidebar--right').classList.add('is-visible');
      break;
  }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);

// ========================================
// Resizable Columns
// ========================================

function setupResizeHandles() {
  const dashboard = document.querySelector('.dashboard');
  const handleLeft = document.getElementById('resizeHandleLeft');
  const handleRight = document.getElementById('resizeHandleRight');
  const leftSidebar = document.querySelector('.sidebar--left');
  const rightSidebar = document.querySelector('.sidebar--right');

  const HANDLE_WIDTH = 6;
  const MIN_LEFT = 200;
  const MIN_RIGHT = 220;
  const MIN_CENTER = 300;

  let activeHandle = null;
  let startX = 0;
  let startLeftW = 0;
  let startRightW = 0;

  function getColWidths() {
    return {
      leftW: leftSidebar.getBoundingClientRect().width,
      rightW: rightSidebar.getBoundingClientRect().width,
      totalW: dashboard.getBoundingClientRect().width
    };
  }

  function applyGrid(leftW, rightW) {
    dashboard.style.gridTemplateColumns =
      `${leftW}px ${HANDLE_WIDTH}px 1fr ${HANDLE_WIDTH}px ${rightW}px`;
  }

  function onMouseDown(e, handle) {
    e.preventDefault();
    activeHandle = handle;
    startX = e.clientX;
    const widths = getColWidths();
    startLeftW = widths.leftW;
    startRightW = widths.rightW;

    handle.classList.add('resize-handle--active');
    dashboard.classList.add('dashboard--resizing');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (!activeHandle) return;
    const dx = e.clientX - startX;
    const { totalW } = getColWidths();
    const available = totalW - 2 * HANDLE_WIDTH;

    if (activeHandle === handleLeft) {
      let newLeftW = Math.max(MIN_LEFT, startLeftW + dx);
      // ensure center doesn't go below min
      const centerW = available - newLeftW - startRightW;
      if (centerW < MIN_CENTER) {
        newLeftW = available - MIN_CENTER - startRightW;
      }
      if (newLeftW >= MIN_LEFT) {
        applyGrid(newLeftW, startRightW);
      }
    } else if (activeHandle === handleRight) {
      let newRightW = Math.max(MIN_RIGHT, startRightW - dx);
      // ensure center doesn't go below min
      const centerW = available - startLeftW - newRightW;
      if (centerW < MIN_CENTER) {
        newRightW = available - MIN_CENTER - startLeftW;
      }
      if (newRightW >= MIN_RIGHT) {
        applyGrid(startLeftW, newRightW);
      }
    }
  }

  function onMouseUp() {
    if (activeHandle) {
      activeHandle.classList.remove('resize-handle--active');
    }
    activeHandle = null;
    dashboard.classList.remove('dashboard--resizing');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  handleLeft.addEventListener('mousedown', (e) => onMouseDown(e, handleLeft));
  handleRight.addEventListener('mousedown', (e) => onMouseDown(e, handleRight));
}

// Setup search functionality
function setupSearch() {
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderRequestList();
    });
  }
}

// Initialize when DOM is ready
let initialized = false;
document.addEventListener('DOMContentLoaded', () => {
  if (!initialized) {
    initialized = true;
    init();
  }
});

// Also init immediately if DOM already loaded
if (document.readyState !== 'loading' && !initialized) {
  initialized = true;
  init();
}
