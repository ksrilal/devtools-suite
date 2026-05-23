import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtools-suite.vercel.app'),
  title: {
    template: '%s | DevTools Suite',
    default: 'DevTools Suite – Free Developer Tools Online',
  },
  description:
    'Free online developer tools: JSON formatter, cron generator, diff checker, JWT decoder, regex tester, and smart checklist. Fast, private, zero login.',
  openGraph: {
    type: 'website',
    siteName: 'DevTools Suite',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@devtools_suite',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('devtools_theme');if(t==='light'){document.documentElement.classList.remove('dark')}else if(t==='dark'||!t){if(!t&&window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
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
      </body>
    </html>
  )
}
