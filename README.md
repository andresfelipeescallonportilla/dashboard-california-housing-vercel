# Dashboard California Housing

Interactive dashboard for the **California Housing** dataset. It explores the data and predicts median house values with a neural network (MLP) trained with scikit-learn.

This is a **Next.js** rebuild of the original Python app ([dashboard-califiornia-housing](https://github.com/andresfelipeescallonportilla/dashboard-califiornia-housing), built with Streamlit and Gradio). The rebuild lets it run as a static, serverless site on Vercel.

## Features

The dashboard is organized into five tabs (the interface is in Spanish):

| Tab | Content |
| --- | --- |
| **Explicación** | Introduction to the problem, the dataset, and the model |
| **Datos y estadísticas** | Data preview and descriptive statistics for every variable |
| **Análisis exploratorio** | Distribution histograms, income vs. value scatter plot, geographic distribution, and correlation matrix |
| **Simulador** | Sliders for the 8 input variables, an instant price prediction, model metrics, and a residuals histogram |
| **Conclusiones** | Main findings and model limitations |

## Model

- **Dataset:** `sklearn.datasets.fetch_california_housing` (20,640 block groups, 8 features)
- **Features:** `MedInc`, `HouseAge`, `AveRooms`, `AveBedrms`, `Population`, `AveOccup`, `Latitude`, `Longitude`
- **Target:** `MedHouseVal` (median house value, in units of $100,000)
- **Preprocessing:** `StandardScaler`, 80/20 train/test split (`random_state=42`)
- **Architecture:** `MLPRegressor` with hidden layers `(64, 64, 32)`, ReLU activation, Adam optimizer

Test set metrics:

| Metric | Value |
| --- | --- |
| R² | 0.800 |
| RMSE | 0.512 |
| MAE | 0.342 |
| MAPE | 19.2% |

### How inference works without Python

`scripts/export_model.py` trains the model and exports the following to `lib/data/`:

- `housing.json`: statistics, aggregated chart data, residuals, and metrics
- `model.json`: scaler parameters and the MLP weights and biases

`lib/model.ts` reimplements the forward pass (scaling, dense layers, ReLU) in TypeScript. Predictions run in the browser with no backend and match the scikit-learn output.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org) for charts
- scikit-learn (offline only, to train and export the model)

## Project structure

```
app/                    # Layout and main page
components/dashboard/   # Dashboard tabs and charts
components/ui/          # shadcn/ui components
lib/data/               # Exported data and model weights (JSON)
lib/housing.ts          # Typed access to the data
lib/model.ts            # MLP inference in TypeScript
scripts/export_model.py # Model training and export
```

## Local development

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Retrain the model (optional)

Requires Python 3 with `numpy` and `scikit-learn`:

```bash
pip install numpy scikit-learn
python scripts/export_model.py
```

This regenerates `lib/data/housing.json` and `lib/data/model.json`.

## Deployment

The project deploys directly to [Vercel](https://vercel.com) with no extra configuration or environment variables.

### Clone and run locally in Visual Studio Code

1. Install [Git](https://git-scm.com/downloads), [Node.js 20.9 or newer](https://nodejs.org/), and [Visual Studio Code](https://code.visualstudio.com/). The project pins pnpm to version `12.3.4` in `package.json`.
2. Open Visual Studio Code and open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS).
3. Run **Git: Clone**, enter `https://github.com/andresfelipeescallonportilla/dashboard-california-housing-vercel.git`, and select the parent folder where you want the project saved.
4. When cloning finishes, select **Open** to open the cloned repository in Visual Studio Code. If prompted, trust the folder. Alternatively, use **File > Open Folder** and choose the cloned `dashboard-california-housing-vercel` folder.
5. In Visual Studio Code, choose **Terminal > New Terminal**. Confirm that the terminal is at the repository root, where `package.json` is located.
6. Install pnpm `12.3.4` if it is not already available. For example, run `npm install --global pnpm@12.3.4` in a terminal.
7. Install the project dependencies:

   ```bash
   pnpm install
   ```

8. Start the development server:

   ```bash
   pnpm dev
   ```

9. Open [http://localhost:3000](http://localhost:3000) in a browser. Keep the terminal running while you use the dashboard; press `Ctrl+C` there to stop the server.
10. To verify and run a production build locally instead, stop the development server, then run:

    ```bash
    pnpm build
    pnpm start
    ```

    Once the build completes and the server starts, open [http://localhost:3000](http://localhost:3000). Press `Ctrl+C` to stop it. No Python installation or environment variables are needed for normal use.
