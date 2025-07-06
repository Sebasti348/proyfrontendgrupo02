import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  imports: [CommonModule],
  templateUrl: './pago-fallido.component.html',
  styleUrls: ['./pago-fallido.component.css']
})
export class PagoFallidoComponent implements OnInit {
  paymentId: string | null = null;
  paymentStatus: string | null = null;
  externalReference: string | null = null;
  loading: boolean = false;
  message: string = 'Tu pago ha sido rechazado. Por favor, intenta de nuevo.';

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['collection_id'] || params['payment_id'];
      this.paymentStatus = params['collection_status'] || params['status'];
      this.externalReference = params['external_reference'];
      if (this.paymentStatus === 'approved') {
        this.message = 'Tu pago fue aprobado inesperadamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/pago/exitoso'], { queryParams: params }), 1000);
      } else if (this.paymentStatus === 'pending') {
        this.message = 'Tu pago está pendiente. Te notificaremos cuando se complete.';
      } else if (this.paymentStatus === 'rejected' || this.paymentStatus === 'failure') {
        this.message = 'Tu pago ha sido rechazado. Por favor, intenta de nuevo.';
      } else {
        this.message = 'No se pudo determinar el estado del pago.';
      }
      this.loading = false;
    });
  }
}