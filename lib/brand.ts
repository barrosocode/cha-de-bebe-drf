export const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida/AEtjO1X-AL0m1rBYMuvueUMeK6m7l2qMV5F1CXve78I6-6x9zeKgFDErnvTCATZPv-YrZcGmoB79NJ8y9DxR0CRFNvFfwl_rDC0HNHdI1G_n9fz_SrTDitsoowrA-cKnS1JadyaBYNPBcnHwQJwbhCyM0MNgX1O-YP-Nj4U-6oIJ2DaHGVB3-63E8HuYUFtfPqOodwXaIanJ93lWVm4RNywv0x6uVklSRY6hIUofYQUvG9SveFc8qGkc7VerDIw";

export const PUBLIC_LOGO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXUS9uW76sgRgs5MiEGGu6efe2-x2AzvNtzSub-SP3tenB0sDcQuRCYFG5uFfjybpMTb9BVyd8uDT1cTh-3cnXCRZdCVZ_BEs_XOWuxknUnNfGsEyOwDDX29C1BrV4FMIOOXqsq-l97ZjMzyTHoddSKLNWXnjaH7s9WBnmIgbdm3lb3S_x-3Z_0r9TsTiqIvTqYr0LRj0w9uYyWYupe7oopkVEJ3QasNE7inhi4VabeyC3T2YmQhV";

export const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBQTqXg2a4ETBAUAW8Y3CmqbWqrGqZ5c_qOEt-mif53e8gPucxuPTJW5_NqAiOPI4Y5A_E1Z_tYMZhW-OrZm37Bm3-s18o6F5vbIpF5McrqiTiAld8n7IeLEntL6i0e-juwgzEhlSr0MY4HO2rJwWaeTGcRyK0DuZ8-pBpiqbfbo0TkskXjiV_6YKfiD67JxeqNy5rHNtZlFfm3uJoKbiC7muHN5Ei1ivnO4g2X2Gz7BCANOJqM9f8m";

export const EVENT = {
  date: new Date("2026-11-28T16:00:00-03:00"),
  dateLabel: "Sábado, 28/11/2026",
  shortDate: "28/11/2026",
  time: "16h",
  venue: "Rua Francisco Canindé Figueiredo, 45",
  address: "Rio da Ponte, Goianinha (casa dos pais de Bia)",
  mapsUrl: "https://maps.app.goo.gl/G5bVa39h6645JESx7",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3965.9722647265926!2d-35.205363999999996!3d-6.267378000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTYnMDIuNiJTIDM1wrAxMicxOS4zIlc!5e0!3m2!1spt-BR!2sbr!4v1793851803012!5m2!1spt-BR!2sbr",
};

export const DUE_DATE = new Date("2027-02-24T00:00:00-03:00");

export const AGE_OPTIONS = [
  { value: "adult", label: "Adulto" },
  { value: "kid", label: "Criança" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "family", label: "Família" },
  { value: "friend", label: "Amigo" },
  { value: "church", label: "Igreja" },
] as const;

export function labelOf(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}
