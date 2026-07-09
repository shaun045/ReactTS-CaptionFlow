

export interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface VideoSegment {
  id: string;
  sourceStart: number;
  sourceEnd: number;
  timelineStart: number;
  timelineEnd: number;
}


export interface SubtitlePos {
  x: number;
  y: number;
}

export interface EditorState {
  subtitles: Subtitle[];
  videoSegments: VideoSegment[];
  subtitlePos: SubtitlePos;
}

