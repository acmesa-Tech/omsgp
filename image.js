document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); 

    fetch(`http://localhost:8000/api/favorite?id=${id}`)
        .then(response => response.json())
        .then(favorite => {
            if (favorite) {
                document.getElementById('food-image').src = favorite.image;
                document.getElementById('group').textContent = favorite.category;
                document.getElementById('url').textContent = favorite.image;
                document.getElementById('date').textContent = favorite['date_added'];

                document.getElementById('favorite-btn').addEventListener('click', () => {
                    unfavorite(id);
                });

                document.getElementById('back-btn').addEventListener('click', () => {
                    window.history.back();
                });
            }
        });

    function unfavorite(id) {
        fetch(`http://localhost:8000/api/favorite?id=${id}`)
            .then(response => response.json())
            .then(favorites => {
                const updated = favorites.filter(fav => fav.id !== id);
                saveFavorites(updated);
            });
    }

    function saveFavorites(favorites) {
        fetch('http://localhost:8000/api/update-favs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorites),
        }).then(() => window.location.href = 'gallery.html');
    }
});
