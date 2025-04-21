from flask import Flask, render_template, send_from_directory, request, jsonify
from downloader import download_instaloader, download_rapidapi
import os

app = Flask(__name__, static_folder="static", static_url_path="/static")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/faq")
def faq():
    return render_template("faq.html")


@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

@app.route("/download", methods=["POST"])
def download():
    url = request.json.get("url")

    if not url or "instagram.com" not in url:
        return jsonify({"success": False, "message": "URL tidak valid"}), 400

    result = download_instaloader(url) or download_rapidapi(url)

    if result:
        return jsonify({"success": True, "url": result})
    return jsonify({"success": False, "message": "Gagal mendownload"}), 500

if __name__ == "__main__":
    app.run(debug=True)