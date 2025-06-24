"use client";

import { useState, useEffect } from "react";
import { mockApiResponse } from "../lib/mockData";
import Image from "next/image";


interface Offer {
  title: string;
  coins: number;
  type: string;
  discountCode: string;
  logo: string;
  brandproduct: {
    socialMedia: { url: string; icon: string; description: string }[];
    linkedStores: { _id: string; businesstype: string | null }[];
    customer_cashback: number;
    customer_cashback_percent: number;
    discountDuration: number;
    expiry_date: string;
    tag: string;
    name: string;
    discountCode: string;
  };
  store: {
    name: string;
    _id: string;
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const fetchedOffers = mockApiResponse.data.getUserDiscountCodes.data.map((item) => ({
      title: item.brandproduct.name,
      coins: item.brandproduct.customer_cashback,
      type: item.brandproduct.tag || "all",
      discountCode: item.discountCode,
      logo: item.store.logo,
      brandproduct: {
        socialMedia: item.brandproduct.socialMedia,
        linkedStores: item.brandproduct.linkedStores,
        customer_cashback: item.brandproduct.customer_cashback,
        customer_cashback_percent: item.brandproduct.customer_cashback_percent,
        discountDuration: item.brandproduct.discountDuration,
        expiry_date: item.brandproduct.expiry_date,
        tag: item.brandproduct.tag || "all",
        name: item.brandproduct.name,
        discountCode: item.brandproduct.discountCode,
      },
      store: {
        name: item.store.name,
        _id: item.store._id,
      },
    }));
    setOffers(fetchedOffers);
  }, []);

  const toggleDetails = (offer: Offer) => {
    setSelectedOffer(selectedOffer?.title === offer.title ? null : offer);
  };

 
  const parseDiscounts = (discountText: string) => {
    const lines = discountText.split("\n").filter(line => line.trim());
    const discounts = [];
    for (const line of lines) {
      if (line.includes("→") && line.includes("% OFF")) {
        const [original, discounted] = line.split("→").map(s => s.trim());
        const [service] = original.split("-").map(s => s.trim());
        const [origPrice] = original.match(/\(([^)]+)\)/)?.[1].split("–") || ["N/A"];
        const [discPrice] = discounted.match(/\(([^)]+)\)/)?.[1] || ["N/A"];
        const [discountPercent] = discounted.match(/(\d+)%/)?.[1] || ["N/A"];
        discounts.push({ service, origPrice, discPrice, discountPercent });
      }
    }
    return discounts;
  };


  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(Number(expiryDate));
    const today = new Date("2025-06-21T12:23:00Z"); 
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 flex flex-col items-center p-4 font-sans relative">
      <div className="w-full max-w-4xl">
        <header className="flex justify-center items-center mb-6 relative">
          <Image src="/images/Recipto Logo.jpg" alt="Recip.to Logo" width={80} height={80} className="rounded-full shadow-lg" />
          <h1 className="text-3xl font-bold ml-4 text-purple-800">Recip.to</h1>
          <button
            className="absolute top-0 right-0 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-md text-sm font-medium text-purple-700 hover:bg-purple-100 transition duration-300 flex items-center"
            onClick={() => alert("How It Works? - Explore tailored tax offers, check details, and earn coins!")}
          >
            <span className="mr-2">How It Works?</span>
          </button>
        </header>
        <nav className="flex space-x-4 mb-6 flex-wrap justify-center">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "all" ? "bg-purple-600 text-white" : "bg-gray-200"} flex items-center m-1 transition duration-300 hover:shadow-md`}
            onClick={() => setActiveTab("all")}
          >
            <Image src="/images/Rewards Stars.png" alt="Offers" width={20} height={20} className="mr-2" />
            Offers
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "coupons" ? "bg-purple-600 text-white" : "bg-gray-200"} flex items-center m-1 transition duration-300 hover:shadow-md`}
            onClick={() => setActiveTab("coupons")}
          >
            <Image src="/images/Filter Icons - Business.png" alt="Coupons" width={20} height={20} className="mr-2" />
            My Coupons
          </button>
        </nav>
      </div>
      <main className="w-full max-w-lg mx-auto">
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="relative">
            <div
              className="w-full h-56 bg-cover bg-center rounded-xl"
              style={{ backgroundImage: "url(/images/taxservices.webp)" }}
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 shadow-md">
              <span className="text-sm font-medium text-purple-700">How It Works?</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-4 text-gray-800">Tax Services Offers</h2>
          <p className="text-base text-gray-600 mt-1">14 Offers</p>
        </section>
        <div className="flex flex-wrap space-x-2 mb-6 justify-center">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "all" ? "bg-purple-200 text-purple-800" : "bg-gray-100"} flex items-center m-1 transition duration-300 hover:shadow-md`}
            onClick={() => setActiveTab("all")}
          >
            <Image src="/images/Filter Icons - All.png" alt="All" width={15} height={15} className="mr-2" />
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "salaried" ? "bg-purple-200 text-purple-800" : "bg-gray-100"} flex items-center m-1 transition duration-300 hover:shadow-md`}
            onClick={() => setActiveTab("salaried")}
          >
            <Image src="/images/Filter Icons - Personal.png" alt="Salaried" width={15} height={15} className="mr-2" />
            For Salaried Professionals
          </button>
        </div>
        {offers.length > 0 ? (
          offers
            .filter((offer) => offer.type === activeTab || activeTab === "all")
            .map((offer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100 hover:shadow-lg transition duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="bg-purple-100 text-purple-800 rounded-lg inline-block px-3 py-1 text-sm font-medium">
                      <Image src={offer.logo} alt={`${offer.store.name} Logo`} width={20} height={20} className="w-5 h-5 inline-block mr-2" />
                      {offer.store.name}
                    </div>
                    <h3 className="text-lg font-semibold mt-3 text-gray-900">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {parseDiscounts(offer.discountCode)[0]?.service || "Check details for discounts"}
                    </p>
                    <button className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md hover:bg-yellow-600 transition duration-300">
                      <Image src="/images/Coins.png" alt="Coins" width={15} height={15} className="mr-2" />
                      Earn {offer.coins} Coins ({offer.brandproduct.customer_cashback_percent}% Cashback)
                    </button>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => toggleDetails(offer)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-300"
                    >
                      View
                    </button>
                  </div>
                </div>
                {selectedOffer?.title === offer.title && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner animate-fade-in">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Offer Details</h4>
                    <p className="text-sm text-gray-700 mb-2"><strong>Service:</strong> {offer.title}</p>
                    {parseDiscounts(offer.brandproduct.discountCode).map((disc, idx) => (
                      <div key={idx} className="text-sm text-gray-700 mb-2">
                        <strong>{disc.service}</strong>: {disc.origPrice} → {disc.discPrice} ({disc.discountPercent}% OFF)
                      </div>
                    ))}
                    <p className="text-sm text-gray-700 mb-2"><strong>Coins Earned:</strong> {offer.coins}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Cashback:</strong> {offer.brandproduct.customer_cashback_percent}%</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Type:</strong> {offer.type}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Tag:</strong> {offer.brandproduct.tag}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Discount Duration:</strong> {offer.brandproduct.discountDuration} days</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Expiry:</strong> {getDaysRemaining(offer.brandproduct.expiry_date)}</p>
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold text-gray-800">Social Media:</h5>
                      {offer.brandproduct.socialMedia.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center mt-1 text-sm"
                        >
                          {social.description.includes("WhatsApp") ? (
                            <Image src="/images/WhatsApp Logo.jpg" alt="WhatsApp" width={15} height={15} className="mr-2" />
                          ) : social.description.includes("Call us") ? (
                            <Image src="/images/Call Logo.png" alt="Call" width={15} height={15} className="mr-2" />
                          ) : null}
                          {social.description}
                        </a>
                      ))}
                    </div>
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold text-gray-800">Linked Stores:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {offer.brandproduct.linkedStores.map((store, idx) => (
                          <li key={idx}>{store._id}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition duration-300"
                      onClick={() => alert("Consultation booked! Contact us via social media links.")}
                    >
                      Book Free Consultation
                    </button>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p className="text-center text-gray-600">No offers available at the moment.</p>
        )}
      </main>
    </div>
  );
}