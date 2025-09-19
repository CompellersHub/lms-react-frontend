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
        className="absolute bottom-8 left-10 w-cover p-5 py-2 bg-yellow-400 text-black font-bold text-2xl text-center rounded-full shadow-xl hover:bg-yellow-500 transition-all duration-300"
      >
        Download
      </a>
    </section>
  );
}

export default DownloadGuideSection;
