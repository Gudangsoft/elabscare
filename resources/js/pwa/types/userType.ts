export interface UserType {
    id: number;
    name: string;
    email: string;
    whatsapp_number: string;
    birth_date: string;
    birth_place: string;
    gender?: 'male' | 'female';
    role: string;
    avatar?: string;
    address: string;
}
