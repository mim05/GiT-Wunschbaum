import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishService } from '../../core/wish.service';
import { Wish } from '../../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="admin">
      <h2>Admin: Wünsche zurücksetzen</h2>
      <p>Setzt einen Wunsch wieder auf "frei" und entfernt Reservierungsdaten.</p>
      <div class="list">
        <div class="item" *ngFor="let wish of wishService.wishes()">
          <span>{{ wish.title }}</span>
          <button (click)="reset(wish)">Zurücksetzen</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `.admin { background: #fff; padding: 1rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
     .list { display: flex; flex-direction: column; gap: 0.5rem; }
     .item { display: flex; justify-content: space-between; align-items: center; }
     button { background: #1d3557; color: white; border: none; border-radius: 8px; padding: 0.4rem 0.8rem; }
    `
  ]
})
export class AdminComponent implements OnInit {
  constructor(public wishService: WishService) {}

  ngOnInit(): void {
    this.wishService.fetchAll();
  }

  reset(wish: Wish) {
    if (!confirm(`Wunsch "${wish.title}" zurücksetzen?`)) return;
    this.wishService.reset(wish.id).subscribe(() => this.wishService.fetchAll());
  }
}
