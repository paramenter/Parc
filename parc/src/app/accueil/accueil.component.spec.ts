import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilComponent } from './accueil.component';
import { CritiqueService } from '../Service/critique.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;
  let critiqueServiceSpy: jasmine.SpyObj<CritiqueService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CritiqueService', ['critique']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AccueilComponent],
      providers: [{ provide: CritiqueService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    critiqueServiceSpy = TestBed.inject(CritiqueService) as jasmine.SpyObj<CritiqueService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call critique service on soumettreCritique', () => {
    const mockAttraction = { attraction_id: 1, nom: 'Test Attraction', description: 'Desc', difficulte: 3 };
    // @ts-ignore
    critiqueServiceSpy.critique.and.returnValue(of({ message: 'Success' }));

    component.soumettreCritique(mockAttraction);

    expect(critiqueServiceSpy.critique).toHaveBeenCalledWith(jasmine.objectContaining({ attraction_id: 1 }));
  });
});
