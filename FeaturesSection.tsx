export default function FeaturesSection() {
  const features = [
    {
      icon: "ri-map-2-line",
      title: "Interactive Maps",
      description: "Visualize your entire trip route and optimize travel times between attractions.",
      bgColor: "bg-blue-100",
      textColor: "text-primary"
    },
    {
      icon: "ri-team-line",
      title: "Collaborative Planning",
      description: "Invite friends and family to contribute to your trip itinerary in real-time.",
      bgColor: "bg-green-100",
      textColor: "text-secondary"
    },
    {
      icon: "ri-compass-3-line",
      title: "Local Recommendations",
      description: "Discover hidden gems and authentic experiences with tips from locals.",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: "ri-wallet-3-line",
      title: "Budget Tracking",
      description: "Keep track of expenses and stay within your travel budget with our tools.",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      icon: "ri-notification-4-line",
      title: "Smart Reminders",
      description: "Never miss a reservation or tour with timely notifications and alerts.",
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    },
    {
      icon: "ri-file-list-3-line",
      title: "Travel Checklists",
      description: "Stay organized with customizable packing lists and pre-trip preparations.",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600"
    },
  ];
  
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Why Plan With TripPlanner</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Our platform makes trip planning easier, more collaborative, and more enjoyable.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className={`w-12 h-12 rounded-md ${feature.bgColor} flex items-center justify-center ${feature.textColor} mb-4`}>
              <i className={`${feature.icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
