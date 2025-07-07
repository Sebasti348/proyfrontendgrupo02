import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../../services/reportes.service';
import { Chart, registerables } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  selectedReport: string = 'ventas';
  reports = [
    { id: 'ventas', name: 'Ventas y Rendimiento' },
    { id: 'peliculas', name: 'Reporte de Películas' },
    { id: 'funciones', name: 'Reporte de Funciones' },
    { id: 'reservas', name: 'Reporte de Reservas' }
  ];

  // Método para manejar el cambio de reporte
  onReportChange(reportId: string): void {
    this.selectedReport = reportId;
    this.loadReport(reportId);
    
  }
  typeChart:string='';
  // Data for charts
  ventasData: any;
  ventasLabels: any;
  ventasBackgroundColor: any;

  peliculasData: any;
  peliculasLabels: any;
  peliculasBackgroundColor: any;

  funcionesData: any;
  funcionesLabels: any;
  funcionesBackgroundColor: any;

  reservasData: any;
  reservasLabels: any;
  reservasBackgroundColor: any;

  // Resumen de datos
  totalVentas: number = 0;
  promedioDiario: number = 0;
  ocupacion: number = 0;
  topPeliculas: any[] = [];

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.loadReport('ventas');
  }

  // Método para cargar el reporte seleccionado
  loadReport(reportType: string): void {
    switch (reportType) {
      case 'ventas':
        this.loadVentasReport();
        break;
      case 'peliculas':
        this.loadPeliculasReport();
        break;
      case 'funciones':
        this.loadFuncionesReport();
        break;
      case 'reservas':
        this.loadReservasReport();
        break;
    }
  }

  loadVentasReport(): void {
    this.reportesService.getVentasReport().subscribe((data: any) => {
      this.ventasData = data.data;
      this.ventasLabels = data.labels;
      this.ventasBackgroundColor = data.backgroundColor;
      this.RenderChart(this.ventasData, this.ventasLabels, this.ventasBackgroundColor, 'ventasChart', 'bar', 'Ventas por Día');
      
      // Actualizar resumen
      this.totalVentas = data.totalVentas;
      this.promedioDiario = data.promedioDiario;
      this.ocupacion = data.ocupacion;
    });
  }

  loadPeliculasReport(): void {
    this.reportesService.getPeliculasReport().subscribe((data: any) => {
      this.peliculasData = data.data;
      this.peliculasLabels = data.labels;
      this.peliculasBackgroundColor = data.backgroundColor;
      this.RenderChart(this.peliculasData, this.peliculasLabels, this.peliculasBackgroundColor, 'peliculasChart', 'pie', 'Distribución de Taquilla');
      
      // Actualizar top películas
      this.topPeliculas = data.topPeliculas;
    });
  }

  loadFuncionesReport(): void {
    this.reportesService.getFuncionesReport().subscribe((data: any) => {
      this.funcionesData = data.data;
      this.funcionesLabels = data.labels;
      this.funcionesBackgroundColor = data.backgroundColor;
      this.RenderChart(this.funcionesData, this.funcionesLabels, this.funcionesBackgroundColor, 'funcionesChart', 'line', 'Ocupación por Función');
    });
  }

  loadReservasReport(): void {
    this.reportesService.getReservasReport().subscribe((data: any) => {
      this.reservasData = data.data;
      this.reservasLabels = data.labels;
      this.reservasBackgroundColor = data.backgroundColor;
      this.RenderChart(this.reservasData, this.reservasLabels, this.reservasBackgroundColor, 'reservasChart', 'bar', 'Reservas por Dia');
    });
  }

  filtrar() {
    if (this.fechaInicio && this.fechaFin) {
      this.reportesService.filtrarReporte(this.fechaInicio, this.fechaFin, this.selectedReport)
        .subscribe((data: any) => {
          // Actualizar el chart correspondiente según el tipo de reporte
          switch (this.selectedReport) {
            case 'ventas':
              this.ventasData = data.data;
              this.ventasLabels = data.labels;
              this.ventasBackgroundColor = data.backgroundColor;
              this.RenderChart(this.ventasData, this.ventasLabels, this.ventasBackgroundColor, 'ventasChart', 'bar', 'Ventas por Día');
              
              // Actualizar resumen
              this.totalVentas = data.totalVentas;
              this.promedioDiario = data.promedioDiario;
              this.ocupacion = data.ocupacion;
              break;
            
            case 'peliculas':
              this.peliculasData = data.data;
              this.peliculasLabels = data.labels;
              this.peliculasBackgroundColor = data.backgroundColor;
              this.RenderChart(this.peliculasData, this.peliculasLabels, this.peliculasBackgroundColor, 'peliculasChart', 'pie', 'Distribución de Taquilla');
              
              // Actualizar top películas
              this.topPeliculas = data.topPeliculas;
              break;
            
            case 'funciones':
              this.funcionesData = data.data;
              this.funcionesLabels = data.labels;
              this.funcionesBackgroundColor = data.backgroundColor;
              this.RenderChart(this.funcionesData, this.funcionesLabels, this.funcionesBackgroundColor, 'funcionesChart', 'line', 'Ocupación por Función');
              break;
            
            case 'reservas':
              this.reservasData = data.data;
              this.reservasLabels = data.labels;
              this.reservasBackgroundColor = data.backgroundColor;
              this.RenderChart(this.reservasData, this.reservasLabels, this.reservasBackgroundColor, 'reservasChart', 'bar', 'Reservas por Hora');
              break;
          }
        });
    }
  }

  // Mantener referencia a los charts existentes
  private charts: { [key: string]: Chart } = {};

  RenderChart(chartData: any, chartLabels: any, chartBackgroundColor: any, id: string, type: any, title: string) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (ctx) {
      // Destruir el chart existente si existe
      if (this.charts[id]) {
        this.charts[id].destroy();
      }

      // Crear nuevo chart
      const chart = new Chart(ctx, {
        type: type,
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: title,
              data: chartData,
              backgroundColor: chartBackgroundColor,
              borderColor: chartBackgroundColor,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Guardar referencia al nuevo chart
      this.charts[id] = chart;
    }
  }
}
