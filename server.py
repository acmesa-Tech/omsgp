import sqlite3
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

DB_FILE = 'OMSGP.db'  # Your SQLite database file

class HTTPRequestHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        """Send CORS headers to allow cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow all origins for simplicity
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')  # Allowed HTTP methods
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Allowed headers

    def do_OPTIONS(self):
        """Handle OPTIONS preflight request."""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests."""
        if self.path == '/api/favorites':
            self.get_favorites()
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        """Handle POST requests."""
        if self.path == '/api/update-favs':
            self.add_favorite()
        else:
            self.send_error(404, "Not Found")

    def get_favorites(self):
        """Fetch all favorites from the database and return them."""
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM favorites')
        rows = cursor.fetchall()
        favorites = [{'id': row[0], 'image': row[1], 'category': row[2], 'date_added': row[3]} for row in rows]
        conn.close()

        self.send_response(200)
        self.send_cors_headers()  # Add CORS headers
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(favorites).encode())

    def add_favorite(self):
        """Add a new favorite to the database."""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            print("Received data:", data)  # Debugging: print the received data

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('INSERT INTO favorites (id, image, category, date_added) VALUES (?, ?, ?, ?)',
                           (data['id'], data['image'], data['category'], data['date_added']))
            conn.commit()
            conn.close()

            self.send_response(200)
            self.send_cors_headers()  # Add CORS headers
            self.end_headers()
        except Exception as e:
            print("Error processing the POST request:", e)  # Debugging: print any errors
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Failed to add favorite'}).encode())

# Start the server
def run(server_class=HTTPServer, handler_class=HTTPRequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()