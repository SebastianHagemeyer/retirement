// Start wojak
var svgObject = document.getElementById('svgText');

var girl = false;
var glass = true;
var toggleBackground = true;


document.getElementById('download-button').addEventListener('click', function () {
    console.log("Download")
    const svgElement = document.getElementById('svgText');


    if (svgElement) {
        // Serialize the SVG element to a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        // Create a Blob with the SVG data
        const blob = new Blob([svgString], { type: 'image/svg+xml' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'wojak.svg';

        // Programmatically click the link to trigger download
        downloadLink.click();

        // Clean up
        URL.revokeObjectURL(downloadLink.href);
    } else {
        console.error('SVG element not found in the object.');
    }
});
var replaced = "";


document.getElementById('download-png').addEventListener('click', function () {

    const sizefactor = 800;

    const svgElement = document.getElementById('svgText');
    if (!svgElement) {
        console.error("SVG Element not found.");
        return;
    }

    // Serialize the SVG content
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);



    var replaced = svgString.replace(
        /(<svg[^>]*?)\s*(width="[^"]+")\s*(height="[^"]+")/i,
        `$1 width="${sizefactor}" height="${sizefactor}"`
    );

    const scaledSvgString = replaced;

    //console.log(svgString)
    //console.log(replaced);


    /*.replace(
                /(<svg[^>]*?)(width="[^"]+"|height="[^"]+")/g,
                 `$1 width="${400}" height="${400}"`
    );*/

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match SVG dimensions
    const svgWidth = sizefactor//svgElement.getAttribute('width') || 800; // Default width
    const svgHeight = sizefactor//svgElement.getAttribute('height') || 400; // Default height
    canvas.width = svgWidth;
    canvas.height = svgHeight;

    // Create an image from the SVG string
    const img = new Image();
    const svgBlob = new Blob([scaledSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
        // Draw the SVG onto the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG and download
        const pngData = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngData;
        downloadLink.download = 'wojak.png';
        downloadLink.click();

        // Clean up
        URL.revokeObjectURL(url);
    };

    img.onerror = (err) => {
        console.error("Failed to load SVG image for PNG conversion.", err);
    };

    img.src = url;
});

document.body.addEventListener('click', function (event) {
    if (event.target.matches('[data-action="download"]')) {

        var sizefactor = 200;

        const big = event.target.dataset.size;
        console.log(big)
        if (big == 1) {
            sizefactor = 800
        }



        const svgElement = document.getElementById('svgText');
        if (!svgElement) {
            console.error("SVG Element not found.");
            return;
        }

        // Serialize the SVG content
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        // Replace width and height attributes in the SVG
        const replaced = svgString.replace(
            /(<svg[^>]*?)\s*(width="[^"]+")\s*(height="[^"]+")/i,
            `$1 width="${sizefactor}" height="${sizefactor}"`
        );
        const scaledSvgString = replaced;

        //console.log(svgString);
        //console.log(replaced);

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the banner's dimensions
        const bannerImage = new Image();
        if (big == 1) {
            bannerImage.src = 'wojakMaker/b2.png'; // Replace with the path to your banner image
        } else {
            bannerImage.src = 'wojakMaker/b.png'; // Replace with the path to your banner image
        }

        bannerImage.onload = () => {
            const bannerWidth = bannerImage.width;
            const bannerHeight = bannerImage.height;

            canvas.width = bannerWidth;
            canvas.height = bannerHeight;

            // Draw the banner as the canvas background
            ctx.drawImage(bannerImage, 0, 0);

            // Create an image from the SVG string
            const img = new Image();
            const svgBlob = new Blob([scaledSvgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                // Draw the SVG onto the canvas
                ctx.drawImage(img, (bannerWidth / 2) - sizefactor / 2, (bannerHeight / 2) - sizefactor / 2, sizefactor, sizefactor);

                // Convert canvas to PNG and download
                const pngData = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngData;
                downloadLink.download = 'banner_with_svg.png';
                downloadLink.click();

                // Clean up
                URL.revokeObjectURL(url);
            };

            img.onerror = (err) => {
                console.error("Failed to load SVG image for PNG conversion.", err);
            };

            img.src = url;
        };

        bannerImage.onerror = (err) => {
            console.error("Failed to load banner image.", err);
        };
    }
})



// variables for the elements
var skin, sun, bg, f1, f2, shirt;


// init colours
var skinc = "#FFFFFF"; // Face Color
var sunc = "#000000"; // Glasses Color
var bgc = "#69bd44";  // Background Color
var f1c = "#FFFFFF";  // Flower Color
var f2c = "#e9a98f";  // Flower Color 2
var shirtc = "#04b1f3"; // Shirt Color


// SET ALL FILES HERE, ALL ACESSORIES HATS ETC
const mainJak = 'wojakMaker/maintext.txt';
const hatText = 'wojakMaker/hattext.txt';
const hatText2 = 'wojakMaker/hattext2.txt';
const hatText3 = 'wojakMaker/hattext3.txt';
const hairText = 'wojakMaker/hairtext.txt';
const glassText = 'wojakMaker/glass1text.txt';


async function makeWojak() { // reset the wojak to the blank state
    const response = await fetch(mainJak);
    const fileContent = await response.text();
    const lines = fileContent.split('\n');
    const svgCode = lines
        .map(
            (line, index) => `
                
                    ${line}
               
            `
        )
        .join('');
    svgText.innerHTML = svgCode; // Inject all lines as part of the SVG


    //setAllCol()
}

async function add(fileN) {

    const response = await fetch(fileN);
    const fileContent = await response.text();
    const lines = fileContent.split('\n');
    const svgCode = lines
        .map(
            (line, index) => `
                
                    ${line}
               
            `
        )
        .join('');
    svgText.innerHTML += svgCode; // Add lines as part of the SVG
}

function setAllCol() {
    skin = svgObject.getElementById('XMLID_3_');
    sun = svgObject.getElementById('glasses');
    bg = svgObject.getElementById('XMLID_25_');
    shirt = svgObject.getElementById('XMLID_26_');
    f1 = svgObject.getElementsByClassName('st2');
    f2 = svgObject.getElementsByClassName('st3');

    skin.style.fill = skinc;//'#FF5733'; // Example color (red-orange)
    sun.style.fill = sunc;//'#FF5733'; // Example color (red-orange)
    shirt.style.fill = shirtc;//'#FF5733'; // Example color (red-orange)
    bg.style.fill = bgc;//'#FF5733'; // Example color (red-orange)
    for (let i = 0; i < f1.length; i++) {
        f1[i].style.fill = f1c; // Apply the new color
    }
    for (let i = 0; i < f2.length; i++) {
        f2[i].style.fill = f2c; // Apply the new color
    }
}

function girlC() {
    makeWojak();
    //svgObject = document.getElementById('svgText');
    if (girl) {
        girl = false;
    } else {
        girl = true;
    }

    uAll()
}
var ticker = null;
var ticker2 = null;
var ticker3 = null;

function uAll() { // update all accessories adding to svg element, as well as text
    uText();  // update all text
    setTimeout(() => { setAllCol() }, 500)

    if (glass) {
        clearTimeout(ticker3);
        ticker3 = setTimeout(() => { add(glassText); }, 450);
    }

    if (girl) {
        clearTimeout(ticker2);
        ticker2 = setTimeout(() => { add(hairText); }, 300);
    }

    if (hat == 0) {
        clearTimeout(ticker);
        ticker = setTimeout(() => { add(hatText); }, 500);
    } else if (hat == 1) {
        clearTimeout(ticker);
        ticker = setTimeout(() => { add(hatText2); }, 500);
    } else if (hat == 2) {
        clearTimeout(ticker);
        ticker = setTimeout(() => { add(hatText3); }, 500);
    } else {
        clearTimeout(ticker);
        console.log("no hat")
    }

    setTimeout(() => {
        bg = svgObject.getElementById('XMLID_25_');
        if (toggleBackground) {
            bg.style.visibility = 'visible'; // Hides the element

        } else {
            bg.style.visibility = 'hidden'; // Hides the element
        }
    }, 500);

}


// Wait for the object to load
document.getElementById('svgText').addEventListener('load', function () {
    console.log("Load")
    // Access the embedded SVG document
    svgObject = document.getElementById('svgText');
    makeWojak();
    uAll();
});

document.getElementById('face-color').addEventListener('input', (e) => {
    //skin.setAttribute('fill', e.target.value);
    skinc = e.target.value;
    //skin.style.fill = skinc;//'#FF5733'; // Example color (red-orange)
});

document.getElementById('glasses-color').addEventListener('input', (e) => {
    //skin.setAttribute('fill', e.target.value);
    sunc = e.target.value;
    //sun.style.fill = sunc;//'#FF5733'; // Example color (red-orange)
});

document.getElementById('shirt-color').addEventListener('input', (e) => {
    //skin.setAttribute('fill', e.target.value);
    shirtc = e.target.value
    //shirt.style.fill = shirtc;//'#FF5733'; // Example color (red-orange)
});

document.getElementById('background-color').addEventListener('input', (e) => {
    bgc = e.target.value;//skin.setAttribute('fill', e.target.value);
    //bg.style.fill = bgc;//'#FF5733'; // Example color (red-orange)
});

document.getElementById('flower-color').addEventListener('input', (e) => {
    //skin.setAttribute('fill', e.target.value);
    f1c = e.target.value;
    console.log("flower")
    /*for (let i = 0; i < f1.length; i++) {
        f1[i].style.fill = f1c; // Apply the new color
    }*/
});

document.getElementById('flower-color2').addEventListener('input', (e) => {
    //skin.setAttribute('fill', e.target.value);
    f2c = e.target.value;
    /*for (let i = 0; i < f2.length; i++) {
        f2[i].style.fill = f2c; // Apply the new color
    }*/
});

document.querySelectorAll('input[type="color"]').forEach(input => {
    input.addEventListener('input', event => {
        // console.log("changed colour" );
        setAllCol();
    })
});




document.getElementById('background-button').addEventListener('change', function () {
    bg = svgObject.getElementById('XMLID_25_');
    if (this.checked) {
        console.log("Background enabled.");
        toggleBackground = true;
        bg.style.visibility = 'visible'; // Hides the element

    } else {
        console.log("Background disabled.");
        toggleBackground = false;
        bg.style.visibility = 'hidden'; // Hides the element
    }
});

function nextSun() {
    console.log("Sun");
}

function rollJak() {
    // Randomize gender (true = female, false = male)
    girl = Math.random() < 0.2; // yeah
    hat = Math.floor(Math.random() * 4) - 1; // Random integer between -1 and 2

    makeWojak();// clean slate

    skinc = generateSkinTone();
    sunc = generateGreyscaleTone();
    bgc = generateMetalColor();
    f1c = getRandomColor();
    f2c = getRandomColor();
    shirtc = getRandomColor();

    // Set the default values and background colors for the input elements
    document.getElementById('face-color').value = skinc;
    document.getElementById('face-color').style.backgroundColor = skinc;

    document.getElementById('glasses-color').value = sunc;
    document.getElementById('glasses-color').style.backgroundColor = sunc;

    document.getElementById('background-color').value = bgc;
    document.getElementById('background-color').style.backgroundColor = bgc;

    document.getElementById('flower-color').value = f1c;
    document.getElementById('flower-color').style.backgroundColor = f1c;

    document.getElementById('flower-color2').value = f2c;
    document.getElementById('flower-color2').style.backgroundColor = f2c;

    document.getElementById('shirt-color').value = shirtc;
    document.getElementById('shirt-color').style.backgroundColor = shirtc;

    uAll()
}

function uText() {
    var hatDisp = "Current Hat: None"; // Variable to hold the current hat display text

    // Determine the hat display text based on the value of `hat`
    if (hat === 0) {
        hatDisp = "Current Hat: MSGA";
    } else if (hat === 1) {
        hatDisp = "Current Hat: Top Hat";
    } else if (hat === 2) {
        hatDisp = "Current Hat: MAGA";
    } else {
        hat = -1; // Reset hat if none of the conditions match
        hatDisp = "Current Hat: None";
    }

    // Update the HTML element with the hat display text
    document.getElementById('hat-display').textContent = hatDisp;

    // Update the gender display text based on the value of `girl`
    document.getElementById('gender-display').textContent = girl
        ? "Current Hair: Female"
        : "Current Hair: Male";
}

var hat = -1;
// -1 is no hat
function nextHat() {
    hat += 1;
    makeWojak();

    if (hat == 3) {
        hat = -1;
    }

    uAll()
}
