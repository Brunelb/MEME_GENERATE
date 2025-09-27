// fonction pour afficher et disposer les images dans la galerie 
  function displayGallery() {
        const galleryDiv = document.getElementById('meme-gallery');  // ID corrigé !
            if (!galleryDiv) {
                console.error('Erreur : Div #meme-gallery non trouvée.');
                return;
            }
            
        galleryDiv.innerHTML = ''; 
            try {
                let memes = JSON.parse(localStorage.getItem('memes')) || [];
                if (memes.length === 0) {
                    galleryDiv.innerHTML = '<p style="text-align: center; color: #999;">Aucun mème sauvegardé pour le moment. Générez-en un !</p>';
                    return;
                }
                memes.forEach((url, index) => {
                    const imgContainer = document.createElement('div');

                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = `Mème ${index + 1}`;
                    img.style.cssText = 'max-width: 300px; max-height: 300px; border: 1px solid #ddd; border-radius: 8px;';  
                    img.className = 'meme-image';  
                    imgContainer.appendChild(img);
                    galleryDiv.appendChild(imgContainer);
                });
            } catch {
           }
        }
// fonction pour effacer les images qui sont dans la galerie 
   function clearGallery() {
            if (confirm('Voulez-vous vraiment effacer tous les mèmes ?')) {
                localStorage.removeItem('memes');
                displayGallery();  
            }
        }
 // Chargement au démarrage
 window.addEventListener('load', displayGallery); 