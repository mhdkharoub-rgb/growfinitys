
const items=[
  {title:'AI-Powered Captions',desc:'High-converting posts tailored to your niche every month.'},
  {title:'Branded Images',desc:'Luxury black + gold visuals sized for all platforms.'},
  {title:'Automation Workflows',desc:'Zapier/Make recipes that deliver packs to your Drive & email.'},
];
export default function Features(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
      {items.map((it,i)=>(
        <div key={i} className="card">
          <h3 className="text-xl font-semibold mb-2">{it.title}</h3>
          <p className="text-white/80">{it.desc}</p>
        </div>
      ))}
    </section>
  )
}
