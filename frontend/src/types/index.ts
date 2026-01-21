export interface TeamMember {
    id: number;
    name: string;
}

export interface Chore {
    id: number;
    title: string;
    description: string;
    dueDate: string; // ISO string from backend
    isRecurring: boolean;
    recurrenceFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
    assignedTo?: TeamMember | null;
}
