export function filterSuggestions<T extends { taxonomy: string }>(suggestions: T[], taxonomy: string) {
  return taxonomy === "all" ? suggestions : suggestions.filter((suggestion) => suggestion.taxonomy === taxonomy);
}
