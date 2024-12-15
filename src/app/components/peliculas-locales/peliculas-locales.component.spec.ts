import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeliculasLocalesComponent } from './peliculas-locales.component';

describe('PeliculasLocalesComponent', () => {
  let component: PeliculasLocalesComponent;
  let fixture: ComponentFixture<PeliculasLocalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculasLocalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeliculasLocalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
