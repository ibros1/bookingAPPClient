import { motion } from "framer-motion";
import {
  Bike,
  Bus,
  Calendar,
  CarTaxiFront,
  Package,
  Search,
  Star,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const slides = [
  {
    title: "Book Your Bus Tickets Easily",
    subtitle:
      "Find, compare, and book seats on the go with our reliable transportation app.",
    image: "/image1.png",
  },
  {
    title: "Travel Comfortably Across Cities",
    subtitle: "Enjoy safe and comfortable journeys at affordable prices.",
    image: "/image2.png",
  },
];

const popularRoutes = [
  {
    route: "Hargeisa → Berbera",
    price: "$9",
    rating: 4.8,
    image: "/berbera.jpg",
  },
  {
    route: "Hargeisa → Burao",
    price: "$12",
    rating: 4.6,
    image: "/burco.jpg",
  },
  {
    route: "Hargeisa → Borama",
    price: "$9",
    rating: 4.7,
    image: "/borama.jpg",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };

  return (
    <div className="w-full">
      {/* ================= HERO ================= */}
      <section className="relative">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <div key={idx} className="relative h-[90vh]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl mb-8 max-w-2xl"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Suggested Routes */}
                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                  {[
                    "Hargeisa → Berbera",
                    "Hargeisa → Burao",
                    "Hargeisa → Borama",
                  ].map((route, i) => (
                    <span
                      key={i}
                      className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md hover:bg-yellow-400 hover:text-black transition cursor-pointer"
                      onClick={() => navigate("/routes")}
                    >
                      {route}
                    </span>
                  ))}
                </div>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col lg:flex-row items-center gap-3 bg-white/95 p-6 rounded-2xl shadow-2xl max-w-4xl w-full mx-auto"
                >
                  <input
                    type="text"
                    placeholder="From"
                    className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                  <div className="flex gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 border px-4 py-3 rounded-lg bg-gray-50 flex-1">
                      <Calendar size={18} className="text-gray-500" />
                      <input
                        type="date"
                        className="flex-1 bg-transparent focus:outline-none text-gray-800"
                      />
                    </div>
                  </div>
                  <button className="w-full lg:w-auto bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center justify-center">
                    <Search className="inline mr-2" size={18} />
                    Search
                  </button>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-14 px-6 bg-white">
        {" "}
        <h2 className="text-3xl font-bold mb-10 text-center">Our Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6  mx-auto">
          {[
            {
              name: "Bus",
              desc: "Book now",
              color: "bg-yellow-100",
              icon: Bus,
              active: true,
              navigate: "/routes",
            },
            {
              name: "Taxi",
              desc: "Comming soon",
              color: "bg-red-100",
              icon: CarTaxiFront,
              active: false,
            },
            {
              name: "Alaab",
              desc: "Coming soon",
              color: "bg-indigo-100",
              icon: Package,
              active: false,
            },
            {
              name: "Delivery",
              desc: "Coming soon",
              color: "bg-purple-100",
              icon: Bike,
              active: false,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`${item.color} rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:scale-105 transition cursor-pointer`}
              onClick={() => {
                if (!item.active) {
                  toast.error("Comming soon!! 🚧");
                } else {
                  navigate("/routes");
                }
              }}
            >
              <item.icon className="w-10 h-10 text-gray-800 mb-3" />
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ================= QUICK ACTIONS ================= */}
      <section className="py-14 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-10 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6  mx-auto">
          {[
            {
              name: "Zaad",
              desc: "Mobile Payment",
              color: "bg-yellow-100",
              logo: "/zaad.png",
            },
            {
              name: "E-Dahab",
              desc: "Mobile Payment",
              color: "bg-green-100",
              logo: "/eDahab.png",
            },
            {
              name: "Bank",
              desc: "Online Banking",
              color: "bg-blue-100",
              logo: "/stripe.png",

              icon: CarTaxiFront,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:scale-105 transition ${item.color}`}
            >
              {/* Logo or Icon */}
              {item.logo && (
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-32 mb-4 object-contain"
                />
              )}

              {/* Description */}
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= POPULAR ROUTES ================= */}
      <section className="bg-gray-100 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Popular Routes</h2>
        <div className="grid md:grid-cols-3 gap-8  mx-auto">
          {popularRoutes.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-6 bg-white">
                <h4 className="text-xl font-semibold mb-1">{item.route}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {item.rating} / 5
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-4">
                  From {item.price}
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DOWNLOAD APP ================= */}
      <section className="py-20 bg-blue-200 text-center relative">
        <div className=" mx-auto grid md:grid-cols-2 px-16 gap-12 items-center px-6">
          <div className="text-left">
            <h2 className="text-4xl font-bold mb-4">Download the App</h2>
            <p className="text-lg mb-6">
              Book, track, and manage your rides and deliveries anywhere with
              our mobile app.
            </p>
            <div className="flex gap-4">
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center gap-2">
                <Download size={18} /> Google Play
              </button>
              <button className="bg-white/20 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <Download size={18} /> App Store
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/commingSoon.png"
              alt="App preview"
              className="w-64 md:w-80 mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
