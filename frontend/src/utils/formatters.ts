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


export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Kung hindi pa sumasapit ang birth month o birthday sa taong ito, bawas ng 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};