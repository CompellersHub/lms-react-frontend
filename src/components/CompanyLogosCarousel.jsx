import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const companyLogos = [
  {
    url: "/assets/company-logos/deloitte.svg",
    alt: "Deloitte",
  },
  {
    url: "/assets/company-logos/cipla.svg",
    alt: "Cipla",
  },
  {
    url: "/assets/company-logos/seeds.svg",
    alt: "ASG",
  },
  {
    url: "/assets/company-logos/wey.svg",
    alt: "Weylandts",
  },
  {
    url: "assets/company-logos/pern.png",
    alt: "Perno",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05713c9_Capitec.svg",
    alt: "Capitec",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e057144d_Mukuru.svg",
    alt: "Mukuru",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571481_cardano.svg",
    alt: "Cardano",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05714e6_FLM.svg",
    alt: "FLM",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05713fa_Informa.svg",
    alt: "Informa",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571434_Nedbank.svg",
    alt: "Nedbank",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05714c0_TRU.svg",
    alt: "TRU",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66cc5571b771073ceb212b24_FOM.svg",
    alt: "FOM",
  },
  {
    url: "assets/company-logos/UKPro.jpeg",
    alt: "UKPro",
  },
  {
    url: "assets/company-logos/zenith.jpg",
    alt: "Zenith Bank",
  },
  {
    url: "assets/company-logos/dangote.jpg",
    alt: "Dangote",
  },
  {
    url: "assets/company-logos/barclays.jpg",
    alt: "Barclays Bank",
  },
];

export function CompanyLogosCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
          Trusted by leading companies
        </h2>

        <div className="">
          <Slider {...settings}>
            {companyLogos.map((logo, index) => (
              <div key={index} className="px-2">
                <div className="flex h-24 items-center justify-center p-4 grayscale transition-all hover:grayscale-0">
                  <img
                    src={logo.url}
                    alt={logo.alt}
                    className="max-h-20 max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
