export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  
  // Eliminamos la parte de la hora para comparar solo los días
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  // Formateador para la hora (Ej: 2:30 PM)
  const timeFormatter = new Intl.DateTimeFormat('es-VE', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // 1. Si es hoy: "2:30 PM"
  if (date.toDateString() === now.toDateString()) {
    return timeFormatter.format(date);
  }

  // 2. Si fue ayer: "Ayer"
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  }

  // 3. Si fue hace menos de una semana: "lunes", "martes", etc.
  if (diffInDays < 7) {
    return new Intl.DateTimeFormat('es-VE', { weekday: 'long' }).format(date);
  }

  // 4. Si es más antiguo: "25/04/26"
  return new Intl.DateTimeFormat('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
};