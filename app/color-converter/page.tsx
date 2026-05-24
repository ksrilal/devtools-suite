import type { Metadata } from 'next'
import { toolMetadata, webApplicationLD, faqPageLD } from '@/lib/seo/metadata'
import { ColorConverterTool } from '@/components/tools/color-converter-tool'
import { FAQSection } from '@/components/tools/faq-section'
import { AdSlot } from '@/components/ui/ad-slot'

export const metadata: Metadata = toolMetadata({
  title: 'Color Converter – HEX to RGB to HSL Online Tool',
  description:
    'Convert colors between HEX, RGB, and HSL formats instantly. Includes a color picker and live color preview. Free, browser-based, no login required.',
  path: '/color-converter',
  keywords: [
    'hex to rgb',
    'rgb to hex',
    'color converter',
    'hsl converter',
    'hex color converter',
    'rgb to hsl',
    'color picker',
  ],
})

const faqs = [
  {
    question: 'What color formats are supported?',
    answer:
      'The tool supports HEX (e.g. #FF5733 or #F53), RGB (e.g. rgb(255, 87, 51) or 255, 87, 51), and HSL (e.g. hsl(14, 100%, 60%)) formats. All are interconverted simultaneously.',
  },
  {
    question: 'How do I use the color picker?',
    answer:
      'Click the colored square on the right of the input field to open the browser\'s native color picker. Selecting a color will automatically populate all three format outputs.',
  },
  {
    question: 'What is the difference between HEX, RGB, and HSL?',
    answer:
      'HEX is the hexadecimal representation of RGB values, used widely in web development. RGB specifies red, green, and blue channel intensities from 0–255. HSL (Hue, Saturation, Lightness) is more intuitive for adjusting colors — hue is the base color (0–360°), saturation is how vivid it is, and lightness is how bright.',
  },
  {
    question: 'Can I enter a 3-digit hex code?',
    answer:
      'Yes. Shorthand hex codes like #F53 are expanded to #FF5533 automatically.',
  },
  {
    question: 'Is my data sent anywhere?',
    answer:
      'No. All conversion math runs locally in your browser using pure JavaScript. No data is sent to any server.',
  },
]

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://devtoolssuite.dev'

export default function ColorConverterPage() {
  const toolUrl = `${siteUrl}/color-converter`
  const appLD = webApplicationLD({
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL formats with a live color preview.',
    url: toolUrl,
    keywords: ['hex to rgb', 'rgb to hex', 'color converter'],
  })
  const faqLD = faqPageLD(faqs)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <ColorConverterTool />

      <section className="border-t border-border/50">
        <div className="container py-10 md:py-12">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">Color Format Converter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter a color in HEX, RGB, or HSL format and instantly see all three representations
                  along with a live color swatch. Use the color picker for visual selection. All
                  conversion calculations happen locally in your browser — no data is sent anywhere.
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
