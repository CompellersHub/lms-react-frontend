import { Video, Clock, Calendar } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

export default function UpcomingClassCard({
  id,
  title,
  instructor,
  startTime,
  duration,
  courseName,
}) {
  let formattedDate = "Date not available"
  let formattedTime = ""
  let timeUntil = ""

  if (startTime) {
    const dateObj = new Date(startTime)
    if (!isNaN(dateObj)) {
      formattedDate = format(dateObj, "MMM d, yyyy")
      formattedTime = format(dateObj, "h:mm a")
      timeUntil = formatDistanceToNow(dateObj, { addSuffix: true })
    }
  }

  const isStartingSoon = () => {
    if (!startTime) return false
    const now = new Date()
    const classTime = new Date(startTime)
    if (isNaN(classTime)) return false
    const diffInHours = (classTime - now) / (1000 * 60 * 60)
    return diffInHours <= 1
  }

  return (
    <div className="flex items-start space-x-4">
      {/* Icon */}
      <div className="flex items-center justiple-100 text-purple-600">
        <Video className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h4 className="font-medium">{title ?? "Untitled Class"}</h4>

        {instructor && (
          <p className="text-xs text-muted-foreground">
            Instructor: {instructor}
          </p>
        )}
        {courseName && (
          <p className="text-xs text-muted-foreground">Course: {courseName}</p>
        )}

        {/* Date + Duration */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {formattedTime && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}, {formattedTime}
            </div>
          )}
          {duration && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {duration} min
            </div>
          )}
        </div>

        {/* Countdown */}
        {timeUntil && (
          <p
            className={`text-xs font-medium ${
              isStartingSoon() ? "text-red-600" : "text-blue-600"
            }`}
          >
            Starts {timeUntil}
          </p>
        )}
      </div>
    </div>
  )
}
