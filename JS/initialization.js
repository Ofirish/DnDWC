import { setupEventListeners } from './eventListeners.js';
import { setupCollapsibles } from './collapsibles.js';

export function initializeApp() {
  setupEventListeners();
  setupCollapsibles();
}