export default function HeroSection() {
  const styleCards = [
    {
      title: "Anime",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Realistic",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Ghibli",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Artistic",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    }
  ];

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8 animate-float">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">AI Image Generator</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create stunning anime, realistic humans, Studio Ghibli, and artistic images with our advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          {styleCards.map((card, index) => (
            <div key={index} className="card-3d glass-morphism rounded-2xl p-4 cursor-pointer">
              <img 
                src={card.image} 
                alt={`${card.title} style preview`} 
                className="w-full h-24 object-cover rounded-xl mb-3"
              />
              <h3 className="font-semibold text-sm">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
