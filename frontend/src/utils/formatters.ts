export const getInitials = (name: string | undefined | null): string => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .filter(n => n.length > 0) // Iwasan ang empty strings kung double spaces
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};