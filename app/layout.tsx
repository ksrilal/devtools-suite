import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'),
  title: {
    template: '%s | DevTools Suite',
    default: 'DevTools Suite – Free Online Developer Tools',
  },
  description:
    'Free privacy-first developer tools that run entirely in your browser. JSON formatter, JWT decoder, regex tester, cron generator, diff checker, and smart checklist. No login, no uploads.',
  keywords: 'developer tools, json formatter, jwt decoder, regex tester, cron generator, diff checker, checklist maker, free online tools',
  authors: [{ name: 'DevTools Suite', url: 'https://devtoolssuite.dev' }],
  creator: 'DevTools Suite',
  publisher: 'DevTools Suite',
  openGraph: {
    type: 'website',
    siteName: 'DevTools Suite',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1280, height: 640, alt: 'DevTools Suite' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@devtools_suite',
    creator: '@devtools_suite',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('devtools_theme');if(t==='light'){document.documentElement.classList.remove('dark')}else if(t==='dark'||!t){if(!t&&window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}}catch(e){document.documentElement.classList.add('dark')}})();(function(){if(new URLSearchParams(location.search).get('embed')==='1')document.documentElement.setAttribute('data-embed','1')})()`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6494285872180880"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>

        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaMeasurementId}',{page_path:window.location.pathname})`}
            </Script>
          </>
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
