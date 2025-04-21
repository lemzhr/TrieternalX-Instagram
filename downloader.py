from flask import Flask, render_template, request, jsonify, send_file
import instaloader
import requests
import os

app = Flask(__name__)

def download_instaloader(url):
    try:
        loader = instaloader.Instaloader()
        shortcode = url.split("/")[-2]
        post = instaloader.Post.from_shortcode(loader.context, shortcode)

        return post.video_url if post.is_video else post.url
    except Exception as e:
        print("[ERROR] Instaloader:", str(e))
        return None

# Fungsi untuk mendownload dengan API RapidAPI
def download_rapidapi(url):
    api_url = "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php"
    headers = {
        "X-RapidAPI-Host": "instagram-media-downloader.p.rapidapi.com",
        "X-RapidAPI-Key": "b0dfdb1b04mshc94f98ab5787778p1c260ajsnf93e82d928e6"
    }
    response = requests.get(api_url, headers=headers, params={"url": url})

    print(response.json())  # ✅ Tambahkan ini untuk debugging

    return response.json().get("video_url") or response.json().get("image_url")


@app.route("/download", methods=["POST"])
def download():
    url = request.json.get("url")
    if not url:
        return jsonify({"success": False, "message": "URL tidak boleh kosong"}), 400

    download_url = download_instaloader(url) or download_rapidapi(url)
    if not download_url:
        return jsonify({"success": False, "message": "Gagal mendownload"}), 400

    try:
        # Download file dari URL Instagram
        response = requests.get(download_url, stream=True)
        if response.status_code == 200:
            filename = download_url.split("/")[-1]
            file_path = os.path.join("downloads", filename)

            # Simpan file sementara
            with open(file_path, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)

            return jsonify({"success": True, "download_link": f"/fetch-file?file={filename}"})
    except Exception as e:
        print("[ERROR] Download File:", str(e))

    return jsonify({"success": False, "message": "Gagal menyimpan file"}), 400

@app.route("/fetch-file")
def fetch_file():
    filename = request.args.get("file")
    file_path = os.path.join("downloads", filename)

    if not os.path.exists(file_path):
        return "File tidak ditemukan!", 400

    return send_file(file_path, as_attachment=True)

if __name__ == "__main__":
    if not os.path.exists("downloads"):
        os.makedirs("downloads")
    app.run(debug=True)