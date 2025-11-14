// Centralized typography classes
export const typography = {
    // Headings
    h1: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
    h2: "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
    h3: "text-xl md:text-2xl font-semibold tracking-tight",
    h4: "text-lg md:text-xl font-semibold",
  
    // Body text
    body: "text-base leading-relaxed",
    bodyLarge: "text-lg leading-relaxed",
    bodySmall: "text-sm leading-relaxed",
  
    // Subtitles
    subtitle: "text-base md:text-lg text-neutral-600 leading-relaxed",
    subtitleLight: "text-base md:text-lg text-neutral-400 leading-relaxed",
  
    // Labels
    label: "text-sm font-medium text-neutral-700",
    labelSmall: "text-xs font-medium text-neutral-600",
  
    // Links
    link: "text-primary-600 hover:text-primary-700 font-medium transition-colors",
    linkSmall: "text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors",
  } as const
  