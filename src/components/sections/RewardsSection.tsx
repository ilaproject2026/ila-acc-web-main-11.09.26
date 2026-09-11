import { Gift, Star, Users, Trophy } from 'lucide-react'

const tiers = [
  { name: 'Bronze', points: '0 – 500', perks: ['5% course discount', 'Newsletter access', 'Community forum'] },
  { name: 'Silver', points: '501 – 2,000', perks: ['10% course discount', 'Priority support', 'Free webinar access'] },
  { name: 'Gold', points: '2,001 – 5,000', perks: ['15% discount', '1 free consultation', 'Referral bonuses'] },
  { name: 'Platinum', points: '5,000+', perks: ['20% discount', 'VIP event access', 'Dedicated account manager'] },
]

export default function RewardsSection() {
  return (
    <section id="rewards" className="section-padding bg-gradient-to-br from-brand-800 to-brand-700 text-white">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4 text-accent-400" />
            Loyalty Program
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">ILA Global Rewards Program</h2>
          <p className="text-blue-100 leading-relaxed">
            Earn points on every enrollment, referral, and service booking. Unlock exclusive perks,
            discounts, and priority access as you climb the tiers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map(({ name, points, perks }, i) => (
            <div
              key={name}
              className={`rounded-2xl p-6 border transition-all card-hover ${
                i === 3
                  ? 'bg-accent-500/20 border-accent-400/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                {i === 0 && <Star className="w-5 h-5 text-orange-300" />}
                {i === 1 && <Star className="w-5 h-5 text-slate-300" />}
                {i === 2 && <Trophy className="w-5 h-5 text-yellow-400" />}
                {i === 3 && <Trophy className="w-5 h-5 text-accent-400" />}
                <h3 className="text-lg font-bold">{name}</h3>
              </div>
              <p className="text-sm text-blue-200 mb-4">{points} points</p>
              <ul className="space-y-2">
                {perks.map((perk) => (
                  <li key={perk} className="text-sm text-blue-100 flex items-start gap-2">
                    <span className="text-accent-400 mt-1">•</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-blue-200">
            <Users className="w-4 h-4" />
            Join 3,000+ members already earning rewards
          </div>
        </div>
      </div>
    </section>
  )
}
