import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Google Sheet Translation Manager',
        short_name: 'Translate PWA',
        description: 'Ứng dụng quản lý bản dịch với Google Sheets',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '192x192',
                type: 'image/x-icon',
            },
            {
                src: '/favicon.ico',
                sizes: '512x512',
                type: 'image/x-icon',
            },
        ],
    }
}
