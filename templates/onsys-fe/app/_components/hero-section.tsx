import Image from "next/image";

interface HeroSectionProps {
  title: string;
  city: string;
  imageSrc: string;
  imageAlt?: string;
}

export default function HeroSection({
  title,
  city,
  imageSrc,
  imageAlt = "Hero section",
}: HeroSectionProps) {
  return (
    <div className="relative flex justify-center overflow-hidden flex-1 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay para melhor legibilidade do texto */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-medium">{city}</p>
      </div>
    </div>
  );
}
