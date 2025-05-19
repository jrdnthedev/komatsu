import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environment';

@Component({
  selector: 'app-history',
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getHistory();
  }

  getHistory() {
    this.httpClient
      .get(`${environment.apiUrl}/messages`)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
