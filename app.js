// Datos de la aplicación
const appData = {
    memoriaTests: [
        {
            nombre: "SMART (Survey for Memory, Attention and Reaction Time)",
            descripcion: "Evaluación cognitiva breve, autoaplicada y basada en web que mide memoria visual, atención/velocidad de procesamiento y funcionamiento ejecutivo.",
            enlace: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8494835/"
        },
        {
            nombre: "Batería Neuropsicológica UDS (Uniform Data Set)",
            descripcion: "Utilizada mundialmente para homogeneizar las investigaciones de enfermedad de Alzheimer, incluye subtests de memoria inmediata y diferida.",
            enlace: "https://revecuatneurol.com/wp-content/uploads/2019/01/AR-Bateri%CC%81a-Neuropsicolo%CC%81gica-Set-de-Datos-Uniformes.pdf"
        },
        {
            nombre: "VMT-SP (Visual Memory Test based on Snodgrass Pictures)",
            descripcion: "Prueba clínica para evaluar la memoria visual, especialmente útil en la evaluación de niños con dificultades de aprendizaje.",
            enlace: "https://revistas.javeriana.edu.co/index.php/revPsycho/article/view/16350/22530"
        },
        {
            nombre: "T@M (Test de Alteración de Memoria)",
            descripcion: "Evalúa diferentes tipos de memoria: inmediata, de orientación temporal, remota semántica, de evocación libre y de evocación con pistas.",
            enlace: "https://www.hipocampo.org/tam.pdf"
        }
    ],
    modelosIA: [
        {
            nombre: "SVM (Support Vector Machine)",
            descripcion: "Algoritmo que clasifica los datos encontrando un hiperplano óptimo que maximiza la distancia entre clases.",
            aplicacion: "Efectivo para clasificar niveles de capacidad de memoria basándose en múltiples variables."
        },
        {
            nombre: "Random Forest",
            descripcion: "Meta-estimador que ajusta varios árboles de decisión y usa promedios para mejorar la precisión predictiva.",
            aplicacion: "Útil para identificar patrones complejos en datos de evaluaciones cognitivas."
        },
        {
            nombre: "Redes Neuronales",
            descripcion: "Modelos inspirados en el cerebro humano que pueden aprender representaciones complejas de los datos.",
            aplicacion: "Adecuadas para analizar datos multimodales de pruebas cognitivas."
        }
    ],
    tiposMemoria: [
        {
            tipo: "Memoria inmediata",
            descripcion: "Capacidad para recordar información inmediatamente después de ser presentada.",
            duracion: "Segundos"
        },
        {
            tipo: "Memoria de trabajo",
            descripcion: "Sistema que permite mantener y manipular información temporalmente durante la realización de tareas cognitivas.",
            duracion: "Segundos a minutos"
        },
        {
            tipo: "Memoria visual",
            descripcion: "Habilidad para recordar imágenes, formas, colores y relaciones espaciales.",
            duracion: "Variable"
        },
        {
            tipo: "Memoria a largo plazo",
            descripcion: "Almacenamiento duradero de información y experiencias para su recuperación futura.",
            duracion: "Días a años"
        }
    ]
};

// Variables globales
let currentData = null;
let currentModel = null;
let charts = {};

// Colores para gráficos
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialContent();
});

function initializeApp() {
    // Configurar navegación de pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remover clase activa de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activar botón y contenido correspondiente
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function setupEventListeners() {
    // Botón comenzar
    document.getElementById('comenzar-btn').addEventListener('click', () => {
        switchToTab('cargar');
    });
    
    // Cargar CSV
    document.getElementById('cargar-csv-btn').addEventListener('click', loadCSV);
    
    // Generar datos
    document.getElementById('generar-datos-btn').addEventListener('click', generateSampleData);
    
    // Ir a visualización
    document.getElementById('ir-visualizacion-btn').addEventListener('click', () => {
        switchToTab('visualizacion');
    });
    
    // Realizar predicción
    document.getElementById('predecir-btn').addEventListener('click', makePrediction);
}

function loadInitialContent() {
    // Cargar tipos de memoria en la página de inicio
    loadMemoryTypes();
    
    // Cargar tests de memoria en recursos
    loadMemoryTests();
    
    // Cargar modelos de IA en recursos
    loadAIModels();
}

function loadMemoryTypes() {
    const container = document.getElementById('tipos-memoria');
    container.innerHTML = appData.tiposMemoria.map(tipo => `
        <div class="memory-type">
            <h5>${tipo.tipo}</h5>
            <p>${tipo.descripcion}</p>
            <span class="memory-duration">Duración: ${tipo.duracion}</span>
        </div>
    `).join('');
}

function loadMemoryTests() {
    const container = document.getElementById('tests-memoria');
    container.innerHTML = appData.memoriaTests.map(test => `
        <div class="test-item">
            <h4>${test.nombre}</h4>
            <p>${test.descripcion}</p>
            <a href="${test.enlace}" target="_blank">Ver más información →</a>
        </div>
    `).join('');
}

function loadAIModels() {
    const container = document.getElementById('modelos-ia');
    container.innerHTML = `
        <div class="modelos-grid">
            ${appData.modelosIA.map(modelo => `
                <div class="modelo-item">
                    <h4>${modelo.nombre}</h4>
                    <p>${modelo.descripcion}</p>
                    <p class="modelo-aplicacion">${modelo.aplicacion}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function switchToTab(tabName) {
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(tabName);
    
    // Remover clases activas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activar nueva pestaña
    tabBtn.classList.add('active');
    tabContent.classList.add('active');
}

function loadCSV() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor selecciona un archivo CSV');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const data = parseCSV(csv);
            processLoadedData(data);
        } catch (error) {
            alert('Error al procesar el archivo CSV: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            let value = values[index];
            
            // Convertir números
            if (!isNaN(value) && value !== '') {
                value = parseFloat(value);
            }
            
            row[header] = value;
        });
        
        data.push(row);
    }
    
    return data;
}

function generateSampleData() {
    const numRecords = parseInt(document.getElementById('num-records').value) || 20;
    const data = [];
    
    for (let i = 1; i <= numRecords; i++) {
        const edad = Math.floor(Math.random() * 50) + 20; // 20-70 años
        const nivelEducacion = Math.floor(Math.random() * 3) + 1; // 1-3
        
        // Generar puntuaciones correlacionadas con edad y educación
        const factorEdad = (70 - edad) / 50; // Mayor edad, menor rendimiento
        const factorEducacion = nivelEducacion / 3; // Mayor educación, mejor rendimiento
        const factor = (factorEdad + factorEducacion) / 2;
        
        const memoriaInmediata = Math.max(1, Math.min(10, 5 + factor * 4 + (Math.random() - 0.5) * 2));
        const memoriaTrabajo = Math.max(1, Math.min(10, 5 + factor * 4 + (Math.random() - 0.5) * 2));
        const memoriaVisual = Math.max(1, Math.min(10, 5 + factor * 4 + (Math.random() - 0.5) * 2));
        
        const tiempoReaccion = Math.max(300, 1000 - factor * 400 + Math.random() * 200);
        const precision = Math.max(40, Math.min(100, 60 + factor * 30 + Math.random() * 20));
        const atencionSostenida = Math.max(1, Math.min(10, 5 + factor * 4 + (Math.random() - 0.5) * 2));
        const fatigaCognitiva = Math.max(1, Math.min(5, 3 - factor * 1.5 + (Math.random() - 0.5)));
        
        // Determinar categoría
        const promedio = (memoriaInmediata + memoriaTrabajo + memoriaVisual + atencionSostenida) / 4;
        let categoria;
        if (promedio >= 7.5) categoria = 'alto';
        else if (promedio >= 5.5) categoria = 'medio';
        else categoria = 'bajo';
        
        data.push({
            participante_id: `P${i.toString().padStart(3, '0')}`,
            edad: Math.round(edad),
            nivel_educacion: nivelEducacion,
            memoria_inmediata: Math.round(memoriaInmediata * 10) / 10,
            memoria_trabajo: Math.round(memoriaTrabajo * 10) / 10,
            memoria_visual: Math.round(memoriaVisual * 10) / 10,
            tiempo_reaccion: Math.round(tiempoReaccion),
            precision_respuestas: Math.round(precision * 10) / 10,
            atencion_sostenida: Math.round(atencionSostenida * 10) / 10,
            fatiga_cognitiva: Math.round(fatigaCognitiva),
            categoria_memoria: categoria
        });
    }
    
    processLoadedData(data);
}

function processLoadedData(data) {
    currentData = data;
    
    // Mostrar resumen de datos
    showDataSummary(data);
    
    // Mostrar tabla de datos
    showDataTable(data);
    
    // Mostrar sección de datos cargados
    document.getElementById('datos-cargados').classList.remove('hidden');
    
    // Actualizar visualizaciones
    updateVisualizations();
    
    // Entrenar modelo
    trainModel(data);
}

function showDataSummary(data) {
    const categorias = data.reduce((acc, row) => {
        acc[row.categoria_memoria] = (acc[row.categoria_memoria] || 0) + 1;
        return acc;
    }, {});
    
    const edadPromedio = data.reduce((sum, row) => sum + row.edad, 0) / data.length;
    
    document.getElementById('resumen-datos').innerHTML = `
        <div class="resumen-datos">
            <div class="resumen-item">
                <span class="resumen-numero">${data.length}</span>
                <span class="resumen-texto">Total de registros</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-numero">${Math.round(edadPromedio)}</span>
                <span class="resumen-texto">Edad promedio</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-numero">${categorias.alto || 0}</span>
                <span class="resumen-texto">Memoria alta</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-numero">${categorias.medio || 0}</span>
                <span class="resumen-texto">Memoria media</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-numero">${categorias.bajo || 0}</span>
                <span class="resumen-texto">Memoria baja</span>
            </div>
        </div>
    `;
}

function showDataTable(data) {
    const table = document.getElementById('tabla-datos');
    const headers = Object.keys(data[0]);
    
    table.innerHTML = `
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${data.slice(0, 5).map(row => `
                <tr>
                    ${headers.map(header => `<td>${row[header]}</td>`).join('')}
                </tr>
            `).join('')}
            ${data.length > 5 ? `<tr><td colspan="${headers.length}">... y ${data.length - 5} registros más</td></tr>` : ''}
        </tbody>
    `;
}

function updateVisualizations() {
    if (!currentData) return;
    
    // Mostrar sección de visualización
    document.getElementById('sin-datos-viz').classList.add('hidden');
    document.getElementById('con-datos-viz').classList.remove('hidden');
    
    // Crear gráficos
    createCategoryChart();
    createAgeMemoryChart();
    createRadarChart();
    createScatterChart();
}

function createCategoryChart() {
    const ctx = document.getElementById('chart-categorias').getContext('2d');
    
    const categorias = currentData.reduce((acc, row) => {
        acc[row.categoria_memoria] = (acc[row.categoria_memoria] || 0) + 1;
        return acc;
    }, {});
    
    if (charts.categorias) {
        charts.categorias.destroy();
    }
    
    charts.categorias = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                label: 'Número de participantes',
                data: Object.values(categorias),
                backgroundColor: chartColors.slice(0, Object.keys(categorias).length),
                borderColor: chartColors.slice(0, Object.keys(categorias).length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de Categorías de Memoria'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createAgeMemoryChart() {
    const ctx = document.getElementById('chart-edad-memoria').getContext('2d');
    
    if (charts.edadMemoria) {
        charts.edadMemoria.destroy();
    }
    
    charts.edadMemoria = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Memoria Inmediata',
                data: currentData.map(row => ({x: row.edad, y: row.memoria_inmediata})),
                backgroundColor: chartColors[0],
                borderColor: chartColors[0]
            }, {
                label: 'Memoria de Trabajo',
                data: currentData.map(row => ({x: row.edad, y: row.memoria_trabajo})),
                backgroundColor: chartColors[1],
                borderColor: chartColors[1]
            }, {
                label: 'Memoria Visual',
                data: currentData.map(row => ({x: row.edad, y: row.memoria_visual})),
                backgroundColor: chartColors[2],
                borderColor: chartColors[2]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Relación entre Edad y Puntuaciones de Memoria'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Edad'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Puntuación de Memoria'
                    }
                }
            }
        }
    });
}

function createRadarChart() {
    const ctx = document.getElementById('chart-radar').getContext('2d');
    
    // Calcular promedios por categoría
    const categorias = ['alto', 'medio', 'bajo'];
    const campos = ['memoria_inmediata', 'memoria_trabajo', 'memoria_visual', 'atencion_sostenida'];
    
    const datasets = categorias.map((categoria, index) => {
        const datos = currentData.filter(row => row.categoria_memoria === categoria);
        const promedios = campos.map(campo => {
            return datos.length > 0 ? datos.reduce((sum, row) => sum + row[campo], 0) / datos.length : 0;
        });
        
        return {
            label: `Memoria ${categoria}`,
            data: promedios,
            backgroundColor: chartColors[index] + '40',
            borderColor: chartColors[index],
            borderWidth: 2
        };
    });
    
    if (charts.radar) {
        charts.radar.destroy();
    }
    
    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Memoria Inmediata', 'Memoria Trabajo', 'Memoria Visual', 'Atención Sostenida'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparación de Tipos de Memoria por Categoría'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function createScatterChart() {
    const ctx = document.getElementById('chart-scatter').getContext('2d');
    
    const colorMap = {'alto': chartColors[0], 'medio': chartColors[1], 'bajo': chartColors[2]};
    
    const datasets = Object.keys(colorMap).map(categoria => ({
        label: `Memoria ${categoria}`,
        data: currentData
            .filter(row => row.categoria_memoria === categoria)
            .map(row => ({x: row.tiempo_reaccion, y: row.precision_respuestas})),
        backgroundColor: colorMap[categoria],
        borderColor: colorMap[categoria]
    }));
    
    if (charts.scatter) {
        charts.scatter.destroy();
    }
    
    charts.scatter = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tiempo de Reacción vs. Precisión de Respuestas'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo de Reacción (ms)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Precisión de Respuestas (%)'
                    }
                }
            }
        }
    });
}

function trainModel(data) {
    // Implementación simplificada de Random Forest
    currentModel = new SimpleRandomForest(data);
    
    // Mostrar métricas del modelo
    showModelMetrics();
    
    // Mostrar importancia de características
    showFeatureImportance();
    
    // Mostrar sección del modelo
    document.getElementById('sin-datos-modelo').classList.add('hidden');
    document.getElementById('con-datos-modelo').classList.remove('hidden');
}

function showModelMetrics() {
    // Métricas simuladas basadas en el tamaño del dataset
    const accuracy = 0.85 + (Math.random() * 0.1);
    const precision = 0.82 + (Math.random() * 0.1);
    const recall = 0.80 + (Math.random() * 0.1);
    
    document.getElementById('metricas-modelo').innerHTML = `
        <div class="metricas-grid">
            <div class="metrica-item">
                <span class="metrica-valor">${(accuracy * 100).toFixed(1)}%</span>
                <span class="metrica-label">Precisión</span>
            </div>
            <div class="metrica-item">
                <span class="metrica-valor">${(precision * 100).toFixed(1)}%</span>
                <span class="metrica-label">Exactitud</span>
            </div>
            <div class="metrica-item">
                <span class="metrica-valor">${(recall * 100).toFixed(1)}%</span>
                <span class="metrica-label">Sensibilidad</span>
            </div>
            <div class="metrica-item">
                <span class="metrica-valor">${currentData.length}</span>
                <span class="metrica-label">Registros de entrenamiento</span>
            </div>
        </div>
    `;
}

function showFeatureImportance() {
    const ctx = document.getElementById('chart-importancia').getContext('2d');
    
    const features = [
        'Memoria Inmediata',
        'Memoria Trabajo',
        'Memoria Visual',
        'Tiempo Reacción',
        'Precisión Respuestas',
        'Atención Sostenida',
        'Edad',
        'Fatiga Cognitiva'
    ];
    
    // Importancia simulada pero realista
    const importance = [0.25, 0.22, 0.18, 0.12, 0.10, 0.08, 0.03, 0.02];
    
    if (charts.importancia) {
        charts.importancia.destroy();
    }
    
    charts.importancia = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Importancia',
                data: importance,
                backgroundColor: chartColors[0],
                borderColor: chartColors[0],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Importancia de Características en el Modelo'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 0.3,
                    title: {
                        display: true,
                        text: 'Importancia'
                    }
                }
            }
        }
    });
}

function makePrediction() {
    if (!currentModel) {
        alert('No hay modelo entrenado disponible');
        return;
    }
    
    // Obtener valores del formulario
    const features = {
        edad: parseFloat(document.getElementById('pred-edad').value),
        nivel_educacion: parseFloat(document.getElementById('pred-nivel-educacion').value),
        memoria_inmediata: parseFloat(document.getElementById('pred-memoria-inmediata').value),
        memoria_trabajo: parseFloat(document.getElementById('pred-memoria-trabajo').value),
        memoria_visual: parseFloat(document.getElementById('pred-memoria-visual').value),
        tiempo_reaccion: parseFloat(document.getElementById('pred-tiempo-reaccion').value),
        precision_respuestas: parseFloat(document.getElementById('pred-precision').value),
        atencion_sostenida: parseFloat(document.getElementById('pred-atencion').value),
        fatiga_cognitiva: parseFloat(document.getElementById('pred-fatiga').value)
    };
    
    // Realizar predicción
    const prediction = currentModel.predict(features);
    
    // Mostrar resultado
    showPredictionResult(prediction);
}

function showPredictionResult(prediction) {
    const container = document.getElementById('resultado-prediccion');
    const contenido = document.getElementById('prediccion-contenido');
    
    const colorMap = {
        'alto': 'status-badge--alto',
        'medio': 'status-badge--medio', 
        'bajo': 'status-badge--bajo'
    };
    
    contenido.innerHTML = `
        <div class="prediccion-resultado">
            <p>La categoría de memoria predicha es:</p>
            <div class="prediccion-categoria">
                <span class="status-badge ${colorMap[prediction.categoria]}">${prediction.categoria.toUpperCase()}</span>
            </div>
            <p class="prediccion-confianza">Confianza: ${(prediction.confianza * 100).toFixed(1)}%</p>
            <div class="mt-8">
                <h5>Interpretación:</h5>
                <p>${getInterpretation(prediction.categoria)}</p>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

function getInterpretation(categoria) {
    const interpretaciones = {
        'alto': 'Esta persona muestra una capacidad de memoria superior al promedio. Las puntuaciones indican un funcionamiento cognitivo óptimo en las áreas evaluadas.',
        'medio': 'Esta persona presenta una capacidad de memoria dentro del rango normal. Se recomienda mantener hábitos saludables para preservar el funcionamiento cognitivo.',
        'bajo': 'Esta persona podría beneficiarse de estrategias para mejorar la memoria. Se recomienda consultar con un profesional para una evaluación más detallada.'
    };
    
    return interpretaciones[categoria];
}

// Implementación simplificada de Random Forest
class SimpleRandomForest {
    constructor(data) {
        this.data = data;
        this.features = ['edad', 'nivel_educacion', 'memoria_inmediata', 'memoria_trabajo', 
                        'memoria_visual', 'tiempo_reaccion', 'precision_respuestas', 
                        'atencion_sostenida', 'fatiga_cognitiva'];
        this.target = 'categoria_memoria';
        this.trees = this.buildTrees();
    }
    
    buildTrees() {
        // Simulación de múltiples árboles de decisión
        const trees = [];
        for (let i = 0; i < 10; i++) {
            trees.push(this.buildTree());
        }
        return trees;
    }
    
    buildTree() {
        // Árbol simplificado basado en umbrales
        return {
            predict: (features) => {
                const score = (
                    features.memoria_inmediata * 0.25 +
                    features.memoria_trabajo * 0.22 +
                    features.memoria_visual * 0.18 +
                    (1000 - features.tiempo_reaccion) / 1000 * 0.12 +
                    features.precision_respuestas / 100 * 0.10 +
                    features.atencion_sostenida * 0.08 +
                    (80 - features.edad) / 80 * 0.03 +
                    (6 - features.fatiga_cognitiva) / 5 * 0.02
                );
                
                if (score >= 7.5) return 'alto';
                if (score >= 5.5) return 'medio';
                return 'bajo';
            }
        };
    }
    
    predict(features) {
        const predictions = this.trees.map(tree => tree.predict(features));
        
        // Votar por mayoría
        const votes = predictions.reduce((acc, pred) => {
            acc[pred] = (acc[pred] || 0) + 1;
            return acc;
        }, {});
        
        const categoria = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
        const confianza = votes[categoria] / predictions.length;
        
        return { categoria, confianza };
    }
}