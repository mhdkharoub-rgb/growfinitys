
const faqs=[
  {q:'How does the monthly content work?', a:'New packs are generated and delivered automatically each month.'},
  {q:'Can I cancel anytime?', a:'Yes — manage your plan from your account in one click.'},
  {q:'Do I get a commercial license?', a:'Yes — you can use content for your brand and clients.'},
];
export default function FAQ(){
  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((f,i)=>(
          <details key={i} className="card">
            <summary className="cursor-pointer text-lg font-semibold">{f.q}</summary>
            <p className="mt-2 text-white/80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
