
// Function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to generate random SVG values
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMetalColor() {
    const random = Math.random(); // Generate a random number between 0 and 1

    // Hardcoded RGB colors for metals
    const gold = { r: 255, g: 215, b: 0 };     // Gold
    const silver = { r: 220, g: 220, b: 220 }; // Silver
    const bronze = { r: 205, g: 127, b: 50 };  // Bronze

    let selectedColor;

    if (random <= 0.1) {
        // 10% chance for gold
        selectedColor = gold;
    } else if (random <= 0.4) {
        // 30% chance for silver
        selectedColor = silver;
    } else {
        // 60% chance for bronze
        selectedColor = bronze;
    }

    // Convert the selected RGB color to a hex color
    return `#${((1 << 24) + (selectedColor.r << 16) + (selectedColor.g << 8) + selectedColor.b)
        .toString(16)
        .slice(1)}`;
}

function generateSkinTone() {
    // Randomly decide whether to generate a lighter or darker skin tone
    const isLight = Math.random() > 0.3;

    let r, g, b;

    if (isLight) {
        // Lighter skin tone ranges
        r = Math.floor(Math.random() * (230 - 200) + 200); // Red range
        g = Math.floor(Math.random() * (190 - 170) + 170); // Green range
        b = Math.floor(Math.random() * (170 - 150) + 150); // Blue range
    } else {
        // Darker skin tone ranges
        r = Math.floor(Math.random() * (120 - 60) + 60);   // Red range
        g = Math.floor(Math.random() * (80 - 50) + 50);    // Green range
        b = Math.floor(Math.random() * (70 - 40) + 40);    // Blue range
    }

    // Return color in HEX format
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function generateGreyscaleTone() {
    // Generate a random value for greyscale (0 = black, 255 = white)
    const grey = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const hexColor = `#${((1 << 24) + (grey << 16) + (grey << 8) + grey).toString(16).slice(1)}`;
    // Return the color in RGB format
    return hexColor;
}

function go() {
    // Generate 10 SVG variations
    for (let i = 1; i <= 10; i++) {
        // Clone the SVG container
        const originalObject = document.getElementById('svgText');
        const svgContainer = document.getElementById('svg-container');

        const clonedObject = originalObject.cloneNode(true);
        clonedObject.id = `custom-character-${i}`;
        clonedObject.style.margin = '10px'; // Add spacing between SVGs
        svgContainer.appendChild(clonedObject);

        // Wait for the SVG to load
        clonedObject.addEventListener('load', function () {
            // Access the embedded SVG document
            const svgDoc = clonedObject


            // Select elements within the SVG
            const skin = svgDoc.getElementById('XMLID_3_');
            const sun = svgDoc.getElementById('glasses');
            const bg = svgDoc.getElementById('XMLID_25_');
            const shirt = svgDoc.getElementById('XMLID_26_');
            const flowers1 = svgDoc.getElementsByClassName('st2');
            const flowers2 = svgDoc.getElementsByClassName('st3');

            // Apply random styles to SVG elements
            if (skin) {
                skin.style.fill = generateSkinTone(); //getRandomColor();
                skin.style.strokeWidth = getRandomValue(1, 5) + 'px';
            }
            if (sun) {
                sun.style.fill = generateGreyscaleTone();//getRandomColor();
            }
            if (bg) {
                bg.style.fill = generateMetalColor();
            }
            if (shirt) {
                shirt.style.fill = getRandomColor();
            }

            // Randomize flower colors
            if (flowers1.length > 0) {
                fc = getRandomColor();
                for (let f of flowers1) {
                    f.style.fill = fc;
                }
            }
            if (flowers2.length > 0) {
                fc = getRandomColor();
                for (let f of flowers2) {
                    f.style.fill = fc;
                }
            }

            // Randomize other attributes (e.g., dimensions, positions, etc.)
            const randomStrokeWidth = getRandomValue(1, 5); // Random stroke width
            if (skin) {
                skin.style.strokeWidth = randomStrokeWidth;
            }
        });
    }
}
