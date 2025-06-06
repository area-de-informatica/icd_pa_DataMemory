
# Ejemplo de Implementación: Filtrado de Datos con IA para OVA de Memoria
# Este código muestra cómo analizar y filtrar datos de estudiantes usando técnicas de IA

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import seaborn as sns
import matplotlib.pyplot as plt

class AnalysisDatosMemoriaOVA:
    """
    Clase para análisis de datos de memoria de estudiantes en OVA de Ciencia de Datos
    """

    def __init__(self, dataset_path):
        self.data = pd.read_csv(dataset_path)
        self.scaler = StandardScaler()

    def preprocesar_datos(self):
        """Limpia y prepara los datos para análisis"""
        # Convertir variables categóricas
        self.data['uso_herramientas_ia_numeric'] = self.data['uso_herramientas_ia'].map({
            'bajo': 0, 'medio': 1, 'alto': 2
        })

        # Crear variable objetivo: rendimiento alto/bajo
        media_rendimiento = (self.data['rendimiento_matematicas'] + 
                           self.data['rendimiento_programacion']) / 2
        self.data['rendimiento_alto'] = (media_rendimiento > media_rendimiento.median()).astype(int)

        return self.data

    def filtrar_estudiantes_riesgo(self):
        """Identifica estudiantes en riesgo académico"""
        # Criterios de riesgo
        criterios_riesgo = (
            (self.data['memoria_trabajo_score'] < 60) |
            (self.data['nivel_estres'] > 7) |
            (self.data['tiempo_atencion_mins'] < 15) |
            (self.data['efectividad_ova'] < 3.0)
        )

        estudiantes_riesgo = self.data[criterios_riesgo]
        return estudiantes_riesgo

    def clustering_perfiles_memoria(self, n_clusters=4):
        """Agrupa estudiantes según perfiles de memoria"""
        variables_memoria = ['memoria_corto_plazo', 'memoria_trabajo_score', 
                           'memoria_visual_score', 'tiempo_atencion_mins']

        X = self.data[variables_memoria]
        X_scaled = self.scaler.fit_transform(X)

        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.data['perfil_memoria'] = kmeans.fit_predict(X_scaled)

        return self.data

    def predecir_efectividad_ova(self):
        """Predice la efectividad del OVA para nuevos estudiantes"""
        features = ['edad', 'semestre', 'memoria_corto_plazo', 'memoria_trabajo_score',
                   'memoria_visual_score', 'tiempo_atencion_mins', 'horas_estudio_semanal',
                   'nivel_estres', 'uso_herramientas_ia_numeric']

        X = self.data[features]
        y = (self.data['efectividad_ova'] > 4.0).astype(int)  # Alta efectividad = 1

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        modelo = RandomForestClassifier(n_estimators=100, random_state=42)
        modelo.fit(X_train, y_train)

        # Importancia de características
        importancia = pd.DataFrame({
            'caracteristica': features,
            'importancia': modelo.feature_importances_
        }).sort_values('importancia', ascending=False)

        return modelo, importancia

    def generar_recomendaciones(self, estudiante_id):
        """Genera recomendaciones personalizadas para un estudiante"""
        estudiante = self.data[self.data['estudiante_id'] == estudiante_id].iloc[0]
        recomendaciones = []

        # Analizar memoria de trabajo
        if estudiante['memoria_trabajo_score'] < 70:
            recomendaciones.append("Ejercicios de entrenamiento de memoria de trabajo")
            recomendaciones.append("Técnicas de fragmentación de información")

        # Analizar tiempo de atención
        if estudiante['tiempo_atencion_mins'] < 20:
            recomendaciones.append("Técnicas de mindfulness y concentración")
            recomendaciones.append("Sesiones de estudio más cortas y frecuentes")

        # Analizar nivel de estrés
        if estudiante['nivel_estres'] > 7:
            recomendaciones.append("Técnicas de manejo del estrés")
            recomendaciones.append("Ejercicios de relajación antes del estudio")

        # Analizar uso de herramientas IA
        if estudiante['uso_herramientas_ia'] == 'bajo':
            recomendaciones.append("Capacitación en herramientas de IA para estudio")
            recomendaciones.append("Introducción a asistentes de aprendizaje automático")

        return recomendaciones

    def dashboard_metricas(self):
        """Genera métricas para dashboard del OVA"""
        metricas = {
            'total_estudiantes': len(self.data),
            'estudiantes_riesgo': len(self.filtrar_estudiantes_riesgo()),
            'efectividad_promedio': self.data['efectividad_ova'].mean(),
            'memoria_trabajo_promedio': self.data['memoria_trabajo_score'].mean(),
            'tiempo_atencion_promedio': self.data['tiempo_atencion_mins'].mean(),
            'correlacion_memoria_rendimiento': self.data['memoria_trabajo_score'].corr(
                (self.data['rendimiento_matematicas'] + self.data['rendimiento_programacion']) / 2
            )
        }
        return metricas

# Ejemplo de uso
if __name__ == "__main__":
    # Inicializar análisis
    analisis = AnalysisDatosMemoriaOVA("dataset_memoria_estudiantes_ciencia_datos.csv")
    analisis.preprocesar_datos()

    # Ejecutar análisis
    estudiantes_riesgo = analisis.filtrar_estudiantes_riesgo()
    print(f"Estudiantes en riesgo: {len(estudiantes_riesgo)}")

    # Clustering de perfiles
    analisis.clustering_perfiles_memoria()

    # Modelo predictivo
    modelo, importancia = analisis.predecir_efectividad_ova()
    print("\nImportancia de características:")
    print(importancia)

    # Recomendaciones para estudiante específico
    recomendaciones = analisis.generar_recomendaciones(1)
    print(f"\nRecomendaciones para estudiante 1:")
    for rec in recomendaciones:
        print(f"- {rec}")

    # Métricas del dashboard
    metricas = analisis.dashboard_metricas()
    print("\nMétricas del OVA:")
    for clave, valor in metricas.items():
        print(f"{clave}: {valor:.2f}" if isinstance(valor, float) else f"{clave}: {valor}")
