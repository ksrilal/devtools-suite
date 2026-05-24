import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { QRCodeGeneratorTool } from '@/components/tools/qr-code-generator-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'QR Code Generator – Free Online QR Code Creator',
  description:
    'Generate QR codes from any text or URL instantly. Download as PNG. Adjustable size and colors. Fully client-side — no data sent to any server. Free, no login.',
  path: '/qr-code-generator',
  keywords: [
    'qr code generator',
    'qr code creator',
    'generate qr code online',
    'free qr code generator',
    'qr code from url',
    'qr code download png',
  ],
})

const faqs = [
  {
    question: 'What content can I encode in a QR code?',
    answer: 'Any plain text up to a few thousand characters. Common uses include URLs, email addresses, phone numbers, Wi-Fi credentials (formatted as WIFI:T:WPA;S:<SSID>;P:<password>;;), and plain text notes.',
  },
  {
    question: 'What size should I use?',
    answer: 'For digital display use 256×256 or larger. For printing, use 512×512 to ensure sufficient resolution. The QR code itself encodes the same data regardless of canvas size.',
  },
  {
    question: 'Is my data sent anywhere?',
    answer: 'No. The QR code is generated using the qrcode.js library which runs entirely in your browser on a Canvas element. Nothing is transmitted to any server.',
  },
  {
    question: 'What format is the downloaded file?',
    answer: 'PNG. The file is exported directly from the browser Canvas element at the selected pixel size.',
  },
  {
    question: 'Can I change the QR code colors?',
    answer: 'Yes. Use the dark and light color pickers to choose any colors. High contrast between dark and light is important for reliable scanning.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function QRCodeGeneratorPage() {
  const toolUrl = `${siteUrl}/qr-code-generator`
  const appLD = webApplicationLD({
    name: 'QR Code Generator',
    description: 'Generate QR codes from any text or URL. Download as PNG. Fully client-side.',
    url: toolUrl,
    keywords: ['qr code generator', 'qr code creator', 'generate qr code online'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <QRCodeGeneratorTool />
      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">QR Code Generator</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter any text or URL to generate a high-quality QR code rendered on a browser Canvas element. Choose between 128×128, 256×256, and 512×512 sizes. Customise dark and light colors with the color pickers. Download the result as a PNG with one click. The qrcode.js library runs entirely in your browser — nothing is transmitted anywhere.
                </p>
              </div>
              <AdSlot variant="banner" className="mb-8" />
              <FAQSection faqs={faqs} className="border-t pt-8" />
              <AdSlot variant="banner" className="mt-8" />
            </div>
            <aside className="hidden xl:block w-[300px] 2xl:w-[600px] shrink-0">
              <div className="sticky top-20 flex flex-col gap-6">
                <AdSlot variant="sidebar-wide" />
                <AdSlot variant="sidebar" />
                <AdSlot variant="sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
