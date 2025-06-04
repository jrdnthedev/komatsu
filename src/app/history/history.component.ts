import { HttpClient } from '@angular/common/http';
import { Component, Input, Signal, effect, signal } from '@angular/core';
import { environment } from '../../../environment';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { HistoryMessage } from '../interface/history';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-history',
  imports: [ChatBubbleComponent, LoadingSpinnerComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  history: HistoryMessage[] = [];
  @Input({ required: true }) isOpen!: Signal<boolean>;
  isLoading = signal<boolean>(false);
  constructor(private httpClient: HttpClient) {
    effect(() => {
      if (this.isOpen() === true) {
        this.getHistory();
      }
    });
  }

  getHistory() {
    this.isLoading.set(true);
    this.httpClient.get(`${environment.apiUrl}/messages`).subscribe({
      next: (response) => {
        this.history = response as HistoryMessage[];
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error fetching history:', err);
      },
      complete: () => {
        console.log('History fetched successfully');
        this.isLoading.set(false);
      },
    });
  }
}
