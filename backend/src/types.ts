export type WishStatus = 'free' | 'reserved' | 'fulfilled';

export interface Wish {
  id: number;
  title: string;
  status: WishStatus;
  reservedAt?: string | null;
  reservedBy?: string | null;
  reservedEmail?: string | null;
  fulfilledAt?: string | null;
}
