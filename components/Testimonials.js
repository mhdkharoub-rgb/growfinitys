
const t=[
  {name:'Amira S.', role:'Entrepreneur', quote:'Exclusive, powerful, worth every dollar.'},
  {name:'Daniel K.', role:'Coach', quote:'The premium tool for serious growth.'},
  {name:'Leila M.', role:'Founder', quote:'Redefines what’s possible with AI.'},
];
export default function Testimonials(){
  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">What Members Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {t.map((x,i)=>(
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full border border-goldDeep/60 flex items-center justify-center">∞</div>
              <div><div className="font-semibold">{x.name}</div><div className="text-white/60 text-sm">{x.role}</div></div>
            </div>
            <p className="text-white/80">“{x.quote}”</p>
          </div>
        ))}
      </div>
    </section>
  )
}
