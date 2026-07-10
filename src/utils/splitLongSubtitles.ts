import type { Subtitle } from "./types";


export default function splitLongSubtitles(subs: Subtitle[], maxChars=20): Subtitle[] {
  const result: Subtitle[] = [];

  for (const sub of subs) {
    if (sub.text.length <= maxChars) {
      result.push(sub);
      continue;
    }

    const words = sub.text.split(" ");
    const chunks: string[] = [];
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > maxChars && current) {
        chunks.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) chunks.push(current);

    const totalChars = chunks.reduce((sum, c) => sum + c.length, 0);
    const totalDuration = sub.endTime - sub.startTime;
    let cursor = sub.startTime;

    chunks.forEach((chunk, i) => {
      const chunkDuration = (chunk.length / totalChars) * totalDuration;
      const startTime = cursor;
      const endTime = i === chunks.length - 1 ? sub.endTime : cursor + chunkDuration;

      result.push({
        id: crypto.randomUUID(),
        text: chunk,
        startTime,
        endTime
      });
      cursor = endTime;
    });
  }
  return result;
}