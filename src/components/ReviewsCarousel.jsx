import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const fullReviews = [
	{
		title: "From Legal Theory to Financial Triumph!",
		text: `I was a lawyer, precise and detail-oriented, yet I yearned for a career that combined my analytical mind with the dynamic world of finance. Titans Careers was the catalyst I needed. They didn't just teach me AML/KYC; they empowered me to bridge the gap, turning my legal acumen into a powerful asset. Today, I thrive as a Conflict Analyst at a prestigious UK law firm, earning a significantly higher salary and feeling profoundly fulfilled. This program truly changed my life's trajectory!`,
		author: "Chinedu L., Conflict Analyst",
	},
	{
		title: "My Legal Prowess, Reimagined for Compliance!",
		text: `My legal background gave me a strong foundation, but I felt a missing piece in my career puzzle,a specialization that could elevate my impact. Titans Careers filled that void and so much more. This program wasn't just about learning; it was about strategically reimagining my skills. I gained the in-depth AML/KYC insights that propelled me into an influential Conflict Analyst role, where I'm driving critical decisions and seeing a remarkable progression in my career and income. It was the most strategic, life-affirming move I ever made!`,
		author: "Rasheed P., Conflict Analyst",
	},
	{
		title: "The Banking Breakthrough: From Retail to Elite Compliance!",
		text: `Years in retail banking left me craving a role with greater depth and impact. I knew I had potential, but lacked the specialized expertise to break into elite compliance. Titans Careers was my gateway. Their comprehensive AML/KYC training didn't just equip me with knowledge; it instilled confidence and opened doors. I successfully transitioned into a high-demand Compliance Officer position within a major UK bank, achieving a dream career with enhanced responsibilities and a substantial salary increase. My future has never looked brighter!`,
		author: "Ojukwu R., Compliance Officer",
	},
	{
		title: "Accelerating Ambition: My Leap to AML Leadership!",
		text: `As a seasoned banker, I was good, but I aspired for greatness,to lead in the critical domain of AML. Titans Careers provided the fast-track. This wasn't just a course; it was an immersive journey into the heart of UK banking regulations, arming me with unparalleled insights and the specific compliance skillset to advance. I effortlessly transitioned into a crucial AML Specialist role, enjoying greater influence, a higher earning potential, and the satisfaction of shaping financial security. It's an investment that pays dividends daily!`,
		author: "Wunmi T., AML Specialist",
	},
	{
		title: "From Compassion to Corporate: A New Chapter of Professionalism!",
		text: `My years in care taught me invaluable lessons in organization and empathy, but I dreamed of a professional office setting where my attention to detail could truly shine. The thought of transitioning felt daunting, but Titans Careers made it possible. Their practical training didn't just give me skills; it built my confidence, bridging the gap between my past experience and my future aspirations. I proudly landed an administrative role, where I'm excelling, growing, and experiencing the fulfillment of a truly transformative career journey!`,
		author: "Aisha D., Administrative Assistant",
	},
	{
		title: "Unlocking Potential: My Administrative Ascent!",
		text: `I once believed my background in care limited my professional horizons, but Titans Careers completely shattered that misconception. They showed me the incredible transferability of my skills,my empathy, my organization, my dedication. This program provided the clear structure and comprehensive knowledge I needed to make a successful, confident transition into an administrative position. It wasn't just a career change; it was an awakening to my true potential, leading to a stable, rewarding role I truly cherish.`,
		author: "James K., Office Administrator",
	},
	{
		title: "Academic Acumen to Anti-Financial Crime Champion!",
		text: `As a lecturer, my world was research and critical thinking. While rewarding, I longed to apply these strengths to real-world impact, battling financial crime. Titans Careers was the bridge between academia and industry. They masterfully transformed my analytical rigor into practical compliance solutions, opening doors to an exhilarating career as a Compliance Analyst. I now apply my skills daily to complex challenges, making a tangible difference, and enjoying a dynamic, intellectually stimulating profession I never thought possible!`,
		author: "Dr. Sola, Compliance Analyst",
	},
	{
		title: "Educator's Evolution: Leading in Compliance!",
		text: `After years in academia, I yearned for a dynamic career where I could leverage my expertise in a new, impactful way. The comprehensive training at Titans Careers was the springboard I needed. Beyond the robust curriculum, their unparalleled career support provided the confidence and connections to navigate a successful transition. I am now thriving as a Senior Compliance Consultant, leading critical projects and enjoying the profound satisfaction of a truly invaluable career evolution. It's been an incredible journey of growth and achievement!`,
		author: "Dr. Alex C., Senior Compliance Consultant",
	},
];

function getInitials(name) {
	const names = name.split(" ");
	return names.length === 1
		? names[0][0]
		: names[0][0] + names[names.length - 1][0];
}

export function ReviewsCarousel() {
	const sliderRef = useRef(null);
	const [isHovered, setIsHovered] = useState(false);
	const [flippedIdx, setFlippedIdx] = useState(null); // Track which card is flipped (for mobile)

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		autoplay: !isHovered,
		autoplaySpeed: 5000, // 5 seconds
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: { slidesToShow: 2 },
			},
			{
				breakpoint: 640,
				settings: { slidesToShow: 1 },
			},
		],
	};

	// Handle card flip for mobile (tap)
	const handleCardFlip = (idx) => {
		setFlippedIdx(flippedIdx === idx ? null : idx);
	};

	return (
		<section className="py-16 bg-white text-gray-900">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-bold text-center mb-2">
					What Our Users Say
				</h2>
				<p className="text-center text-lg text-gray-600 mb-10 m-3">
					Join thousands of professionals who have advanced their careers with
					Titans Careers
				</p>
				<div
					className="relative"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<button
						aria-label="Previous"
						className="absolute left-[-2.5rem] top-1/2 -translate-y-1/2 z-10 bg-gray-100 hover:bg-primary text-primary hover:text-white rounded-full p-3 shadow-lg border border-gray-200"
						onClick={() => sliderRef.current?.slickPrev()}
						style={{ outline: "none" }}
					>
						<ChevronLeft className="h-7 w-7" />
					</button>
					<button
						aria-label="Next"
						className="absolute right-[-2.5rem] top-1/2 -translate-y-1/2 z-10 bg-gray-100 hover:bg-primary text-primary hover:text-white rounded-full p-3 shadow-lg border border-gray-200"
						onClick={() => sliderRef.current?.slickNext()}
						style={{ outline: "none" }}
					>
						<ChevronRight className="h-7 w-7" />
					</button>
					<Slider ref={sliderRef} {...settings}>
						{fullReviews.map((review, idx) => {
							const [name, role] = review.author.split(",");
							const isFlipped = flippedIdx === idx;
							return (
								<div
									key={idx}
									className="px-2 md:px-4 lg:px-8 group h-full"
								>
									<div
										className="relative w-full h-[370px] max-w-[420px] mx-auto cursor-pointer"
										style={{ perspective: '1200px' }}
										onClick={() => handleCardFlip(idx)}
									>
										<div
											className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]`}
											tabIndex={0}
										>
											{/* Front (summary) */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-yellow-100 rounded-2xl border border-gray-300 flex flex-col items-center justify-center shadow-xl p-8 [backface-visibility:hidden] h-full w-full overflow-hidden z-10 text-black">
  <div className="flex flex-col items-center mb-4">
    <div className="h-16 w-16 rounded-full bg-black text-white border-2 border-yellow-400 flex items-center justify-center text-2xl font-bold mb-2 shadow-md">
      {getInitials(name.trim())}
    </div>
    <div className="flex mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
  </div>
  <h3 className="text-lg font-bold text-black mb-2 text-center">{review.title}</h3>
  <p className="text-base text-gray-800 italic mb-4 line-clamp-3 px-2 text-center">{review.text}</p>
  <div className="text-lg font-bold text-black mb-1 text-center">{name.trim()}</div>
  {role && <div className="text-sm text-gray-700 mb-1 text-center">{role.trim()}</div>}
  <span className="mt-2 text-xs font-semibold bg-yellow-400 text-black px-3 py-1 rounded-full shadow-sm">Tap or hover to read more</span>
</div>

{/* Back (full review) */}
<div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-blue-100 to-blue-200 rounded-2xl border border-gray-300 flex flex-col items-center justify-start shadow-xl p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] h-full w-full overflow-y-auto z-20 text-black">
  <h3 className="text-lg font-bold text-black mb-3 text-center">{review.title}</h3>
  <p className="text-base text-gray-800 italic mb-4 whitespace-pre-line px-2 text-center">{review.text}</p>
  <div className="text-lg font-bold text-black mb-1 text-center">{name.trim()}</div>
  {role && <div className="text-sm text-gray-700 mb-1 text-center">{role.trim()}</div>}
  <span className="mt-2 text-xs font-semibold bg-black text-yellow-400 px-3 py-1 rounded-full shadow-md">Tap or hover to go back</span>
</div>

										</div>
									</div>
								</div>
							);
						})}
					</Slider>
				</div>
			</div>
		</section>
	);
}
