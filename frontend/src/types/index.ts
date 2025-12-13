// User Interface
export interface User {
  id: number;
  username: string;
  email: string;     
  bio: string;
  location: string;   
  karma_credits: number;
}

// Skill Interface
export interface Skill {
  id: number;
  user_info: User;
  title: string;
  description: string;
  category: 'TEACH' | 'LEARN';
  created_at: string;
}