import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="app-header">
      <div class="brand">🌟 Sternenanhänger Weihnachtswunschbaum</div>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Wünsche</a>
        <a routerLink="/admin" routerLinkActive="active">Admin</a>
      </nav>
    </header>

    <main class="app-shell">
      <router-outlet></router-outlet>
    </main>

    <footer class="app-footer">
      <p>Digitale Wunschliste für die interne Weihnachtsaktion</p>
    </footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
