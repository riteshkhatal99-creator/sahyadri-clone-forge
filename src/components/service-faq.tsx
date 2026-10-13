import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ServiceFaq({ items }: { items: { question: string; answer: string }[] }) {
  return <div className="service-faq"><p className="eyebrow">COMMON QUESTIONS</p><h2>Good to know before you start</h2>
    <Accordion type="single" collapsible>{items.map((item, index) => <AccordionItem key={item.question} value={String(index)}>
      <AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent><p>{item.answer}</p></AccordionContent>
    </AccordionItem>)}</Accordion>
  </div>;
}