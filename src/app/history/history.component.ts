import { HttpClient } from '@angular/common/http';
import { Component, Input, Signal, effect } from '@angular/core';
import { environment } from '../../../environment';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';

@Component({
  selector: 'app-history',
  imports: [ChatBubbleComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  history: any[] = [];
  @Input({ required: true }) isOpen!: Signal<boolean>;
  constructor(private httpClient: HttpClient) {
    effect(() => {
      if (this.isOpen() === true) {
        this.getHistory();
      }
    });
  }

  getHistory() {
    this.httpClient
      .get(`${environment.apiUrl}/messages`)
      .subscribe((response) => {
        console.log(response);
        this.history = response as any[];
      });
  }
}
