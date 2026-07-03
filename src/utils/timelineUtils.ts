import type { VideoSegment } from "./types";

export function timelineSourceTime(
    timelineTime: number, 
    segments: VideoSegment[]
  ) {
    const seg = findSegmentAtTimeline(timelineTime, segments);

    if (!seg) return 0;

    return seg.sourceStart + (timelineTime - seg.timelineStart);
  }


  export function sourceTimelineTime(
    sourceTime: number,
    segments: VideoSegment[]
  ) {
    const seg = findSegmentAtSource(sourceTime, segments);
    if (!seg) return sourceTime;

    const offset = sourceTime - seg.sourceStart;

    return seg.timelineStart + offset;
  }


  export function findSegmentAtTimeline(
    time: number,
    segments: VideoSegment[]
  ) {
    const targetSeg = segments.find(
      seg => 
        time >= seg.timelineStart && time <= seg.timelineEnd
    )
    return targetSeg
  }

  export function findSegmentAtSource(
    time: number,
    segments: VideoSegment[]
  ) {
    const targetSource = segments.find(
      seg => 
        time >= seg.sourceStart && time <= seg.sourceEnd
    )
    return targetSource
  }


  export function getNextSegment(
    currentSegment: VideoSegment,
    segments: VideoSegment[]
  ) {
    return segments.find(seg => seg.timelineStart === currentSegment.timelineEnd);

  }
