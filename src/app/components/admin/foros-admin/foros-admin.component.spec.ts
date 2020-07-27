import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForosAdminComponent } from './foros-admin.component';

describe('ForosAdminComponent', () => {
  let component: ForosAdminComponent;
  let fixture: ComponentFixture<ForosAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForosAdminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
