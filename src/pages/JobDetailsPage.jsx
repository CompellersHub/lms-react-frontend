import { useParams } from "react-router-dom";
import { useGetJobDetailsQuery } from "@/services/coursesApi";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock } from "lucide-react";

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

          {/* Social Share Buttons */}
          <div className="flex justify-center gap-8 mt-10">
            {/* WhatsApp */}
            <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32" className="text-green-500 hover:text-green-600"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.818-2.236A12.96 12.96 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.97 0-3.85-.57-5.44-1.56l-.39-.23-4.64 1.33 1.33-4.64-.23-.39A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.1c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 2.09 3.2 5.08 4.36.71.25 1.26.4 1.69.51.71.18 1.36.16 1.87.1.57-.07 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32" className="text-blue-700 hover:text-blue-800"><path d="M27 27h-4.5v-6.5c0-1.5 0-3.5-2.1-3.5-2.1 0-2.4 1.6-2.4 3.4V27H13V12h4.3v2.1h.1c.6-1.1 2-2.1 4.1-2.1 4.4 0 5.2 2.9 5.2 6.7V27zM7 10.2c-1.4 0-2.2-.9-2.2-2.1 0-1.2.9-2.1 2.2-2.1s2.2.9 2.2 2.1c0 1.2-.8 2.1-2.2 2.1zm2.2 16.8H4.8V12h4.4v15z"/></svg>
            </a>
            {/* Instagram */}
            <a href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Share on Instagram">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32" className="text-pink-500 hover:text-pink-600"><path d="M16 7c2.7 0 3 .01 4.1.06 1.1.05 1.7.22 2.1.36.5.2.8.44 1.2.88.44.44.68.7.88 1.2.14.4.31 1 .36 2.1.05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1.1-.22 1.7-.36 2.1-.2.5-.44.8-.88 1.2-.44.44-.7.68-1.2.88-.4.14-1 .31-2.1.36-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1.1-.05-1.7-.22-2.1-.36-.5-.2-.8-.44-1.2-.88-.44-.44-.68-.7-.88-1.2-.14-.4-.31-1-.36-2.1C7.01 19 7 18.7 7 16s.01-3 .06-4.1c.05-1.1.22-1.7.36-2.1.2-.5.44-.8.88-1.2.44-.44.7-.68 1.2-.88.4-.14 1-.31 2.1-.36C13 7.01 13.3 7 16 7zm0-2C13.3 5 13 5.01 11.9 5.06c-1.2.05-2 .22-2.7.46-.7.25-1.3.6-1.9 1.2-.6.6-.95 1.2-1.2 1.9-.24.7-.41 1.5-.46 2.7C5.01 13 5 13.3 5 16s.01 3 .06 4.1c.05 1.2.22 2 .46 2.7.25.7.6 1.3 1.2 1.9.6.6 1.2.95 1.9 1.2.7.24 1.5.41 2.7.46C13 26.99 13.3 27 16 27s3-.01 4.1-.06c1.2-.05 2-.22 2.7-.46.7-.25 1.3-.6 1.9-1.2.6-.6.95-1.2 1.2-1.9.24-.7.41-1.5.46-2.7.05-1.1.06-1.4.06-4.1s-.01-3-.06-4.1c-.05-1.2-.22-2-.46-2.7-.25-.7-.6-1.3-1.2-1.9-.6-.6-1.2-.95-1.9-1.2-.7-.24-1.5-.41-2.7-.46C19 5.01 18.7 5 16 5zm0 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm7.5-2a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
            </a>
            {/* TikTok */}
            <a href={`https://www.tiktok.com/share?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Share on TikTok">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32" className="text-black hover:text-gray-700"><path d="M24 7.5c-1.2 0-2.2-.7-2.7-1.7V20c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.2 0 .5 0 .7.1V12c-.2 0-.5-.1-.7-.1-4.1 0-7.5 3.4-7.5 7.5S11.9 27 16 27s7.5-3.4 7.5-7.5V7.5h-1.5z"/></svg>
            </a>
            {/* Facebook */}
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32" className="text-blue-600 hover:text-blue-700"><path d="M29 16c0-7.2-5.8-13-13-13S3 8.8 3 16c0 6.5 4.8 11.8 11 12.8V20.5h-3v-3h3v-2.3c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V17.5h3.4l-.5 3H20.5v8.3C25.2 27.8 29 22.5 29 16z"/></svg>
            </a>
            {/* Email */}
            <a href={`mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Share by Email">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32" className="text-gray-600 hover:text-gray-800"><path d="M27 7H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 2v.2l-11 7.3-11-7.3V9h22zm-22 14V11.1l10.3 6.8c.4.3.9.3 1.3 0L27 11.1V23H5z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
