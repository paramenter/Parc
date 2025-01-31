import { Injectable, inject } from '@angular/core';
import { UserInterface } from '../Interface/user.interface';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageInterface } from '../Interface/message.interface';

@Injectable({
  providedIn: 'root',
})
export class CritiqueService {

  http = inject(HttpClient);

  isLoggedIn = false;
  user: UserInterface|null = null;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  critique(form: object): void {
    this.http.post<MessageInterface>(
      'http://paramenter.fr:5000/critique',
      {
        ...form,
      }
    );
  }

}
