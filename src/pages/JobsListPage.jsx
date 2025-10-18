import { Link } from "react-router-dom";
import { useGetJobsQuery } from "@/services/coursesApi";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JobsListPage() {
  const { data: jobs = [], isLoading, error } = useGetJobsQuery();

  if (isLoading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Failed to load jobs.</div>;

  return (
    <section className="py-16 bg-gray-50 min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">All Job Openings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-6">
              {(job.logo || job.company_logo || job.image) ? (
                <img
                  src={job.logo || job.company_logo || job.image}
                  alt={job.company || job.company_name || job.title}
                  className="w-32 h-32 object-contain rounded-xl shadow bg-white"
                  onError={e => (e.target.src = "/placeholder.svg")}
                />
              ) : (
                <Briefcase className="w-16 h-16 text-primary/30" />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{job.title}</h2>
                  <div className="text-sm text-foreground/60 font-semibold mb-1">{job.company || job.company_name}</div>
                  <div className="flex flex-wrap gap-4 text-base text-foreground/70 mb-2">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location || "Remote"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type || "Full Time"}</span>
                  </div>
                  <p className="text-foreground/70 text-base mb-2 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.salary && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                        Salary: {job.salary}
                      </span>
                    )}
                    {job.deadline && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <Link to={`/jobs/${job.id}`}>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-6 py-2 font-semibold w-full sm:w-auto">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
