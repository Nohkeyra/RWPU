export interface Order {
  id?: string;
  to: string;
  attn?: string;
  name: string;
  contact: string;
  email: string;
  date?: string | Date;
  dateTime: string;
  location: string;
  quantity: number;
  meals: string[];
  menu?: string;
  notes?: string;
  prices?: Record<string, number>;
  totalAmount?: number;
  invoiceNo?: string;
  lang?: 'en' | 'bm';
  status?: string;
  createdAt?: { seconds: number; nanoseconds: number } | string | Date;
  userId?: string;
}

export interface CombinedInvoicePayload {
  orders: Order[];
  includeNotes: boolean;
  lang?: 'en' | 'bm';
}
