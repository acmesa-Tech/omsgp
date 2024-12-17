document.addEventListener('DOMContentLoaded', () => {
    const foodImage = document.getElementById('food-image');
    const foodGroup = document.getElementById('food-group');
    const foodURL = document.getElementById('food-url');
    const favoriteBtn = document.getElementById('favorite-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentFood = null;

    const url = "http://localhost:8000/";

    function fetchFood(category) {
        fetch(`https://foodish-api.com/api/images/${category}`)
            .then(response => response.json())
            .then(data => {
                currentFood = data.image;
                foodImage.src = currentFood;
                foodGroup.textContent = category;
                foodURL.textContent = currentFood;
                checkFavorite(currentFood);
            })
            .catch(error => console.error('Error fetching food image:', error));
    }
/*
    async function loadFavorites() {
        try {
            const response = await fetch(url + 'api/favorites');
            const favorites = await response.json();
            return favorites;
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }
*/

    async function loadFavorites() {
        try {
            const response = await fetch(url + '/api/favorites');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const favorites = await response.json();
            return favorites;
        } catch (error) {
            console.error('Error loading favorites:', error);
            return []; // Return an empty array in case of error
        }
    }


    async function checkFavorite(imageUrl) {
        const favorites = await loadFavorites();
        const isFavorite = favorites.some(fav => fav.image === imageUrl);
        favoriteBtn.className = isFavorite ? 'icon-heart-filled' : 'icon-heart-outline';
        favoriteBtn.textContent = isFavorite ? '❤️ Unlike it' : '🤍 Like it';
    }

    async function toggleFavorite() {
        const favorites = await loadFavorites();
        const index = favorites.findIndex(fav => fav.image === currentFood);
        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push({
                id: Date.now(),
                image: currentFood,
                category: foodGroup.textContent,
                'date-added': new Date().toLocaleDateString(),
            });
        }

        saveFavorites(favorites);
        checkFavorite(currentFood);
    }
/*
    function saveFavorites(favorites) {
        fetch(url + '/api/update-favs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorites),
        }).catch(error => console.error('Error saving favorites:', error));
    }

    async function saveFavorites(favorites) {
        try {
            const response = await fetch(url + 'api/update-favs', {  // Fix the double slashes
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(favorites)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Reload favorites after saving
            loadFavorites();
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }
*/

async function saveFavorites(favorites) {
    try {
        const response = await fetch('http://localhost:8000/api/update-favs', {  // Correct URL
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
    }
}


    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', () => fetchFood(radio.value));
    });

    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(); 
        fetchFood(foodGroup.textContent);
    });

    nextBtn.addEventListener('click', () => fetchFood(foodGroup.textContent));

    fetchFood('burger');
});