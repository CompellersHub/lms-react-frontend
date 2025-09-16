import freeuk from "@/assets/img/free-uk.jpg";

function DownloadGuideSection() {
  return (
    <section
      className="relative h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${freeuk})` }}
    >
      <a
        href="#"
        download
        className="absolute bottom-3 left-15 w-1/2 py-5 bg-yellow-400 text-black font-bold text-5xl text-center rounded-xl shadow-xl hover:bg-yellow-500 transition-all duration-300"
      >
        Download Free Uk Career Guide
      </a>
    </section>
  );
}

export default DownloadGuideSection;
