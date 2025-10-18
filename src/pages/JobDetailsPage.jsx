import { useParams } from "react-router-dom";
import { useGetJobDetailsQuery } from "@/services/coursesApi";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { FaTiktok, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { data: job, isLoading, error } = useGetJobDetailsQuery(id);

  if (isLoading) return <div className="py-20 text-center">Loading...</div>;
  if (error || !job) return <div className="py-20 text-center text-red-500">Job not found.</div>;

  return (
    <section className="py-16 bg-gray-50 min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <button
              onClick={() => window.history.back()}
              className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-semibold shadow transition-all duration-200"
            >
              ← Back to Jobs
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
            {(job.logo || job.company_logo || job.image) ? (
              <img
                src={job.logo || job.company_logo || job.image}
                alt={job.company || job.company_name || job.title}
                className="w-full max-w-md h-64 object-contain rounded-xl shadow bg-white"
                style={{ minWidth: 220 }}
                onError={e => (e.target.src = "/placeholder.svg")}
              />
            ) : (
              <Briefcase className="w-32 h-32 text-primary/40" />
            )}
            <div className="flex-1 w-full">
              <h1 className="text-4xl font-bold text-foreground mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-base text-foreground/70 mb-2">
                <span className="flex items-center gap-1"><MapPin className="w-5 h-5" />{job.location || "Remote"}</span>
                <span className="flex items-center gap-1"><Clock className="w-5 h-5" />{job.type || "Full Time"}</span>
              </div>
              <div className="text-sm text-foreground/60 font-semibold mb-2">{job.company || job.company_name}</div>
              <div className="flex flex-wrap gap-4 mb-2">
                {job.salary && (
                  <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                    Salary: {job.salary}
                  </span>
                )}
                {job.deadline && (
                  <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="prose max-w-none text-foreground/90 mb-6">
            <p className="mb-4 text-lg font-medium">{job.description}</p>
            {job.requirements && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Requirements</h3>
                <div>{job.requirements}</div>
              </div>
            )}
            {job.responsibilities && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Responsibilities</h3>
                <div>{job.responsibilities}</div>
              </div>
            )}
            {job.benefits && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Benefits</h3>
                <div>{job.benefits}</div>
              </div>
            )}
            {job.experience && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Experience</h3>
                <div>{job.experience}</div>
              </div>
            )}
            {job.education && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Education</h3>
                <div>{job.education}</div>
              </div>
            )}
            {job.contact_email && (
              <div className="mt-6">
                <span className="font-semibold">Contact Email:</span> {job.contact_email}
              </div>
            )}
          </div>
          {job.apply_link && (
            <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-400 hover:from-blue-600 hover:to-purple-500 text-white text-lg px-8 py-3 w-full font-semibold mt-6 rounded-full">
                Apply Now
              </Button>
            </a>
          )}

          {/* Social Profile Icons */}
          <div className="flex justify-center gap-8 mt-10">
            <a href="https://www.tiktok.com/@titans.careers" className="text-primary hover:text-secondary" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/titans.careers/" className="text-primary hover:text-secondary" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/aml-pro-trainer-22ab41347/" className="text-primary hover:text-secondary" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="https://x.com/TitansCareers" className="text-primary hover:text-secondary" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/channel/UCNUE2QZemJ4vlsvirzJ71kw" className="text-primary hover:text-secondary" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
          <div className="text-center mt-2 text-base font-medium text-foreground/80">Share this job</div>
        </div>
      </div>
    </section>
  );
}
