import { Component } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatMessage } from './interface/chat';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

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
    const response = 'This is a mock response from the LLM.';
    return of(response).pipe(delay(1000));
  }
}
