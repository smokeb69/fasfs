#!/usr/bin/env node
/**
 * BLOOMCRAWLER RIIS - HTML Dashboard Patcher
 * Replaces ALL localStorage calls with API calls
 */

const fs = require('fs');
const path = require('path');

function patchHTML(htmlContent, port) {
  let patched = htmlContent;

  // Replace port references
  patched = patched
    .replace(/http:\/\/127\.0\.0\.1:5001/g, `http://127.0.0.1:${port}`)
    .replace(/http:\/\/localhost:5001/g, `http://localhost:${port}`)
    .replace(/io\('http:\/\/127\.0\.0\.1:5001'\)/g, `io('http://127.0.0.1:${port}')`)
    .replace(/io\('http:\/\/localhost:5001'\)/g, `io('http://localhost:${port}')`);

  // Inject API replacement script BEFORE closing </head>
  const apiScript = `
    <script>
      // API Storage - Replaces localStorage completely
      (function() {
        const API_BASE = '';
        const storageCache = {};

        // Replace localStorage.getItem
        const originalGetItem = window.localStorage?.getItem;
        window.localStorage.getItem = function(key) {
          if (!storageCache[key]) {
            // Try to fetch from API
            fetch('/api/settings/get')
              .then(r => r.json())
              .then(data => {
                if (data.settings && data.settings[key]) {
                  storageCache[key] = JSON.stringify(data.settings[key]);
                }
              })
              .catch(() => {});
          }
          return storageCache[key] || null;
        };

        // Replace localStorage.setItem
        const originalSetItem = window.localStorage?.setItem;
        window.localStorage.setItem = function(key, value) {
          storageCache[key] = value;
          fetch('/api/settings/save', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({settings: {[key]: JSON.parse(value)}})
          }).catch(() => {});
        };

        // Replace localStorage.removeItem
        window.localStorage.removeItem = function(key) {
          delete storageCache[key];
          fetch('/api/settings/save', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({settings: {[key]: null}})
          }).catch(() => {});
        };

        // Load initial data
        Promise.all([
          fetch('/api/containers/list').then(r => r.json()).catch(() => ({containers: []})),
          fetch('/api/webhooks/list').then(r => r.json()).catch(() => ({webhooks: []})),
          fetch('/api/logs/list?limit=100').then(r => r.json()).catch(() => ({logs: []}))
        ]).then(([containersRes, webhooksRes, logsRes]) => {
          if (typeof window.loadSavedData === 'function') {
            window.activeContainers = containersRes.containers || [];
            window.webhooks = webhooksRes.webhooks || [];
            window.militaryLogs = logsRes.logs || [];
            window.loadSavedData();
          }
        });
      })();
    </script>
  `;

  // Insert before </head>
  if (patched.includes('</head>')) {
    patched = patched.replace('</head>', apiScript + '</head>');
  } else {
    patched = apiScript + patched;
  }

  return patched;
}

module.exports = patchHTML;

