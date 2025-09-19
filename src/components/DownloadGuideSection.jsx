import freeuk from "@/assets/img/free-uk.jpg";

function DownloadGuideSection() {
  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex items-center justify-center bg-white overflow-hidden"
      style={{ height: 'auto', minHeight: '320px', maxHeight: '600px' }}
    >
      <div className="relative w-full flex items-center justify-center">
        <img
          src={freeuk}
          alt="Free UK Guide"
          className="w-full h-auto object-contain"
          style={{ maxHeight: '100vw' }}
        />
        <a
          href="#"
          download
          className="font-sans absolute left-4 bottom-2 sm:left-20 sm:bottom-8 px-6 py-2 sm:px-10 sm:py-4 bg-yellow-400 text-black font-bold text-base sm:text-2xl text-center rounded-full shadow-xl hover:bg-yellow-500 transition-all duration-300"
        >
          Download
        </a>
      </div>
    </section>
  );
}

export default DownloadGuideSection;
