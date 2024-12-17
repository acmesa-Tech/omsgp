/*

// Control + shift + P  <sqlite: run all queries>
// SQLite: Open Database
create table favorites
(
  user_id number not null,
  message_id number not null,
  primary key (user_id, message_id),
  foreign key (user_id) references users (user_id),
  foreign key (message_id) references messages (message_id)
);

CREATE TABLE favorites (
    id INTEGER PRIMARY KEY,
    image TEXT,
    category TEXT,
    date_added TEXT
);

CREATE INDEX idx_favorites_id ON favorites(id);



CREATE TABLE favorites (
    id INTEGER PRIMARY KEY,
    image TEXT,
    category TEXT NOT NULL,
    date_added TEXT TEXT NOT NULL
);

CREATE INDEX idx_favorites_id ON favorites(id);

*/

INSERT INTO favorites (id, image, category, date_added) VALUES
(1731398524224, 'https://foodish-api.com/images/pizza/pizza39.jpg', 'pizza', '11/12/2024'),
(1731398533880, 'https://foodish-api.com/images/pizza/pizza86.jpg', 'pizza', '11/12/2024'),
(1731398539459, 'https://foodish-api.com/images/pizza/pizza42.jpg', 'pizza', '11/12/2024'),
(1731400303299, 'https://foodish-api.com/images/burger/burger75.jpg', 'burger', '11/12/2024'),
(1731400308743, 'https://foodish-api.com/images/burger/burger70.jpg', 'burger', '11/12/2024'),
(1731400312509, 'https://foodish-api.com/images/burger/burger78.jpg', 'burger', '11/12/2024'),
(1731400328779, 'https://foodish-api.com/images/pizza/pizza87.jpg', 'pizza', '11/12/2024'),
(1731400347626, 'https://foodish-api.com/images/rice/rice29.jpg', 'rice', '11/12/2024'),
(1731400347627, 'https://foodish-api.com/images/burger/burger21.jpg', 'burger', '11/12/2024'),
(1731400355503, 'https://foodish-api.com/images/rice/rice17.jpg', 'rice', '11/12/2024');
