import { Component } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatMessage } from './interface/chat';
import { BehaviorSubject, delay, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    ChatBubbleComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'komatsu';
  input = new FormControl('');
  private messageSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messageSubject.asObservable();
  constructor(private httpClient: HttpClient) {}

  send() {
    const message = this.input.value?.trim();
    const date = new Date();
    if (!message) return;
    this.input.setValue('');
    this.messageSubject.next([
      ...this.messageSubject.getValue(),
      {
        content: message,
        role: 'user',
        createdAt: date,
      },
    ]);
    this.mockLLMResponse(message).subscribe((response) => {
      const date = new Date();
      this.messageSubject.next([
        ...this.messageSubject.getValue(),
        {
          content: response,
          role: 'llm',
          createdAt: date,
        },
      ]);
    });
  }

  mockLLMResponse(prompt: string): Observable<string> {
    return this.httpClient
      .post<{ response: string }>(`${environment.apiUrl}/chat`, {
        prompt,
      })
      .pipe(
        delay(1000),
        map((res) => res.response)
      );
  }
}
