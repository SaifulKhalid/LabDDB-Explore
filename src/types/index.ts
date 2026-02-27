export type DistrictStatus = 'notVisited' | 'visited' | 'lived' | 'wishlist';

export interface DistrictData {
  status: DistrictStatus;
  photoUrl: string | null;
  visitedYear: number | null;
}

export interface UserDistricts {
  [districtCode: string]: DistrictData;
}

export interface UserDoc {
  uid: string;
  name: string;
  email: string;
  createdAt: any; // Firestore Timestamp
  districts: UserDistricts;
  username?: string;
}

export interface DistrictInfo {
  id: string; // District Code (e.g., DHK)
  name: string;
  division: string;
}
