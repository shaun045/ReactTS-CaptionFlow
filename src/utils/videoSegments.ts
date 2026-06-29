import type { VideoSegment } from "./types";

export function getKeptSegments(
  duration: number, 
  removedSegments: VideoSegment[]
): VideoSegment[] {

    const sorted = [...removedSegments].sort(
      (a, b) => a.startTime - b.startTime
    );

    const keptSegments: VideoSegment[] = [];
    let current = 0;

    for (const segment of sorted) {
    if (current < segment.startTime) {
      keptSegments.push({
        id: keptSegments.length + 1,
        startTime: current,
        endTime: segment.startTime,
      });
    }
    current = segment.endTime;
  }

  if (current < duration) {
    keptSegments.push({
      id: keptSegments.length + 1,
      startTime: current,
      endTime: duration
    })
  }
  return keptSegments;
}