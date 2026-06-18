

export interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

export interface VideoSegment {
  id: number;
  startTime: number;
  endTime: number;
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

