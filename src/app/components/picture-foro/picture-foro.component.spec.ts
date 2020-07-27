import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureForoComponent } from './picture-foro.component';

describe('PictureForoComponent', () => {
  let component: PictureForoComponent;
  let fixture: ComponentFixture<PictureForoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureForoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
