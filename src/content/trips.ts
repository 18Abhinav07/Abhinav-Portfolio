import data from "./data.json";

export type TripMedia = { type: "image" | "video"; src: string; thumb: string };
export type Trip = { loc: string; date: string; coord: string; note: string; cover: string; poster: string; media: TripMedia[] };

/** Swap the original-file flag for a sized transform, and serve videos as mp4 (or a jpg frame). */
const cl = (url: string, t: string, ext?: string) => {
  const out = url.replace("/upload/fl_original/", `/upload/${t}/`);
  return ext ? out.replace(/\.[a-z0-9]+$/i, `.${ext}`) : out;
};

export const trips: Trip[] = data.travels.map((t) => ({
  loc: t.location,
  date: t.date,
  coord: t.coordinates,
  note: t.note,
  cover: cl(t.cover, "w_360,q_auto,ac_none,du_7", "mp4"),
  poster: cl(t.cover, "w_360,q_auto,ac_none,du_7", "jpg"),
  media: t.media.map((m) =>
    m.type === "video"
      ? { type: "video" as const, src: cl(m.src, "w_1280,q_auto,ac_none", "mp4"), thumb: cl(m.src, "w_240,q_auto,ac_none", "jpg") }
      : { type: "image" as const, src: cl(m.src, "f_auto,q_auto,w_1600"), thumb: cl(m.src, "f_auto,q_auto,w_240") },
  ),
}));
