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

export async function transcribeAudio(audioBlob: Blob) {

  const file = new File([audioBlob], "audio.mp3", {type: "audio/mpeg"});

  const transcription = await groq.audio.transcriptions.create({
    file,
    model: "whisper-large-v3",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"]
  }) as unknown as VerboseTranscription;

  return transcription.segments?.map((segment) => ({
    id: crypto.randomUUID(),
    text: segment.text.trim(),
    startTime: segment.start,
    endTime: segment.end
  })) ?? [];
}