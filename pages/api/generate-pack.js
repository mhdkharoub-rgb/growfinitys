
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { tier='basic', niche='general' } = req.body || {};
  const data = {
    tier, niche,
    captions: [
      "Consistency is the secret ingredient in success. Show up every day — your future self will thank you.",
      "Customers don’t buy products — they buy stories. What story is your brand telling today?"
    ],
    imagePrompts: [
      "Minimalist sunrise background, bold text overlay: 'Consistency Beats Talent'",
      "Flat-design shopping bag with glowing book, overlay: 'Your Story Sells'"
    ]
  };
  return res.status(200).json({ ok:true, pack:data });
}
