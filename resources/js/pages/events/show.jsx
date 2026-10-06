import { Head, Link } from '@inertiajs/react';
import { formatTanggal } from '@/lib/format';

export default function Show({ event, isBookmarked, registrationStatus, user }) {
    return (
        <>
            <Head title={event.title} />
            <div className="p-6">
                <Link href="/events">← Kembali</Link>
                <h1 className="mt-2 text-3xl font-bold">{event.title}</h1>
                <p>Oleh {event.organization?.name ?? '-'}</p>
                <p>
                    {formatTanggal(event.start_at)} – {formatTanggal(event.end_at)}
                </p>
                <p>{event.location}</p>
                <p>Kuota: {event.quota ?? 'Tidak dibatasi'}</p>
                <div className="my-2">
                    {event.categories.map((c) => (
                        <span
                            key={c.id}
                            className="mr-1 rounded bg-neutral-100 px-2 text-xs"
                        >
                            {c.name}
                        </span>
                    ))}
                </div>
                <p className="mt-4 whitespace-pre-line">{event.description}</p>

                {user && (
                    <>
                        <p className="mt-4">Bookmark: {isBookmarked ? 'Ya' : 'Belum'}</p>
                        <p>Status pendaftaran: {registrationStatus ?? 'Belum mendaftar'}</p>
                        {user.id === event.organization?.user_id && (
                            <a href={`/organizer/events/${event.id}/edit`} className="underline">
                                Ubah event
                            </a>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

Show.layout = { breadcrumbs: [{ title: 'Event', href: '/events' }] };