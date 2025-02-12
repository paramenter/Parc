import { Component } from '@angular/core';
import { AttractionService } from '../Service/attraction.service';
import { CritiqueService } from '../Service/critique.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {
  public attractions: Observable<AttractionInterface[]>;
  public critiqueForm = { nom: '', prenom: '', note: '', text: '', attraction_id: null };

  constructor(
    private attractionService: AttractionService,
    private critiqueService: CritiqueService
  ) {
    this.attractions = this.attractionService.getAllAttraction().pipe(
      map(attractions => attractions.filter(attraction => attraction.visible))
    );
  }

  soumettreCritique(attraction: { attraction_id: number; description: string; difficulte: number; nom: string }): void {
    console.log("Attraction reçue :", attraction); // Ajouter un log pour vérifier la structure de l'objet

    if (!attraction.attraction_id) {
      console.error("Erreur: attraction_id est indéfini !");
      return;
    }

    // @ts-ignore
    this.critiqueForm.attraction_id = attraction.attraction_id; // Assurez-vous que l'attraction_id est bien attaché au formulaire

    this.critiqueService.critique(this.critiqueForm).subscribe(response => {
      console.log('Critique envoyée avec succès:', response);
      this.critiqueForm = { nom: '', prenom: '', note: '', text: '', attraction_id: null }; // Réinitialisation du formulaire
    }, error => {
      console.error("Erreur lors de l'envoi de la critique:", error);
    });
  }



}
