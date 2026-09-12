import { redirect } from "next/navigation";
import { getProjects } from "@/lib/data";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const allProjects = await getProjects();
  return allProjects.map((p) => ({
    slug: p.slug,
  }));
}

export default function ProjectDetailRedirect({ params }: Props) {
  redirect(`/work?play=${params.slug}`);
}
