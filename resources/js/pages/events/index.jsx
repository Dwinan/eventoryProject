import { Head, Link } from '@inertiajs/react';
import { formatTanggal } from '@/lib/format';

export default function Index({ events, categories, filters }) {
    const aktif = 'bg-neutral-900 text-white';

    return (
        <>
            <Head title="Daftar Event" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Daftar Event</h1>

                <div className="my-4 flex flex-wrap gap-2">
                    <Link
                        href="/events"
                        className={`rounded border px-3 py-1 ${!filters.category ? aktif : ''}`}
                    >
                        Semua
                    </Link>
                    {categories.map((c) => (
                        <Link
                            key={c.id}
                            href={`/events?category=${c.slug}`}
                            className={`rounded border px-3 py-1 ${filters.category === c.slug ? aktif : ''}`}
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {events.data.length === 0 && <p>Belum ada event.</p>}
                    {events.data.map((event) => (
                        <div key={event.id} className="rounded-lg border p-4">
                            <h2 className="font-semibold">
                                <Link href={`/events/${event.slug}`}>
                                    {event.title}
                                </Link>
                            </h2>
                            <p className="text-sm">{formatTanggal(event.start_at)}</p>
                            <p className="text-sm">{event.location}</p>
                            <div className="mt-2">
                                {event.categories.map((c) => (
                                    <span
                                        key={c.id}
                                        className="mr-1 rounded bg-neutral-100 px-2 text-xs"
                                    >
                                        {c.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {events.links.map((l, i) =>
                        l.url ? (
                            <Link
                                key={i}
                                href={l.url}
                                className={`rounded border px-3 py-1 ${l.active ? aktif : ''}`}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="px-3 py-1 text-neutral-400"
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ),
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Event', href: '/events' }] };