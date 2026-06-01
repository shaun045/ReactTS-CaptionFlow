import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
}

interface VerboseTranscription {
  segments: TranscriptionSegment[];
}

export async function transcribeVideo(videoURL: string) {
  const response = await fetch(videoURL);
  const blob = await response.blob();

  const file = new File([blob], "audio.mp4", {type: "audio/mp4"});

  const transcription = await groq.audio.transcriptions.create({
    file,
    model: "whisper-large-v3",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"]
  }) as unknown as VerboseTranscription;

  return transcription.segments?.map((segment, index) => ({
    id: Date.now() + index,
    text: segment.text.trim(),
    startTime: segment.start,
    endTime: segment.end
  })) ?? [];
}