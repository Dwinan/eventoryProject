export function formatTanggal(iso) {
    const d = new Date(iso);
    const tgl = d.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    const jam = d
        .toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .replace('.', ':');
    return `${tgl}, ${jam}`;
}