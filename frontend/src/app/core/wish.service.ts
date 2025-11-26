import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Wish } from './models';

@Injectable({ providedIn: 'root' })
export class WishService {
  wishes = signal<Wish[]>([]);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  fetchAll() {
    this.loading.set(true);
    this.http.get<Wish[]>('/api/wishes').subscribe({
      next: (w) => this.wishes.set(w),
      error: (err) => console.error(err),
      complete: () => this.loading.set(false)
    });
  }

  reserve(id: number, name: string, email?: string) {
    return this.http.post<Wish>(`/api/wishes/${id}/reserve`, { name, email });
  }

  fulfill(id: number) {
    return this.http.post<Wish>(`/api/wishes/${id}/fulfill`, {});
  }

  reset(id: number) {
    return this.http.post<Wish>(`/api/wishes/${id}/reset`, {});
  }
}
