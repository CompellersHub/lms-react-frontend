import { BarChart2, Star, CheckCircle } from "lucide-react";

export function FeaturesBanner() {
  return (
    <section className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between">
          <div className="flex items-center gap-3">
            <div className="text-orange-500">
              <BarChart2 className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-white">
              Live Digital Projects
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-orange-500">
              <Star className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-white">
              Experienced Mentors
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-orange-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-white">
              Anywhere, Anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
