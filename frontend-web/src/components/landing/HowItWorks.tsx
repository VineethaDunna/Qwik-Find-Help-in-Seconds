import { Search, Calendar, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find',
    description: 'Search for helpers nearby based on your needs',
  },
  {
    icon: Calendar,
    title: 'Book',
    description: 'Choose a time that works and confirm your booking',
  },
  {
    icon: CreditCard,
    title: 'Pay',
    description: 'Pay securely after the job is done',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12">
      <h2 className="text-center text-lg font-semibold text-muted-foreground mb-8">
        How it works
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <step.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
