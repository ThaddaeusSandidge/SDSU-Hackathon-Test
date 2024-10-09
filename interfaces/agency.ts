export interface Agency {
  id: string;
  name: string | null;
  website: string | null;
  email: string | null;
  about: string | null;
  instagram: string | null;
  image: string | null;
  location: string | null;
  display_location: string | null;
  geocode: string | null;
  latitude: number | null;
  longitude: number | null;
  formatted_address: string | null;
  display_name: string | null;
  date_added: Date | null;
  views: string | null;
  likes: string | null;
  applicants: string | null;
  website_clicks: string | null;
  instagram_clicks: string | null;
  location_clicks: string | null;
  image_path: string | null;
  categories: string | null;
  image_url: string | null;
}
