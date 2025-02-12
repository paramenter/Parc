import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageInterface } from '../Interface/message.interface';

@Injectable({
  providedIn: 'root',
})
export class CritiqueService {
  constructor(private http: HttpClient) {}

  critique(form: object): Observable<MessageInterface> {
    return this.http.post<MessageInterface>('http://paramenter.fr:5000/critique', form);
  }
}

