document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const urlapi = "http://localhost:8000/";  // Make sure this is the correct backend URL

    async function loadFavorites(category) {
        try {
            const response = await fetch(urlapi + 'api/favorites');  // Corrected: use urlapi
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const text = await response.text(); // Retrieve the response as plain text
            try {
                const favorites = JSON.parse(text); // Try parsing it as JSON
                const filteredFavorites = category === 'all' ? favorites : favorites.filter(fav => fav.category === category);
                displayFavorites(filteredFavorites);
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                galleryContainer.innerHTML = "<p>Error parsing favorites. Please check the file format.</p>";
            }
        } catch (fetchError) {
            console.error("Error fetching favorites:", fetchError);
            galleryContainer.innerHTML = "<p>Error loading favorites. Please try again later.</p>";
        }
    }

    function displayFavorites(favorites) {
        galleryContainer.innerHTML = '';
        if (favorites.length === 0) {
            galleryContainer.innerHTML = '<p>No favorites found for this category.</p>';
            return;
        }

        favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${fav.image}" alt="${fav.category}">
                <p>Category: ${fav.category}</p>
                <p class="card-smallLetter">URL: ${fav['image']}</p>
                <p class="card-mediumLetter">Date added: ${fav['date_added']}</p>
                <div class="card-actions">
                    <button class="icon-heart-filled" data-id="${fav.id}">❤️ Unlike it</button>
                    <button class="icon-open" data-id="${fav.id}"></button>
                </div>
            `;
            galleryContainer.appendChild(card);

            card.querySelector('.icon-heart-filled').addEventListener('click', () => unfavorite(fav.id));
            card.querySelector('.icon-open').addEventListener('click', () => openImage(fav.id));
        });
    }

    function unfavorite(id) {
        fetch(urlapi + 'api/favorites')  // Corrected: use urlapi
            .then(response => response.json())
            .then(favorites => {
                const updated = favorites.filter(fav => fav.id !== id);
                saveFavorites(updated);
            });
    }

    /*
    function saveFavorites(favorites) {
        fetch(urlapi + '/api/update-favs', {  // Corrected: use urlapi
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorites),
        }).then(() => loadFavorites(document.querySelector('input[name="category"]:checked').value));
    }
    */

    async function saveFavorites(favorites) {
        try {
            const response = await fetch(urlapi + 'api/update-favs', {  // Correct the URL
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'  // Ensure the correct header is set
                },
                body: JSON.stringify(favorites)  // Send the favorites data as JSON
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Reload favorites after saving
            loadFavorites();
        } catch (error) {
            console.error('Error saving favorites:', error);
            galleryContainer.innerHTML = "<p>Error saving favorites. Please try again later.</p>";
        }
    }

    categoryRadios.forEach(radio => {
        radio.addEventListener('change', () => loadFavorites(radio.value));
    });

    loadFavorites('all');
});