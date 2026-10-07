import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Laminas } from './laminas';

describe('Laminas', () => {
  let component: Laminas;
  let fixture: ComponentFixture<Laminas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Laminas],
    }).compileComponents();

    fixture = TestBed.createComponent(Laminas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
