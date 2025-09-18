
const tiers=[
  {name:'Basic', price:'$19/mo', features:['30 captions','30 images','Content calendar'], cta:'#join'},
  {name:'Pro', price:'$49/mo', popular:true, features:['100 posts','4 blog ideas','2 ad copies','Calendar + hashtags'], cta:'#join'},
  {name:'VIP', price:'$99/mo', features:['100 posts + 10 blog ideas','5 ad copies','4 email campaigns','Caption Generator tool'], cta:'#join'},
];
export default function Pricing(){
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Pricing</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t,i)=>(
          <div key={i} className={`card ${t.popular?'border-2 border-goldDeep':''}`}>
            {t.popular && <div className="badge mb-3">Most Popular</div>}
            <h3 className="text-2xl font-semibold">{t.name}</h3>
            <p className="text-3xl mt-2 bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(90deg,#FFD700,#D4AF37)'}}>{t.price}</p>
            <ul className="mt-4 space-y-2 text-white/80">
              {t.features.map((f,idx)=>(<li key={idx}>• {f}</li>))}
            </ul>
            <a href={t.cta} className="btn-gold mt-6 inline-block">Choose {t.name}</a>
          </div>
        ))}
      </div>
    </section>
  )
}
