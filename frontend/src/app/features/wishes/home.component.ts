import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishService } from '../../core/wish.service';
import { Wish } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="hero">
      <h1>Wünsche entdecken & übernehmen</h1>
      <p>Suche dir einen freien Wunsch aus und bestätige deine Übernahme online.</p>
    </section>

    <section class="filters">
      <label>
        Status filtern:
        <select [(ngModel)]="statusFilter">
          <option value="all">Alle</option>
          <option value="free">Frei</option>
          <option value="reserved">Reserviert</option>
          <option value="fulfilled">Abgegeben</option>
        </select>
      </label>
    </section>

    <section class="grid" *ngIf="!wishService.loading(); else loading">
      <article class="card" *ngFor="let wish of filteredWishes()">
        <div class="card-header">
          <h3>{{ wish.title }}</h3>
          <span class="badge" [ngClass]="wish.status">{{ label(wish.status) }}</span>
        </div>
        <p class="meta" *ngIf="wish.reservedBy">Übernommen von {{ wish.reservedBy }}</p>
        <div class="actions" *ngIf="wish.status === 'free'">
          <label>Dein Name
            <input type="text" [(ngModel)]="formName[wish.id]" placeholder="Max Mustermann" />
          </label>
          <label>Deine E-Mail (optional)
            <input type="email" [(ngModel)]="formEmail[wish.id]" placeholder="du@example.com" />
          </label>
          <button (click)="reserve(wish)">Wunsch übernehmen</button>
        </div>
        <div class="actions" *ngIf="wish.status === 'reserved'">
          <small>Reserviert am {{ wish.reservedAt | date: 'short' }}</small>
          <button class="secondary" (click)="fulfill(wish)">Als abgegeben markieren</button>
        </div>
        <div class="actions" *ngIf="wish.status === 'fulfilled'">
          <small>Abgegeben am {{ wish.fulfilledAt | date: 'short' }}</small>
        </div>
      </article>
    </section>

    <ng-template #loading>
      <p class="loading">Lade Wünsche...</p>
    </ng-template>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  statusFilter: 'all' | 'free' | 'reserved' | 'fulfilled' = 'all';
  formName: Record<number, string> = {};
  formEmail: Record<number, string> = {};

  filteredWishes = computed(() => {
    const wishes = this.wishService.wishes();
    if (this.statusFilter === 'all') return wishes;
    return wishes.filter((w) => w.status === this.statusFilter);
  });

  constructor(public wishService: WishService) {}

  ngOnInit(): void {
    this.wishService.fetchAll();
  }

  label(status: Wish['status']) {
    switch (status) {
      case 'free':
        return 'Frei';
      case 'reserved':
        return 'Reserviert';
      case 'fulfilled':
        return 'Abgegeben';
    }
  }

  reserve(wish: Wish) {
    const name = this.formName[wish.id];
    if (!name) return alert('Bitte Namen angeben');
    const email = this.formEmail[wish.id];
    this.wishService.reserve(wish.id, name, email).subscribe(() => this.wishService.fetchAll());
  }

  fulfill(wish: Wish) {
    this.wishService.fulfill(wish.id).subscribe(() => this.wishService.fetchAll());
  }
}
