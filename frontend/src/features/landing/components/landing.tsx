const links = [
  { name: 'Explore Crypto', href: '/crypto' },
  { name: 'Set Alerts', href: '/alerts' },
];

const stats = [
  { name: 'Cryptocurrencies Tracked', value: '100' },
  { name: 'Price Updates', value: 'Real-Time' },
  { name: 'Users', value: '1' },
  { name: 'Alerts Triggered', value: '0' },
];

export default function Landing() {
  return (
    <div className="min-h-screen relative isolate overflow-hidden bg-blue-900 py-24 mt-[62.62px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Stay Ahead in Crypto Market
          </h2>
          <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">
            Real-time tracking of cryptocurrencies, price alerts, and insightful dashboards — all in one place.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-lg font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-gray-300 transition duration-300 transform hover:scale-105"
              >
                {link.name} <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="flex flex-col-reverse justify-center gap-1 bg-white shadow-lg p-6 rounded-lg text-center hover:bg-blue-100 transition duration-300"
              >
                <dt className="text-base text-blue-900 font-medium">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-blue-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
