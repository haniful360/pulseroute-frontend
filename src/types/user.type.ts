export interface IUser {
  id: string;
  userId: string;
  name: string;
  avatarText: string;
  persona: string;
  plan: string;
  planType: 'enterprise' | 'startup' | 'growth';
  status: 'Active' | 'Suspended' | 'Inactive';
  time: string;
}
