export type Age = "adult" | "kid";
export type Category = "family" | "friend" | "church";

export interface User {
  id: number;
  username: string;
  first_name: string;
}

export interface Tag {
  uuid: string;
  name: string;
  description: string;
}

export interface GiftFile {
  uuid: string;
  image: string | null;
  image_url: string | null;
  alt: string;
}

export interface Gift {
  uuid: string;
  name: string;
  description: string;
  link: string;
  limit: number;
  tags: Tag[];
  files: GiftFile[];
}

export interface GiftWrite {
  name: string;
  description: string;
  link: string;
  limit: number;
  tag_names: string[];
}

export interface Invite {
  uuid: string;
  name: string;
  code: string;
}

export interface GiftBrief {
  uuid: string;
  name: string;
  description: string;
  link: string;
}

export interface GuestGiftSelection {
  gift: GiftBrief;
  message: string;
  selected_at: string;
}

export interface Guest {
  uuid: string;
  name: string;
  age: Age;
  phone: string | null;
  confirmed: boolean;
  category: Category;
  invite: string;
  gifts: GuestGiftSelection[];
}

export interface GuestWrite {
  name: string;
  age: Age;
  category: Category;
  phone: string | null;
  invite: string;
}

export interface PublicGuest {
  uuid: string;
  name: string;
  confirmed: boolean;
}

export interface InviteGuestsResponse {
  invite: { name: string; code: string };
  guests: PublicGuest[];
}

export interface GiftPurchaseResponse {
  message: string;
  guest: { uuid: string; name: string };
  gift_message: string;
  selected_at: string;
}

export interface ConfirmGuestsResponse {
  message: string;
  confirmed_count: number;
  guests: PublicGuest[];
}

export interface DashboardReservation {
  guest_name: string;
  gift_name: string;
  message: string;
  reserved_at: string;
}

export interface DashboardData {
  total_invites: number;
  total_guests: number;
  confirmed_guests: number;
  confirmation_rate: number;
  total_gifts: number;
  reserved_gifts: number;
  reservation_rate: number;
  recent_reservations: DashboardReservation[];
}

export interface ReservationRow {
  id: string;
  guestName: string;
  giftName: string;
  message: string;
  selectedAt: string;
}
