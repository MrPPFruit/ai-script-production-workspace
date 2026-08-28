export function filterSuggestions<T extends { taxonomy: string }>(
  suggestions: T[],
  taxonomy: string,
) {
  return taxonomy === "all"
    ? suggestions
    : suggestions.filter((suggestion) => suggestion.taxonomy === taxonomy);
}

export function filterTasks<T extends { department: string }>(
  tasks: T[],
  department: string,
) {
  return department === "all"
    ? tasks
    : tasks.filter((task) => task.department === department);
}
