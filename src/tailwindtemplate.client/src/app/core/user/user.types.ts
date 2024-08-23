export interface User {
  id: number;
  userName: string;
  name: string;
  fullName: string;
  email: string;
  personalNumber: string;
  department: string;
  bureau: string;
  position: string;
  workplaceName: string;
  structureEnterpriseId: number;
  roles: string[];
  rolesToView: string[];
  avatar: string;
}