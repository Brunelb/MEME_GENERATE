// les éléments importants 
const uploadImage = document.getElementById('image-uploader');  
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const fontSelector = document.getElementById('fontSelector');
const fontSize = document.getElementById('fontSize');
const textColor = document.getElementById('textColor');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('download-btn');  
const shareButton = document.getElementById('shareMeme-btn');

// Definition de la taille de l'image dans canvas
const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 350;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let image = new Image();
let imageLoaded = false;

// Vérifier si une image est chargée
function checkImageLoaded() {
    if (!imageLoaded) {
        alert("❌ Veuillez sélectionner une image .");
        return false;
    }
    return true;
}

// Récupérer un fichier local et le convertir en texte
uploadImage.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (!file) {
        alert("❌ veuillez choisir une image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Charger l'image dans le canvas
image.onload = function() {
    imageLoaded = true;
    drawMeme();
};

// Fonction pour dessiner le mème
function drawMeme() {
    if (!imageLoaded) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redimensionne l'image pour fitter le canvas 
    const imgRatio = image.width / image.height;
    const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    let drawWidth, drawHeight;
    if (imgRatio > canvasRatio) {
        drawWidth = CANVAS_WIDTH;
        drawHeight = CANVAS_WIDTH ;
    } else {
        drawHeight = CANVAS_HEIGHT;
        drawWidth = CANVAS_HEIGHT ;
    }
    const x = (CANVAS_WIDTH - drawWidth) / 2;
    const y = (CANVAS_HEIGHT - drawHeight) / 2;
    
    ctx.drawImage(image, x, y, drawWidth, drawHeight);

    // texte general 
    const font = fontSelector ? fontSelector.value : 'Impact';  
    const size = fontSize ? fontSize.value + 'px' : '50px';  
    ctx.font = `bold ${size} ${font}`;
    ctx.fillStyle = textColor ? textColor.value : '#ffffff';  
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top'; 

    // Texte du  haut
    const topTextContent = topText.value.toUpperCase() || 'TEXTE HAUT';
    ctx.fillText(topTextContent, CANVAS_WIDTH / 2, parseInt(size) + 5);
    ctx.strokeText(topTextContent, CANVAS_WIDTH / 2, parseInt(size) + 5);

    // Texte du bas 
    const bottomTextContent = bottomText.value.toUpperCase() || 'TEXTE BAS';
    const bottomY = CANVAS_HEIGHT - parseInt(size) - 10;
    ctx.textBaseline = 'bottom';  // Alignement bas pour le texte du bas
    ctx.fillText(bottomTextContent, CANVAS_WIDTH / 2, bottomY);
    ctx.strokeText(bottomTextContent, CANVAS_WIDTH / 2, bottomY);
    ctx.textBaseline = 'top';  // Reset pour cohérence
}

// affichage du texte en temps réel
topText.addEventListener('input', drawMeme);
bottomText.addEventListener('input', drawMeme);

// Télécharger le mème
downloadButton.addEventListener('click', function() {
    if (!checkImageLoaded()) return;

    const memeURL = canvas.toDataURL('image/png');
    const userInput = prompt('Veuillez donner le nom de votre mème :', 'meme_');
    
    if (userInput === null || userInput.trim() === '') {
        return;  
    }
    const fileName = (userInput.trim() !== '') ? userInput.trim() : 'meme_';

    const link = document.createElement('a');
    link.download = fileName + '.png';
    link.href = memeURL;
    link.click();
    
    // Stocker seulement si on a téléchargé (après le téléchargement réussi)
    let memes = JSON.parse(localStorage.getItem('memes')) || [];
    memes.unshift(memeURL);  
    localStorage.setItem('memes', JSON.stringify(memes));
    addToGallery(memeURL);  
});


// Partager le mème
shareButton.addEventListener('click', function() {
    if (!checkImageLoaded()) return;

    const memeURL = canvas.toDataURL();
    const blob = dataURLtoBlob(memeURL);
    const file = new File([blob], 'meme.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
            files: [file],
            title: 'Regarde mon mème !',
            text: 'Regarde mon mème'
        }).catch(err => console.log('⚠️ Échec du partage : ', err));
    } else {
        alert('❌ Votre appareil ne supporte pas le partage direct.');
    }
});

// convertion du dataURL en blod pour des operations
function dataURLtoBlob(dataURL) {
    let arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}