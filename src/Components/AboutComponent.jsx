import wealthWise from '../assets/wealthWise.png';

const AboutComponent = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white px-6 py-12"
      style={{ backgroundColor: 'rgb(17, 24, 39)' }}
    >
      <div
        className="p-10 rounded-3xl shadow-xl max-w-5xl w-full"
        style={{ backgroundColor: 'rgb(17, 24, 39)' }}
      >
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white">About WealthWise</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Discover how we’re changing the financial landscape and empowering you to build a secure future.
          </p>
        </header>

        {/* Main Content */}
        <main className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Image Section */}
          <div className="lg:w-1/2 flex-shrink-0">
            <img
              src={wealthWise}
              alt="WealthWise Team"
              className="w-full h-auto rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Text Content Section */}
          <div className="lg:w-1/2 text-gray-300 space-y-10">
            {/* Who We Are Section */}
            <section>
              <h2 className="text-4xl font-bold mb-4 text-white">Who We Are</h2>
              <p className="text-lg leading-relaxed">
                WealthWise is a forward-thinking financial platform designed to make managing wealth and investments simple, transparent, and accessible for everyone. Our team of experts is dedicated to helping you navigate your financial journey with confidence.
              </p>
            </section>

            {/* Our Mission Section */}
            <section>
              <h2 className="text-4xl font-bold mb-4 text-white">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                Our mission is to empower individuals and businesses to take control of their financial futures. We provide cutting-edge tools, resources, and personalized advice to help you make informed decisions and build lasting wealth.
              </p>
            </section>

            {/* Our Values Section */}
            <section>
              <h2 className="text-4xl font-bold mb-4 text-white">Our Values</h2>
              <ul className="list-disc list-inside text-lg leading-relaxed">
                <li>Integrity and Trust in Financial Guidance</li>
                <li>Innovation in Wealth Management Tools</li>
                <li>Commitment to Financial Literacy and Education</li>
                <li>Transparency in Fees and Services</li>
                <li>Personalized Solutions for Every Client</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutComponent;
