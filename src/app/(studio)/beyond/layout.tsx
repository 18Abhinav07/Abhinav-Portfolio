import { SITE_URL } from "@/content/site-url";

const url = `${SITE_URL}/beyond`;

/**
 * The page itself is a client component (GSAP pinning and a modal), and a client
 * component cannot export metadata. This layout carries it instead.
 */
export const metadata = {
  title: "Beyond · Abhinav Pangaria",
  description:
    "Away from the terminal. Places, photographs, and the part of the record that is not code.",
  alternates: { canonical: url },
  openGraph: {
    title: "Beyond · Abhinav Pangaria",
    description: "Away from the terminal. Places, photographs, and the part of the record that is not code.",
    url,
    type: "website",
  },
};

export default function BeyondLayout({ children }: { children: React.ReactNode }) {
  return children;
}
