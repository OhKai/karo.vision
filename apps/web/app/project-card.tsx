import { OptimizedImage } from "@/components/optimized-image";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  href?: string;
  title: string;
  type: string;
  description: string;
  image: string;
  linkType?: "Website" | "App Store";
}

const ProjectCard = ({
  href,
  title,
  type,
  description,
  image,
  linkType = "Website",
}: ProjectCardProps) => {
  const content = (
    <div className="group flex md:flex-row flex-col md:gap-12 gap-6 items-center p-6 rounded-lg hover:bg-secondary/5 transition-colors duration-300 border border-transparent hover:border-border">
      <div className="relative overflow-hidden rounded-2xl shrink-0 w-[80vw] max-w-80 max-h-36 h-[40vw] md:w-64 md:h-40 bg-secondary/5 border border-border/50">
        <OptimizedImage
          src={image}
          alt={title}
          sizes="(max-width: 400px) 100vw, (max-width: 767px) 318px, 254px"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex-1 flex flex-col gap-3 self-start md:self-auto">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 bg-secondary/20 rounded-full">
            {type}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed md:w-md">
          {description}
        </p>
        {href && (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors pt-2">
            {linkType}
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="md:max-w-none md:w-auto max-w-md w-full"
    >
      {content}
    </a>
  ) : (
    <div className="md:max-w-none md:w-auto max-w-md w-full">{content}</div>
  );
};

export default ProjectCard;
