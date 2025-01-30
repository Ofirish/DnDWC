// Global variables
let isCustomSystem = true; // Tracks the current system (true = custom, false = classic)
const version = "0.0.97"; // Application version

// Helper function to calculate slots for a single row
function calculateSlots(weight, quantity) {
    const totalWeightGold = parseFloat(weight) * parseInt(quantity) || 0;
    return Math.ceil(totalWeightGold / 100); // 100 gp = 1 slot
}

// Function to update the Slots column when weight or quantity changes
function updateSlots(input) {
    const row = input.parentNode.parentNode;
    const weight = parseFloat(row.cells[1].children[0].value) || 0;
    const quantity = parseInt(row.cells[2].children[0].value) || 0;
    row.cells[3].innerText = calculateSlots(weight, quantity);
    calculateWeight(); // Recalculate total weight
}

// DOMContentLoaded event to initialize the app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

/**
 * Initializes the application.
 */
function initializeApp() {
    // Set up collapsible sections
    setupCollapsibles();

    // Set version in footer
    document.querySelector('.footer p').innerText = `D&D Character Equipment Weight Calculator - Version ${version}\n© 2025 AlpGoat`;

    // Initialize CEL tables
    initializeCEL();

    // Load saved state from localStorage
    loadState();
}

/**
 * Sets up collapsible sections for CEL tables.
 */
function setupCollapsibles() {
    const collapsibles = document.querySelectorAll('.cel-buttons .collapsible');
    const contents = document.querySelectorAll('.cel-content .content');

    collapsibles.forEach((collapsible, index) => {
        collapsible.addEventListener('click', function () {
            // Toggle active class on the clicked button
            this.classList.toggle('active');

            // Toggle visibility of the corresponding content
            const content = contents[index];
            content.style.display = content.style.display === 'block' ? 'none' : 'block';

            // Hide all other contents except the one being toggled
            contents.forEach((otherContent, i) => {
                if (i !== index) {
                    otherContent.style.display = 'none';
                    collapsibles[i].classList.remove('active');
                }
            });
        });
    });
}

/**
 * Adds a strength modifier with a label.
 */
function addModifier() {
    const strength = parseInt(document.getElementById('strength').value) || 0;
    const modifier = parseInt(prompt("Enter strength modifier:")) || 0;
    const modifierLabel = prompt("Enter modifier label (e.g., 'From Belt of Giant Strength'):");

    if (!modifierLabel) {
        alert("Modifier label is required.");
        return;
    }

    const modifierElement = document.createElement("div");
    modifierElement.innerText = `${modifierLabel}: ${modifier}`;
    document.getElementById('modifiers').appendChild(modifierElement);
    document.getElementById('strength').value = strength + modifier;
    updateStrengthFormula();
}

/**
 * Adds a new equipment row to the table.
 * @param {string} item - The item name.
 * @param {string} weight - The item weight.
 * @param {number} quantity - The item quantity.
 */
function addEquipment(item = '', weight = '', quantity = 1) {
    const table = document.getElementById('equipmentTable');
    const row = table.insertRow(-1);
    row.innerHTML = `
        <td><input type="text" placeholder="Item" value="${item}"></td>
        <td><input type="number" placeholder="Weight (Gold Pieces)" value="${weight}" oninput="updateSlots(this)"></td>
        <td><input type="number" placeholder="Quantity" value="${quantity}" oninput="updateSlots(this)"></td>
        <td>${calculateSlots(weight, quantity)}</td> <!-- Add this column -->
        <td><button class="btn btn-sm btn-danger" onclick="deleteEquipment(this)">Delete</button></td>
    `;
    calculateWeight();
}

/**
 * Deletes an equipment row.
 * @param {HTMLElement} button - The delete button clicked.
 */
function deleteEquipment(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateWeight();
}

/**
 * Calculates the total weight and updates the result display.
 */
function calculateWeight() {
    const table = document.getElementById('equipmentTable');
    let totalWeightGold = 0;

    // Loop through each row to calculate total weight
    for (let i = 1, row; (row = table.rows[i]); i++) {
        const weight = parseFloat(row.cells[1].children[0].value) || 0;
        const quantity = parseInt(row.cells[2].children[0].value) || 0;
        totalWeightGold += weight * quantity;
    }

    // Calculate results for both systems
    const classicWeightLbs = totalWeightGold / 10; // Classic system: 10 gp = 1 lb
    const classicWeightKg = classicWeightLbs * 0.453592; // Convert lbs to kg

    const customWeightLbs = totalWeightGold / 10; // Custom system: 10 gp = 1 lb
    const customWeightSlots = Math.ceil(totalWeightGold / 100); // Custom system: 100 gp = 1 slot

    // Display results based on the current system
    let resultText;
    if (isCustomSystem) {
        resultText = `Total Weight: ${totalWeightGold} Gold Pieces (${customWeightLbs.toFixed(2)} lbs, ${customWeightSlots} Slots)\n` +
                     `Possible Slots: ${document.getElementById('strength').value}\n` +
                     `Used Slots: ${customWeightSlots}\n` +
                     `Available Slots: ${document.getElementById('strength').value - customWeightSlots}`;
    } else {
        resultText = `Total Weight: ${totalWeightGold} Gold Pieces (${classicWeightLbs.toFixed(2)} lbs, ${classicWeightKg.toFixed(2)} kg)\n` +
                     `No slots in Classic System.`;
    }

    // Add warning if over-encumbered (only for custom system)
    if (isCustomSystem) {
        const availableSlots = document.getElementById('strength').value - customWeightSlots;
        if (availableSlots < 0) {
            resultText += '\n\n⚠️ Warning: Over-encumbered!';
            document.getElementById('result').classList.add('warning');
        } else {
            document.getElementById('result').classList.remove('warning');
        }
    }

    // Update the result display
    document.getElementById('result').innerText = resultText;

}

/**
 * Toggles between custom and standard systems.
 */
function toggleSystem() {
    isCustomSystem = !isCustomSystem;
    document.getElementById('toggleSystemButton').innerText = isCustomSystem ? 'Show Classic System' : 'Show Custom System';
    calculateWeight(); // Recalculate weight to update the results
}

/**
 * Updates the strength formula display.
 */
function updateStrengthFormula() {
    const strength = parseInt(document.getElementById('strength').value) || 0;
    const modifiers = document.getElementById('modifiers').innerText;
    document.getElementById('strengthFormula').innerText = `Strength: ${strength} (${modifiers})`;
}

/**
 * Adds predefined equipment to the table.
 * @param {string} item - The item name.
 * @param {number} weight - The item weight.
 */
function addPredefinedEquipment(item, weight) {
    addEquipment(item, weight, 1);
}

/**
 * Edits the weight of a common equipment item.
 * @param {HTMLElement} button - The edit button clicked.
 */
function editCommonEquipmentWeight(button) {
    const row = button.parentNode.parentNode;
    const itemName = row.cells[0].innerText;
    const currentWeight = row.cells[1].innerText;
    const newWeight = prompt(`Enter new weight for ${itemName}:`, currentWeight);

    if (newWeight !== null && !isNaN(newWeight) && newWeight >= 0) {
        row.cells[1].innerText = newWeight;
    } else {
        alert("Please enter a valid weight (a non-negative number).");
    }
}

/**
 * Deletes a common equipment item.
 * @param {HTMLElement} button - The delete button clicked.
 */
function deleteCommonEquipment(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

/**
 * Adds new common equipment item to the appropriate table.
 */
function addCommonEquipment() {
    const itemName = document.getElementById('newItemName').value;
    const itemWeight = document.getElementById('newItemWeight').value;
    const itemCategory = document.getElementById('newItemCategory').value;

    if (!itemName || !itemWeight) {
        alert('Please enter both item name and weight.');
        return;
    }

    const tableId = `${itemCategory}Table`;
    const table = document.getElementById(tableId);

    const row = table.insertRow(-1);
    row.innerHTML = `
        <td>${itemName}</td>
        <td>${itemWeight}</td>
        <td><button onclick="addPredefinedEquipment('${itemName}', ${itemWeight})" class="btn btn-sm btn-success">Add</button></td>
        <td><button onclick="editCommonEquipmentWeight(this)" class="btn btn-sm btn-warning">Edit Weight</button></td>
        <td><button onclick="deleteCommonEquipment(this)" class="btn btn-sm btn-danger">Delete</button></td>
    `;

    // Clear the form inputs
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemWeight').value = '';
}

/**
 * Saves character data to an XML file.
 */
function saveCharacterToXML() {
    const character = {
        strength: document.getElementById('strength').value,
        modifiers: document.getElementById('modifiers').innerHTML,
        equipment: [],
        commonEquipment: {
            weapons: [],
            armor: [],
            ammunition: [],
            utilities: [],
            coins: [],
            gems: [],
            misc: []
        },
        system: isCustomSystem ? 'custom' : 'standard',
        textSize: parseFloat(getComputedStyle(document.body).fontSize)
    };

    // Save equipment table data
    const equipmentTable = document.getElementById('equipmentTable');
    for (let i = 1, row; (row = equipmentTable.rows[i]); i++) {
        character.equipment.push({
            item: row.cells[0].children[0].value,
            weight: row.cells[1].children[0].value,
            quantity: row.cells[2].children[0].value
        });
    }

    // Save common equipment data
    const tables = {
        weapons: document.getElementById('weaponsTable'),
        armor: document.getElementById('armorTable'),
        ammunition: document.getElementById('ammunitionTable'),
        utilities: document.getElementById('utilitiesTable'),
        coins: document.getElementById('coinsTable'),
        gems: document.getElementById('gemsTable'),
        misc: document.getElementById('miscTable')
    };

    for (const [category, table] of Object.entries(tables)) {
        for (let i = 1, row; (row = table.rows[i]); i++) {
            character.commonEquipment[category].push({
                item: row.cells[0].innerText,
                weight: row.cells[1].innerText
            });
        }
    }

    // Convert character data to XML
    let xml = `<character>
        <strength>${character.strength}</strength>
        <modifiers>${character.modifiers}</modifiers>
        <system>${character.system}</system>
        <textSize>${character.textSize}</textSize>
        <equipment>`;
    character.equipment.forEach(eq => {
        xml += `<item>
            <name>${eq.item}</name>
            <weight>${eq.weight}</weight>
            <quantity>${eq.quantity}</quantity>
        </item>`;
    });
    xml += `</equipment>
        <commonEquipment>`;
    for (const [category, items] of Object.entries(character.commonEquipment)) {
        items.forEach(ce => {
            xml += `<item>
                <category>${category}</category>
                <name>${ce.item}</name>
                <weight>${ce.weight}</weight>
            </item>`;
        });
    }
    xml += `</commonEquipment>
    </character>`;

    // Prompt for file name
    const fileName = prompt("Enter a name for the XML file:", "character_data");
    if (fileName === null) return; // User canceled

    // Create a Blob and trigger download
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xml';
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Loads character data from an XML file.
 * @param {HTMLElement} input - The file input element.
 */
function loadCharacterFromXML(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const xml = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');

        // Load character data
        document.getElementById('strength').value = xmlDoc.getElementsByTagName('strength')[0].textContent;
        document.getElementById('modifiers').innerHTML = xmlDoc.getElementsByTagName('modifiers')[0].textContent;

        // Load system
        const system = xmlDoc.getElementsByTagName('system')[0].textContent;
        isCustomSystem = system === 'custom';
        document.getElementById('toggleSystemButton').innerText = isCustomSystem ? 'Show Standard System' : 'Show Custom System';

        // Load text size
        const textSize = xmlDoc.getElementsByTagName('textSize')[0].textContent;
        document.body.style.fontSize = textSize + 'px';

        // Load equipment data
        document.getElementById('equipmentTable').innerHTML = `
            <tr>
                <th>Item</th>
                <th>Weight (Gold Pieces)</th>
                <th>Quantity</th>
                <th>Action</th>
            </tr>`;
        const items = xmlDoc.getElementsByTagName('equipment')[0].getElementsByTagName('item');
        for (let i = 0; i < items.length; i++) {
            const item = items[i].getElementsByTagName('name')[0].textContent;
            const weight = items[i].getElementsByTagName('weight')[0].textContent;
            const quantity = items[i].getElementsByTagName('quantity')[0].textContent;
            addEquipment(item, weight, quantity);
        }

        // Load common equipment data
        const tables = {
            weapons: document.getElementById('weaponsTable'),
            armor: document.getElementById('armorTable'),
            ammunition: document.getElementById('ammunitionTable'),
            utilities: document.getElementById('utilitiesTable'),
            coins: document.getElementById('coinsTable'),
            gems: document.getElementById('gemsTable'),
            misc: document.getElementById('miscTable')
        };

        for (const table of Object.values(tables)) {
            table.innerHTML = `
                <tr>
                    <th>Item</th>
                    <th>Weight (Gold Pieces)</th>
                    <th>Action</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>`;
        }

        const commonItems = xmlDoc.getElementsByTagName('commonEquipment')[0].getElementsByTagName('item');
        for (let i = 0; i < commonItems.length; i++) {
            const category = commonItems[i].getElementsByTagName('category')[0].textContent;
            const item = commonItems[i].getElementsByTagName('name')[0].textContent;
            const weight = commonItems[i].getElementsByTagName('weight')[0].textContent;

            const table = tables[category];
            const row = table.insertRow(-1);
            row.innerHTML = `
                <td>${item}</td>
                <td>${weight}</td>
                <td><button onclick="addPredefinedEquipment('${item}', ${weight})" class="btn btn-sm btn-success">Add</button></td>
                <td><button onclick="editCommonEquipmentWeight(this)" class="btn btn-sm btn-warning">Edit Weight</button></td>
                <td><button onclick="deleteCommonEquipment(this)" class="btn btn-sm btn-danger">Delete</button></td>
            `;
        }

        updateStrengthFormula();
        calculateWeight();
        alert('Character data loaded from XML!');
    };
    reader.readAsText(file);
}

/**
 * Increases the text size.
 */
function increaseTextSize() {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (currentSize + 2) + 'px';
}

/**
 * Decreases the text size.
 */
function decreaseTextSize() {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (currentSize - 2) + 'px';
}

/**
 * Clears only user data (equipment, strength, modifiers, etc.) but leaves the CEL intact.
 */
function clearUserData() {
    if (confirm("Are you sure you want to clear user data? This cannot be undone.")) {
        // Clear strength and modifiers
        document.getElementById('strength').value = '';
        document.getElementById('modifiers').innerHTML = '';

        // Clear equipment table
        document.getElementById('equipmentTable').innerHTML = `
            <tr>
                <th>Item</th>
                <th>Weight (Gold Pieces)</th>
                <th>Quantity</th>
                <th>Action</th>
            </tr>`;

        // Clear result display
        document.getElementById('result').innerText = '';

        // Remove saved state from localStorage
        localStorage.removeItem('characterState');
    }
}

/**
 * Clears all data (user data and CEL).
 */
function clearAllData() {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
        // Clear user data
        clearUserData();

        // Clear all CEL tables
        const tables = {
            weapons: document.getElementById('weaponsTable'),
            armor: document.getElementById('armorTable'),
            ammunition: document.getElementById('ammunitionTable'),
            utilities: document.getElementById('utilitiesTable'),
            coins: document.getElementById('coinsTable'),
            gems: document.getElementById('gemsTable'),
            misc: document.getElementById('miscTable')
        };

        for (const table of Object.values(tables)) {
            table.innerHTML = `
                <tr>
                    <th>Item</th>
                    <th>Weight (Gold Pieces)</th>
                    <th>Action</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>`;
        }
    }
}

/**
 * Repopulates the CEL with the default preloaded data.
 */
function repopulateCEL() {
    if (confirm("Are you sure you want to repopulate the CEL with default data? This will overwrite the current CEL.")) {
        initializeCEL();
    }
}

/**
 * Saves the current state to localStorage.
 */
function saveState() {
    const state = {
        strength: document.getElementById('strength').value,
        modifiers: document.getElementById('modifiers').innerHTML,
        equipment: [],
        commonEquipment: {
            weapons: [],
            armor: [],
            ammunition: [],
            utilities: [],
            coins: [],
            gems: [],
            misc: []
        },
        system: isCustomSystem ? 'custom' : 'standard',
        textSize: parseFloat(getComputedStyle(document.body).fontSize)
    };

    // Save equipment table data
    const equipmentTable = document.getElementById('equipmentTable');
    for (let i = 1, row; (row = equipmentTable.rows[i]); i++) {
        state.equipment.push({
            item: row.cells[0].children[0].value,
            weight: row.cells[1].children[0].value,
            quantity: row.cells[2].children[0].value
        });
    }

    // Save common equipment data
    const tables = {
        weapons: document.getElementById('weaponsTable'),
        armor: document.getElementById('armorTable'),
        ammunition: document.getElementById('ammunitionTable'),
        utilities: document.getElementById('utilitiesTable'),
        coins: document.getElementById('coinsTable'),
        gems: document.getElementById('gemsTable'),
        misc: document.getElementById('miscTable')
    };

    for (const [category, table] of Object.entries(tables)) {
        for (let i = 1, row; (row = table.rows[i]); i++) {
            state.commonEquipment[category].push({
                item: row.cells[0].innerText,
                weight: row.cells[1].innerText
            });
        }
    }

    localStorage.setItem('characterState', JSON.stringify(state));
}

/**
 * Loads the saved state from localStorage.
 */
function loadState() {
    const state = JSON.parse(localStorage.getItem('characterState'));
    if (state) {
        document.getElementById('strength').value = state.strength;
        document.getElementById('modifiers').innerHTML = state.modifiers;
        isCustomSystem = state.system === 'custom';
        document.getElementById('toggleSystemButton').innerText = isCustomSystem ? 'Show Standard System' : 'Show Custom System';
        document.body.style.fontSize = state.textSize + 'px';

        // Load equipment data
        document.getElementById('equipmentTable').innerHTML = `
            <tr>
                <th>Item</th>
                <th>Weight (Gold Pieces)</th>
                <th>Quantity</th>
                <th>Action</th>
            </tr>`;
        state.equipment.forEach(eq => addEquipment(eq.item, eq.weight, eq.quantity));

        // Load common equipment data
        const tables = {
            weapons: document.getElementById('weaponsTable'),
            armor: document.getElementById('armorTable'),
            ammunition: document.getElementById('ammunitionTable'),
            utilities: document.getElementById('utilitiesTable'),
            coins: document.getElementById('coinsTable'),
            gems: document.getElementById('gemsTable'),
            misc: document.getElementById('miscTable')
        };

        for (const [category, table] of Object.entries(tables)) {
            table.innerHTML = `
                <tr>
                    <th>Item</th>
                    <th>Weight (Gold Pieces)</th>
                    <th>Action</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>`;
            state.commonEquipment[category].forEach(ce => {
                const row = table.insertRow(-1);
                row.innerHTML = `
                    <td>${ce.item}</td>
                    <td>${ce.weight}</td>
                    <td><button onclick="addPredefinedEquipment('${ce.item}', ${ce.weight})" class="btn btn-sm btn-success">Add</button></td>
                    <td><button onclick="editCommonEquipmentWeight(this)" class="btn btn-sm btn-warning">Edit Weight</button></td>
                    <td><button onclick="deleteCommonEquipment(this)" class="btn btn-sm btn-danger">Delete</button></td>
                `;
            });
        }

        updateStrengthFormula();
        calculateWeight();
    }
}

/**
 * Initializes the Common Equipment List (CEL) tables with AD&D Edition 1 items.
 */
function initializeCEL() {
    const weapons = [
        { item: "Dagger", weight: 1 },
        { item: "Longsword", weight: 4 },
        { item: "Shortbow", weight: 2 },
        { item: "Crossbow", weight: 7 },
        { item: "Battleaxe", weight: 7 },
        { item: "Warhammer", weight: 5 },
        { item: "Spear", weight: 5 },
        { item: "Mace", weight: 6 },
        { item: "Quarterstaff", weight: 4 },
        { item: "Greatsword", weight: 8 }
    ];

    const armor = [
        { item: "Leather Armor", weight: 15 },
        { item: "Chainmail", weight: 40 },
        { item: "Plate Mail", weight: 50 },
        { item: "Shield", weight: 10 },
        { item: "Padded Armor", weight: 10 },
        { item: "Hide Armor", weight: 12 },
        { item: "Scale Mail", weight: 45 },
        { item: "Splint Armor", weight: 60 },
        { item: "Ring Mail", weight: 40 },
        { item: "Breastplate", weight: 30 }
    ];

    const ammunition = [
        { item: "Arrows (20)", weight: 3 },
        { item: "Bolts (20)", weight: 3 },
        { item: "Sling Bullets (20)", weight: 2 },
        { item: "Darts (20)", weight: 1 },
        { item: "Javelins (5)", weight: 10 },
        { item: "Throwing Axes (5)", weight: 10 },
        { item: "Throwing Knives (5)", weight: 5 },
        { item: "Hand Crossbow Bolts (20)", weight: 2 },
        { item: "Heavy Crossbow Bolts (20)", weight: 4 },
        { item: "Blowgun Needles (50)", weight: 1 }
    ];

    const utilities = [
        { item: "Backpack", weight: 5 },
        { item: "Bedroll", weight: 7 },
        { item: "Rope (50 feet)", weight: 10 },
        { item: "Lantern", weight: 3 },
        { item: "Torch", weight: 1 },
        { item: "Grappling Hook", weight: 4 },
        { item: "Pitons (10)", weight: 2 },
        { item: "Waterskin", weight: 4 },
        { item: "Rations (1 day)", weight: 2 },
        { item: "Tinderbox", weight: 1 }
    ];

    const coins = [
        { item: "Gold Coins (100)", weight: 1 },
        { item: "Silver Coins (100)", weight: 1 },
        { item: "Copper Coins (100)", weight: 1 },
        { item: "Platinum Coins (10)", weight: 0.2 },
        { item: "Electrum Coins (50)", weight: 0.5 }
    ];

    const gems = [
        { item: "Ruby", weight: 0.1 },
        { item: "Diamond", weight: 0.1 },
        { item: "Emerald", weight: 0.1 },
        { item: "Sapphire", weight: 0.1 },
        { item: "Topaz", weight: 0.1 },
        { item: "Amethyst", weight: 0.1 },
        { item: "Pearl", weight: 0.1 },
        { item: "Opal", weight: 0.1 },
        { item: "Jade", weight: 0.1 },
        { item: "Garnet", weight: 0.1 }
    ];

    const misc = [
        { item: "Potion of Healing", weight: 0.5 },
        { item: "Thieves' Tools", weight: 1 },
        { item: "Spellbook", weight: 5 },
        { item: "Scroll Case", weight: 1 },
        { item: "Ink Pen", weight: 0.1 },
        { item: "Ink (1 oz)", weight: 0.1 },
        { item: "Paper (10 sheets)", weight: 0.2 },
        { item: "Chalk (10 pieces)", weight: 0.1 },
        { item: "Candle", weight: 0.1 },
        { item: "Mirror (Steel)", weight: 1 }
    ];

    // Populate tables
    populateTable('weaponsTable', weapons);
    populateTable('armorTable', armor);
    populateTable('ammunitionTable', ammunition);
    populateTable('utilitiesTable', utilities);
    populateTable('coinsTable', coins);
    populateTable('gemsTable', gems);
    populateTable('miscTable', misc);
}

/**
 * Populates a table with items.
 * @param {string} tableId - The ID of the table.
 * @param {Array} items - The items to add to the table.
 */
function populateTable(tableId, items) {
    const table = document.getElementById(tableId);
    table.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Weight (Gold Pieces)</th>
            <th>Action</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>`;

    items.forEach(ce => {
        const row = table.insertRow(-1);
        row.innerHTML = `
            <td>${ce.item}</td>
            <td>${ce.weight}</td>
            <td><button onclick="addPredefinedEquipment('${ce.item}', ${ce.weight})" class="btn btn-sm btn-success">Add</button></td>
            <td><button onclick="editCommonEquipmentWeight(this)" class="btn btn-sm btn-warning">Edit Weight</button></td>
            <td><button onclick="deleteCommonEquipment(this)" class="btn btn-sm btn-danger">Delete</button></td>
        `;
    });
}

/**
 * Gathers all relevant data and prints the character sheet.
 */
function printCharacterSheet() {
    // Gather character details
    const characterName = document.getElementById('characterName').value || 'Unnamed Character';
    const characterRace = document.getElementById('characterRace').value || 'Unknown Race';
    const strength = document.getElementById('strength').value || 0;
    const modifiers = document.getElementById('modifiers').innerText || 'No modifiers';
    const system = isCustomSystem ? 'Custom System' : 'Standard System';

    // Gather equipment data
    const equipmentTable = document.getElementById('equipmentTable');
    let equipmentData = [];
    for (let i = 1, row; (row = equipmentTable.rows[i]); i++) {
        const item = row.cells[0].children[0].value || 'Unnamed Item';
        const weight = row.cells[1].children[0].value || 0;
        const quantity = row.cells[2].children[0].value || 1;
        equipmentData.push({ item, weight, quantity });
    }

    // Gather common equipment data
    const commonEquipmentData = {};
    const tables = {
        weapons: document.getElementById('weaponsTable'),
        armor: document.getElementById('armorTable'),
        ammunition: document.getElementById('ammunitionTable'),
        utilities: document.getElementById('utilitiesTable'),
        coins: document.getElementById('coinsTable'),
        gems: document.getElementById('gemsTable'),
        misc: document.getElementById('miscTable')
    };

    for (const [category, table] of Object.entries(tables)) {
        commonEquipmentData[category] = [];
        for (let i = 1, row; (row = table.rows[i]); i++) {
            const item = row.cells[0].innerText || 'Unnamed Item';
            const weight = row.cells[1].innerText || 0;
            commonEquipmentData[category].push({ item, weight });
        }
    }

    // Create a printable HTML template
    const printContent = `
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
            h2 { color: #555; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .section { margin-bottom: 30px; }
            .warning { color: red; font-weight: bold; }
        </style>
        <h1>${characterName}</h1>
        <h2>${characterRace}</h2>

        <div class="section">
            <h2>Character Details</h2>
            <p><strong>Strength:</strong> ${strength}</p>
            <p><strong>Modifiers:</strong> ${modifiers}</p>
            <p><strong>System:</strong> ${system}</p>
        </div>

        <div class="section">
            <h2>Equipment</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Weight (Gold Pieces)</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${equipmentData.map(eq => `
                        <tr>
                            <td>${eq.item}</td>
                            <td>${eq.weight}</td>
                            <td>${eq.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>Common Equipment List (CEL)</h2>
            ${Object.entries(commonEquipmentData).map(([category, items]) => `
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Weight (Gold Pieces)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(ce => `
                            <tr>
                                <td>${ce.item}</td>
                                <td>${ce.weight}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `).join('')}
        </div>

        <div class="section">
            <h2>Weight Summary</h2>
            <p>${document.getElementById('result').innerText.replace(/\n/g, '<br>')}</p>
        </div>
    `;

    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}
// Auto-save every 10 seconds
setInterval(saveState, 10000);