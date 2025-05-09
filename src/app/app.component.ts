import { Component } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatMessage } from './interface/chat';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [ChatBubbleComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'komatsu';
  input = new FormControl('');
  messages: ChatMessage[] = [];

  send() {
    const message = this.input.value?.trim();
    if (!message) return;
    this.input.setValue('');
    this.messages.push({
      content: message,
      role: 'user',
      createdAt: new Date(),
    });

    this.mockLLMResponse(message).subscribe((response) => {
      this.messages.push({
        content: response,
        role: 'llm',
        createdAt: new Date(),
      });
    });
  }

  mockLLMResponse(prompt: string): Observable<string> {
    const response = 'This is a mock response from the LLM.';
    return of(response).pipe(delay(1000));
  }
}
