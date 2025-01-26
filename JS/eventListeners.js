import { addEquipment, calculateTotalWeight } from './equipment.js';
import { saveCharacter, loadCharacter, clearData } from './storage.js';

export function setupEventListeners() {
  document.getElementById('addEquipment').addEventListener('click', addEquipment);
  document.getElementById('saveCharacter').addEventListener('click', saveCharacter);
  document.getElementById('loadCharacter').addEventListener('click', loadCharacter);
  document.getElementById('clearData').addEventListener('click', clearData);

  // Recalculate total weight when equipment changes
  document.getElementById('equipmentTable').addEventListener('input', calculateTotalWeight);
}