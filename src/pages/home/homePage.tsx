import { Search, Bus, MapPin, Smartphone } from "lucide-react";

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Book Your Bus Tickets Easily
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Find, compare, and book seats on the go with our reliable
          transportation app.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="From"
            className="w-full md:w-1/3 px-4 py-3 rounded-lg text-black focus:outline-none"
          />
          <input
            type="text"
            placeholder="To"
            className="w-full md:w-1/3 px-4 py-3 rounded-lg text-black focus:outline-none"
          />
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
            <Search className="inline mr-2" size={18} />
            Search
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <Bus className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
          <p>Book your bus seats in just a few clicks anytime, anywhere.</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <MapPin className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Routes</h3>
          <p>Check bus locations and routes in real-time on the map.</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <Smartphone className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
          <p>Seamless experience across desktop and mobile devices.</p>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Routes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Hargeisa → Berbera", "Hargeisa → Burao", "Hargeisa → Borama"].map(
            (route, idx) => (
              <div
                key={idx}
                className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold mb-2">{route}</h4>
                <p className="text-gray-600">Comfortable buses available</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Book Now
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Download the App & Travel Smart
        </h2>
        <p className="mb-6">
          Available on Android and iOS. Book and manage your trips anywhere.
        </p>
        <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default HomePage;
