import joblib
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer

# Load model yang sudah dilatih
model = joblib.load("model/naive_bayes_model.pkl")

# Fungsi prediksi (untuk menerima data dari form)
def prediksi_jantung(form_data):
    """
    form_data: dictionary dari input form HTML
    contoh:
    {
        'age': 52,
        'sex': 1,
        'cp': 0,
        'trestbps': 130,
        'chol': 250,
        'fbs': 0,
        'restecg': 1,
        'thalach': 150,
        'exang': 0,
        'oldpeak': 1.2,
        'slope': 2,
        'ca': 0,
        'thal': 2
    }
    """
    # Ubah ke DataFrame agar kompatibel dengan model
    df = pd.DataFrame([form_data])

    # Pastikan tidak ada missing value
    imputer = SimpleImputer(strategy='mean')
    df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

    # Prediksi
    prediksi = model.predict(df)[0]
    probabilitas = model.predict_proba(df)[0][1] * 100

    hasil = {
        "prediksi": int(prediksi),
        "risiko": "Tinggi" if prediksi == 1 else "Rendah",
        "probabilitas": round(probabilitas, 2)
    }
    return hasil


# Tes manual (hapus saat dihubungkan ke form web)
if __name__ == "__main__":
    contoh_input = {
        'age': 54,
        'sex': 1,
        'cp': 2,
        'trestbps': 130,
        'chol': 246,
        'fbs': 0,
        'restecg': 0,
        'thalach': 150,
        'exang': 0,
        'oldpeak': 1.0,
        'slope': 2,
        'ca': 0,
        'thal': 2
    }
    hasil = prediksi_jantung(contoh_input)
    print("Prediksi Risiko:", hasil["risiko"])
    print("Probabilitas:", hasil["probabilitas"], "%")
