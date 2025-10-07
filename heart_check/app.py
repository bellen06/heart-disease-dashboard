from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)

# Muat model Naive Bayes (hasil training dari Cleveland dataset)
model = joblib.load("model/naive_bayes_heart.pkl")

@app.route('/')
def index():
    return render_template('heart_check_form.php')

@app.route('/proses_naive_bayes', methods=['POST'])
def proses_naive_bayes():
    usia = int(request.form['usia'])
    jenis_kelamin = 1 if request.form['jenis_kelamin'] == "Pria" else 0
    tekanan_map = {"Normal": 120, "Sedang": 140, "Tinggi": 160}
    kolesterol_map = {"Normal": 200, "Tinggi": 300}

    tekanan = tekanan_map[request.form['tekanan_darah']]
    kolesterol = kolesterol_map[request.form['kolesterol']]
    merokok = 1 if request.form['merokok'] == "Ya" else 0
    olahraga = 1 if request.form['olahraga'] == "Jarang" else 0
    riwayat = 1 if request.form['riwayat_keluarga'] == "Ya" else 0

    input_data = np.array([[usia, jenis_kelamin, tekanan, kolesterol, merokok, olahraga, riwayat]])
    prediksi = model.predict(input_data)[0]
    probabilitas = model.predict_proba(input_data)[0]

    hasil = "Berisiko Penyakit Jantung ❤️" if prediksi == 1 else "Sehat ❤️‍🩹"
    warna = "danger" if prediksi == 1 else "success"

    prob_risiko = round(probabilitas[1] * 100, 2)
    prob_sehat = round(probabilitas[0] * 100, 2)

    # Penjelasan medis otomatis
    if prob_risiko >= 70:
        penjelasan = "⚠️ Risiko tinggi terdeteksi. Disarankan segera konsultasi ke dokter spesialis jantung untuk pemeriksaan lebih lanjut."
    elif 40 <= prob_risiko < 70:
        penjelasan = "🩺 Risiko sedang. Disarankan menjaga pola makan sehat, olahraga rutin, dan hindari merokok."
    else:
        penjelasan = "✅ Risiko rendah. Tetap pertahankan gaya hidup sehat untuk menjaga kesehatan jantung Anda."

    return render_template(
        'index.html',
        hasil=hasil,
        warna=warna,
        prob_risiko=prob_risiko,
        prob_sehat=prob_sehat,
        penjelasan=penjelasan
    )

if __name__ == '__main__':
    app.run(debug=True)
