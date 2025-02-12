import { Component } from '@angular/core';
import { AttractionService } from '../Service/attraction.service';
import { CritiqueService } from '../Service/critique.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {
  public attractions: Observable<AttractionInterface[]> = this.attractionService.getAllAttraction().pipe(
    map(attractions => attractions.filter(attraction => attraction.visible))
  );

  public critiqueForm: FormGroup;

  constructor(
    public attractionService: AttractionService,
    private critiqueService: CritiqueService,
    private fb: FormBuilder
  ) {
    this.critiqueForm = this.fb.group({
      nom: [''],
      prenom: [''],
      note: [''],
      texte: ['']
    });
  }

  envoyerCritique(): void {
    if (this.critiqueForm.valid) {
      this.critiqueService.critique(this.critiqueForm.value);
      this.critiqueForm.reset();
    } else {
      console.error("Le formulaire n'est pas valide !");
    }
  }
}
