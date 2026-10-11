export interface User {
    id: number;
    name: string;
    email: string;
    role: 'general' | 'organizer' | 'administrator';
    email_verified_at: string | null;
    npm: string | null;
    phone: string | null;
    organization_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface Organization {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    type: 'ukm' | 'bem' | 'hmj';
    description: string | null;
    logo: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number;
    organization_id: number;
    title: string;
    slug: string;
    description: string;
    start_at: string;
    end_at: string;
    location: string;
    quota: number | null;
    status: 'draft' | 'published';
    moderated_by: number | null;
    moderated_at: string | null;
    created_at: string;
    updated_at: string;
    organization?: Organization;
    categories?: Category[];
}

export interface Registration {
    id: number;
    user_id: number;
    event_id: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    token: string;
    attended_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    event?: Event;
}

export interface Bookmark {
    id: number;
    user_id: number;
    event_id: number;
    created_at: string;
    updated_at: string;
    user?: User;
    event?: Event;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface FlashMessage {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: FlashMessage;
}
