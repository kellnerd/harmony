import { formatPartialDate } from "@/utils/date.ts";

export default function ReleaseDate ({ release }) {
  
  return <>{formatPartialDate(release.releaseDate)}</>

}