import SearchBox from '@/components/SearchBox';

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Scenic mountain landscape" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Plan your perfect getaway</h2>
          <p className="mt-6 text-xl max-w-3xl">Build custom itineraries, discover amazing destinations, and create memories that last a lifetime.</p>
        </div>
        
        <div className="mt-10 max-w-3xl">
          <SearchBox />
        </div>
      </div>
    </section>
  );
}
