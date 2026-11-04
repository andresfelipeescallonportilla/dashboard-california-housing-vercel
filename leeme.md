# Dashboard California Housing

Este proyecto es un panel interactivo para explorar el conjunto de datos **California Housing** y estimar el valor mediano de las viviendas mediante una red neuronal de tipo MLP entrenada con scikit-learn.

Es una reconstrucción con **Next.js** de una aplicación original en Python hecha con Streamlit y Gradio. La nueva versión puede publicarse como un sitio estático y sin servidor en Vercel.

## Funcionalidades

El panel tiene cinco pestañas y su interfaz está en español:

| Pestaña | Contenido |
| --- | --- |
| **Explicación** | Presentación del problema, el conjunto de datos y el modelo |
| **Datos y estadísticas** | Vista previa de los datos y estadísticas descriptivas de cada variable |
| **Análisis exploratorio** | Histogramas de distribución, relación entre ingresos y valor de vivienda, distribución geográfica y matriz de correlación |
| **Simulador** | Controles para las ocho variables de entrada, predicción inmediata, métricas del modelo e histograma de residuos |
| **Conclusiones** | Hallazgos principales y limitaciones del modelo |

## Datos y modelo

- **Conjunto de datos:** `sklearn.datasets.fetch_california_housing`, con 20.640 grupos de bloques y 8 características.
- **Características de entrada:** `MedInc`, `HouseAge`, `AveRooms`, `AveBedrms`, `Population`, `AveOccup`, `Latitude` y `Longitude`.
- **Variable objetivo:** `MedHouseVal`, el valor mediano de la vivienda expresado en unidades de 100.000 dólares.
- **Preprocesamiento:** `StandardScaler` y separación de entrenamiento/prueba de 80/20 con `random_state=42`.
- **Arquitectura:** `MLPRegressor` con capas ocultas `(64, 64, 32)`, activación ReLU y optimizador Adam.

Métricas informadas para el conjunto de prueba:

| Métrica | Valor |
| --- | --- |
| R² | 0,800 |
| RMSE | 0,512 |
| MAE | 0,342 |
| MAPE | 19,2 % |

El script `scripts/export_model.py` entrena el modelo y exporta los archivos `lib/data/housing.json` (estadísticas, datos agregados para gráficos, residuos y métricas) y `lib/data/model.json` (parámetros del escalador, pesos y sesgos de la red). `lib/model.ts` implementa en TypeScript el cálculo de inferencia —escalado, capas densas y ReLU—, por lo que las predicciones se realizan en el navegador sin un servidor Python.

## Tecnologías y estructura

El proyecto utiliza Next.js con App Router, React, TypeScript, Tailwind CSS, shadcn/ui y Recharts. scikit-learn solo se necesita fuera de línea si se desea reentrenar y exportar el modelo.

- `app/`: diseño general y página principal.
- `components/dashboard/`: pestañas y gráficos del panel.
- `components/ui/`: componentes de shadcn/ui.
- `lib/data/`: datos exportados y pesos del modelo en JSON.
- `lib/housing.ts`: acceso tipado a los datos.
- `lib/model.ts`: inferencia del MLP en TypeScript.
- `scripts/export_model.py`: entrenamiento y exportación del modelo.

## Clonar el repositorio en Visual Studio Code y ejecutarlo localmente

1. Instala [Git](https://git-scm.com/downloads), [Node.js 20.9 o posterior](https://nodejs.org/) y [Visual Studio Code](https://code.visualstudio.com/). El proyecto especifica pnpm `12.3.4` en `package.json`.
2. Abre Visual Studio Code y la paleta de comandos (`Ctrl+Shift+P` en Windows/Linux o `Cmd+Shift+P` en macOS).
3. Ejecuta **Git: Clone**, pega la URL `https://github.com/andresfelipeescallonportilla/dashboard-california-housing-vercel.git` y selecciona la carpeta donde quieres guardar el repositorio.
4. Cuando termine la clonación, selecciona **Open** para abrir el repositorio en Visual Studio Code. Si aparece una solicitud, confirma que confías en la carpeta. También puedes abrirlo con **File > Open Folder** y elegir la carpeta clonada `dashboard-california-housing-vercel`.
5. Abre una terminal integrada desde **Terminal > New Terminal**. Comprueba que la terminal esté ubicada en la raíz del repositorio, donde se encuentra `package.json`.
6. Si pnpm aún no está instalado, instala la versión indicada por el proyecto ejecutando `npm install --global pnpm@12.3.4` en la terminal.
7. Instala las dependencias del proyecto:

   ```bash
   pnpm install
   ```

8. Inicia el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

9. Abre [http://localhost:3000](http://localhost:3000) en el navegador. Mantén abierta la terminal mientras utilizas el panel; para detener el servidor, vuelve a esa terminal y presiona `Ctrl+C`.
10. Para compilar y ejecutar localmente la versión de producción, detén primero el servidor de desarrollo y ejecuta:

    ```bash
    pnpm build
    pnpm start
    ```

    Cuando termine la compilación y se inicie el servidor, abre [http://localhost:3000](http://localhost:3000). Presiona `Ctrl+C` en la terminal para detenerlo. Para el uso normal no necesitas instalar Python ni configurar variables de entorno.

### Reentrenamiento opcional del modelo

Para volver a entrenar el modelo se necesita Python 3 con `numpy` y `scikit-learn`. Ejecuta estos comandos desde la raíz del repositorio:

```bash
pip install numpy scikit-learn
python scripts/export_model.py
```

El script vuelve a generar `lib/data/housing.json` y `lib/data/model.json`.

## Despliegue en Vercel

El proyecto puede desplegarse directamente en [Vercel](https://vercel.com), sin configuración adicional ni variables de entorno.
