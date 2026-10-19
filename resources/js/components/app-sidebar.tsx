import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    Calendar,
    FolderGit2,
    Home,
    LayoutGrid,
    MapPin,
    QrCode,
    ShieldCheck,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/',
        icon: Home,
    },
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const organizerNavItems: NavItem[] = [
    {
        title: 'Event Organizer',
        href: '/organizer/events',
        icon: Calendar,
    },
    {
        title: 'Presensi Peserta',
        href: '/organizer/presence',
        icon: QrCode,
    },
    {
        title: 'Profil Organisasi',
        href: '/organizer/profile',
        icon: MapPin,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Moderasi Event',
        href: '/admin/events',
        icon: ShieldCheck,
    },
    {
        title: 'Kelola Organisasi',
        href: '/admin/organizations',
        icon: Building2,
    },
    {
        title: 'Kategori Event',
        href: '/admin/categories',
        icon: Tags,
    },
    {
        title: 'Kelola Pengguna',
        href: '/admin/users',
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'GitHub',
        href: 'https://github.com/your-org/eventory',
        icon: FolderGit2,
    },
    {
        title: 'Dokumentasi',
        href: 'https://docs.eventory.app',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isOrganizer = auth.user?.role === 'organizer';
    const isAdmin = auth.user?.role === 'administrator';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {(isOrganizer || isAdmin) && (
                    <NavMain items={organizerNavItems} />
                )}
                {isAdmin && <NavMain items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
