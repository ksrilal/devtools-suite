interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  className?: string
}

export function FAQSection({ faqs, className }: FAQSectionProps) {
  return (
    <section className={className ?? 'mt-8 border-t pt-8'} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold mb-6">
        Frequently Asked Questions
      </h2>
      <dl className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-medium text-foreground">{faq.question}</dt>
            <dd className="mt-1 text-muted-foreground text-sm leading-relaxed">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
