"""Trains the MLP from the original Streamlit app and exports data + weights as JSON for the Next.js dashboard."""
import json
import os
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error, r2_score

OUT = os.path.join(os.path.dirname(__file__), "..", "lib", "data")
os.makedirs(OUT, exist_ok=True)

df = fetch_california_housing(as_frame=True).frame
X = df.drop(columns=["MedHouseVal"])
y = df["MedHouseVal"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
Xtr = scaler.fit_transform(X_train)
Xte = scaler.transform(X_test)
model = MLPRegressor(hidden_layer_sizes=(64, 64, 32), activation="relu", solver="adam", alpha=0.0001,
                     batch_size=64, learning_rate_init=0.001, max_iter=100, random_state=42)
model.fit(Xtr, y_train)
y_pred = model.predict(Xte).flatten()

mse = mean_squared_error(y_test, y_pred)
metrics = {
    "mse": float(mse), "rmse": float(np.sqrt(mse)),
    "mae": float(mean_absolute_error(y_test, y_pred)),
    "mape": float(mean_absolute_percentage_error(y_test, y_pred)),
    "r2": float(r2_score(y_test, y_pred)),
}


def hist(values, bins=40):
    counts, edges = np.histogram(values, bins=bins)
    return [{"x": round(float((edges[i] + edges[i + 1]) / 2), 3), "count": int(c)} for i, c in enumerate(counts)]


def r(v, d=4):
    return round(float(v), d)


rng = np.random.default_rng(42)
sample = df.iloc[rng.choice(len(df), 2500, replace=False)]
cols = list(df.columns)
desc = df.describe()

data = {
    "columns": cols,
    "rows": len(df),
    "head": [{c: r(row[c]) for c in cols} for _, row in df.head(20).iterrows()],
    "describe": [{"stat": s, **{c: r(desc.loc[s, c]) for c in cols}} for s in desc.index],
    "histHouseVal": hist(df["MedHouseVal"]),
    "histMedInc": hist(df["MedInc"]),
    "scatter": [{"x": r(a, 3), "y": r(b, 3)} for a, b in zip(sample["MedInc"], sample["MedHouseVal"])],
    "geo": [{"lon": r(a, 3), "lat": r(b, 3), "v": r(c, 3)}
            for a, b, c in zip(sample["Longitude"], sample["Latitude"], sample["MedHouseVal"])],
    "corr": [[r(v, 3) for v in row] for row in df.corr().values],
    "residuals": hist(y_test.values - y_pred),
    "metrics": metrics,
}
weights = {
    "mean": scaler.mean_.tolist(), "scale": scaler.scale_.tolist(),
    "W": [w.tolist() for w in model.coefs_], "b": [b.tolist() for b in model.intercepts_],
}
with open(os.path.join(OUT, "housing.json"), "w") as f:
    json.dump(data, f, separators=(",", ":"))
with open(os.path.join(OUT, "model.json"), "w") as f:
    json.dump(weights, f, separators=(",", ":"))

test = np.array([[3.8, 28, 5.4, 1.0, 1425, 3.0, 35.6, -119.5]])
print(metrics, model.predict(scaler.transform(test)))
