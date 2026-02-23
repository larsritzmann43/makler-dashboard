// Main application entry point

import './style.css';
import {
  mockRequests,
  channels,
  categories,
  priorities,
  getSortedRequests,
  formatTimeAgo,
  formatDateTime
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
    { text: 'Versicherer informieren', detail: 'Schadenmeldung per E-Mail an zuständigen Versicherer senden' },
    { text: 'Schadenformulare an Kunden senden', detail: 'Formular-Download-Link oder PDF per Antwort mitschicken' },
    { text: 'Schaden dokumentieren lassen', detail: 'Kunde auffordern, Fotos und Belege zu sichern' },
    { text: 'Gutachter beauftragen (falls nötig)', detail: 'Bei höheren Schäden Gutachtentermin einleiten' },
    { text: 'Kunden über Status informieren', detail: 'Follow-up nach 48h planen' }
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
  ]
};

// Application State
const state = {
  requests: [...mockRequests],
  answeredRequests: [],
  selectedRequest: null,
  currentFilter: 'all',
  currentView: 'requests' // for mobile
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
  channelIcon: document.getElementById('channelIcon'),
  channelName: document.getElementById('channelName'),
  priorityBadge: document.getElementById('priorityBadge'),
  senderName: document.getElementById('senderName'),
  senderDetails: document.getElementById('senderDetails'),
  requestTime: document.getElementById('requestTime'),
  requestCategory: document.getElementById('requestCategory'),
  requestSummary: document.getElementById('requestSummary'),
  originalMessage: document.getElementById('originalMessage'),
  appointmentSuggestion: document.getElementById('appointmentSuggestion'),
  suggestedDate: document.getElementById('suggestedDate'),
  suggestedTime: document.getElementById('suggestedTime'),
  aiResponseText: document.getElementById('aiResponseText'),
  aiStatus: document.getElementById('aiStatus'),
  regenerateBtn: document.getElementById('regenerateBtn'),
  sendResponseBtn: document.getElementById('sendResponseBtn'),

  // Chat elements
  chatMessages: document.getElementById('chatMessages'),
  chatInput: document.getElementById('chatInput'),
  sendMessageBtn: document.getElementById('sendMessageBtn'),

  // Action plan elements
  actionPlanSection: document.getElementById('actionPlanSection'),
  actionPlanList: document.getElementById('actionPlanList'),
  actionPlanProgress: document.getElementById('actionPlanProgress')
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
    if (state.currentFilter === 'all') return true;
    const category = categories[request.category];
    const priority = category.priority;
    return priority === state.currentFilter;
  });

  elements.requestCount.textContent = filteredRequests.length;

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
            <span class="request-item__time">${formatTimeAgo(request.timestamp)}</span>
          </div>
          <div class="request-item__preview">${request.preview}</div>
          <div class="request-item__footer">
            <span class="request-item__category">${category.name}</span>
            <span class="request-item__priority request-item__priority--${priority}"></span>
          </div>
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
  renderRequestList(); // Update active state

  const channel = channels[request.channel];
  const category = categories[request.category];
  const priority = category.priority;

  // Hide empty state, show content
  elements.requestDetail.querySelector('.request-detail__empty').style.display = 'none';
  elements.requestContent.style.display = 'block';

  // Fill in details
  elements.channelIcon.textContent = channel.icon;
  elements.channelName.textContent = channel.name;

  elements.priorityBadge.textContent = priorities[priority].label;
  elements.priorityBadge.className = `priority-badge priority-badge--${priority}`;

  elements.senderName.textContent = request.sender.name;
  elements.senderDetails.textContent = request.sender.details;
  elements.requestTime.textContent = formatDateTime(request.timestamp);

  elements.requestCategory.textContent = `${category.icon} ${category.name}`;
  elements.requestSummary.textContent = request.summary;
  elements.originalMessage.textContent = request.originalMessage;

  // Show appointment suggestion for appointment requests
  if (request.category === 'appointment') {
    const appointment = getAppointmentSuggestion();
    elements.appointmentSuggestion.style.display = 'block';
    elements.suggestedDate.textContent = `${appointment.day}, ${appointment.date.split('-').reverse().join('.')}`;
    elements.suggestedTime.textContent = `${appointment.time} Uhr`;
  } else {
    elements.appointmentSuggestion.style.display = 'none';
  }

  // Render action plan for this category
  renderActionPlan(request.category);

  // Generate AI response
  await generateAIResponse(request);

  // On mobile, switch to current view
  if (window.innerWidth <= 1024) {
    switchMobileView('current');
  }
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
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      state.currentFilter = btn.dataset.filter;
      renderRequestList();
    });
  });

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

// Add a message to the chat
function addChatMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message chat-message--${sender}`;
  messageDiv.textContent = text;
  elements.chatMessages.appendChild(messageDiv);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Also init immediately if DOM already loaded
if (document.readyState !== 'loading') {
  init();
}
