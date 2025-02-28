import { Component } from '@angular/core';
import { AttractionService } from '../Service/attraction.service';
import { CritiqueService } from '../Service/critique.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';  // Importer MatFormFieldModule
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule,
    MatFormFieldModule,  // Ajouter MatFormFieldModule
    MatInputModule, ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
  public attractions: Observable<AttractionInterface[]>;  // Liste des attractions
  public critiques: any[] = [];  // Liste des critiques
  public critiqueForm = { nom: '', prenom: '', note: '', text: '', attraction_id: null };

  constructor(
    private attractionService: AttractionService,
    private critiqueService: CritiqueService
  ) {
    // Récupère toutes les attractions visibles
    this.attractions = this.attractionService.getAllAttraction().pipe(
      map(attractions => attractions.filter(attraction => attraction.visible))
    );
  }

  // Fonction appelée lors de la soumission du formulaire de critique
  soumettreCritique(): void {
    if (!this.critiqueForm.attraction_id) {
      console.error("Erreur: Aucune attraction sélectionnée !");
      return;
    }

    this.critiqueService.critique(this.critiqueForm).subscribe(response => {
      console.log('Critique envoyée avec succès:', response);
      this.critiqueForm = { nom: '', prenom: '', note: '', text: '', attraction_id: null };
      this.loadCritiques();  // Recharge les critiques après soumission
    }, error => {
      console.error("Erreur lors de l'envoi de la critique:", error);
    });
  }

  // Fonction pour charger les critiques d'une attraction spécifique
  loadCritiques(): void {
    if (this.critiqueForm.attraction_id) {
      this.critiqueService.getCritiquesByAttraction(this.critiqueForm.attraction_id).subscribe(data => {
        console.log("Données des critiques:", data);  // Vérifiez les données retournées par l'API
        this.critiques = data;
      }, error => {
        console.error("Erreur lors du chargement des critiques:", error);
      });
    }
  }

}
