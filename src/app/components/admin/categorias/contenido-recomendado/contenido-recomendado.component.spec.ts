import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoRecomendadoComponent } from './contenido-recomendado.component';

describe('ContenidoRecomendadoComponent', () => {
  let component: ContenidoRecomendadoComponent;
  let fixture: ComponentFixture<ContenidoRecomendadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenidoRecomendadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoRecomendadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
