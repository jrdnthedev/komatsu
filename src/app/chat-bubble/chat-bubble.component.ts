import { Component, Input } from '@angular/core';
import { ChatMessage } from '../interface/chat';

@Component({
  selector: 'app-chat-bubble',
  imports: [],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss',
})
export class ChatBubbleComponent {
  @Input() response!: ChatMessage;
}
