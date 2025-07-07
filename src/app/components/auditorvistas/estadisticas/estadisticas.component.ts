import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);
@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  private chartData: any;
  private chartLabels: any;
  private chartBackgroundColor: any;
  public IngresosMes:number= 0;
  public VentasBoletosMes:number= 0;
  public FuncionesDisponibles:number= 0;
  public datosMes:any;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.estadisticasService.getVentasPorPelicula().subscribe((data: any) => {
      this.chartData = data.data;
      this.chartLabels = data.labels;
      this.chartBackgroundColor = data.backgroundColor;
      this.RenderChart(this.chartData, this.chartLabels, this.chartBackgroundColor, 'barchart', 'bar', 'Boletos Vendidos Por Función');
    });

    this.estadisticasService.getIngresosSemanales().subscribe((data: any) => {
      this.chartData = data.data;
      this.chartLabels = data.labels;
      this.chartBackgroundColor = data.backgroundColor;
      this.RenderChart(this.chartData, this.chartLabels, this.chartBackgroundColor, 'barchart2', 'bar', 'Ingresos Últimos 7 Días');
    });

    this.estadisticasService.getIngresosAnuales().subscribe((data: any) => {
      this.chartData = data.data;
      this.chartLabels = data.labels;
      this.chartBackgroundColor = data.backgroundColor;
      this.RenderChartLine(this.chartData, this.chartLabels, this.chartBackgroundColor, 'linechart', 'line', 'Ingresos Anuales');
    });

    this.estadisticasService.getAsistenciaFunciones().subscribe((data: any) => {
      this.chartData = data.data;
      this.chartLabels = data.labels;
      this.chartBackgroundColor = data.backgroundColor;
      this.RenderChart(this.chartData, this.chartLabels, this.chartBackgroundColor, 'piechart', 'pie', 'Asistencia a Funciones');
    });

    this.estadisticasService.getventasultimoMes().subscribe(
      (data:any)=>{
        this.datosMes=data;
        this.VentasBoletosMes=this.datosMes.totalBoletos;
        this.IngresosMes=this.datosMes.totalVentas;
      }
    )
    this.estadisticasService.getFuncionesDisponiblesCount().subscribe(
      (data:any)=>{
        this.FuncionesDisponibles=data.count;
      }
    )
    this.estadisticasService.getVentaBoletosSemanales().subscribe((data: any) => {
      this.chartData = data.data;
      this.chartLabels = data.labels;
      this.chartBackgroundColor = data.backgroundColor;
      this.RenderChart(this.chartData, this.chartLabels, this.chartBackgroundColor, 'piechart', 'pie', 'Venta de Boletos Diarios');
    });

  }

  RenderChart(chartData: any, chartLabels: any, chartBackgroundColor: any, id:any, type:any, title:any) {
    const Mychart = new Chart(id, {
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
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    });

  }

  RenderChartLine(chartData: any, chartLabels: any, chartBackgroundColor: any, id:any, type:any, title:any) {
    const Mychart = new Chart(id, {
      type: type,
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Ingresos Anuales',
          data: chartData,
          fill: false,
          borderColor: chartBackgroundColor,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    });

  }
}