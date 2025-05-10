import { Component } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatMessage } from './interface/chat';
import { BehaviorSubject, delay, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  imports: [
    ChatBubbleComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'komatsu';
  input = new FormControl('');
  private messageSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messageSubject.asObservable();
  loading = false;
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
        createdAt: date.toLocaleTimeString(),
      },
    ]);
    this.loading = true;
    this.mockLLMResponse(message).subscribe({
      next: (response) => {
        const date = new Date();
        this.messageSubject.next([
          ...this.messageSubject.getValue(),
          {
            content: response,
            role: 'llm',
            createdAt: date.toLocaleTimeString(),
          },
        ]);
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageSubject.next([
          ...this.messageSubject.getValue(),
          {
            content: 'Error occurred while fetching response.',
            role: 'llm',
            createdAt: new Date().toLocaleTimeString(),
          },
        ]);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  mockLLMResponse(prompt: string): Observable<string> {
    return this.httpClient
      .post<{ response: string }>(`${environment.apiUrl}/chat`, {
        prompt,
      })
      .pipe(map((res) => res.response));
  }
}
