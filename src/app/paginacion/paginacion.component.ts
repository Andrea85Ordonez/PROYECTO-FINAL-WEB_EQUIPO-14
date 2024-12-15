import { Component, Injectable, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import '@angular/localize/init';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = $localize`Primera página`;
  itemsPerPageLabel = $localize`Elementos por página:`;
  lastPageLabel = $localize`Última página`;
  nextPageLabel = $localize`Página siguiente`;
  previousPageLabel = $localize`Página anterior`;
  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Página ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: 'paginacion',
  templateUrl: 'paginacion.component.html',
  standalone: true,
  imports: [MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class PaginacionComponent {
  @Input() length: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [10, 50, 100];
  @Output() page = new EventEmitter<any>();
  onPageChange(event: any): void {
    this.page.emit(event);
  }
}
