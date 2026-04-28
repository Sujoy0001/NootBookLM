import PriceCard from "../ui/PriceCard";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started and exploring what RAGENGINE can do.",
    features: [
      "20 queries / day",
      "5 requests / min",
      "1 knowledge base",
      "5 MB document storage",
      "REST API access",
      "Community support",
    ],
    isActive: true,
    isComingSoon: false,
    badge: null,
    buttonLabel: "Current Plan",
  },
  {
    id: "premium",
    name: "Premium",
    price: 19,
    description: "For individuals and small teams who need more power and storage.",
    features: [
      "Everything in Free",
      "500 queries / day",
      "20 requests / min",
      "5 knowledge bases",
      "5 GB document storage",
      "Priority support",
    ],
    isActive: false,
    isComingSoon: true,
    badge: "Most Popular",
    buttonLabel: "Get Premium",
  },
  {
    id: "business",
    name: "Business",
    price: 59,
    description: "Unlimited scale for production-grade RAG applications.",
    features: [
      "Everything in Premium",
      "1500 queries / day",
      "100 requests / min",
      "10 knowledge bases",
      "25 GB document storage",
      "Custom embedding models",
      "24/7 support",
    ],
    isActive: false,
    isComingSoon: true,
    badge: "Best Value",
    buttonLabel: "Get Business",
  },
];

export default function PricingPage() {
  return (
    <div className="px-2 sujoy1 mb-8">
      <div className="text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
          Pricing
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sujoy2">
          Simple, transparent pricing
        </h1>
        <p className="mt-2 text-base text-white/40 leading-relaxed italic">
          Start free. Upgrade when you're ready. No hidden fees, no surprises.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3 mt-8">
        {plans.map((plan) => (
          <PriceCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            isActive={plan.isActive}
            isComingSoon={plan.isComingSoon}
            badge={plan.badge}
            buttonLabel={plan.buttonLabel}
            onButtonClick={() => console.log(`Clicked: ${plan.name}`)}
          />
        ))}
      </div>
    </div>
  );
}