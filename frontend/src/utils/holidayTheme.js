// src/utils/holidayTheme.js

// Cálculo exacto del Domingo de Pascua (Algoritmo de Meeus/Jones/Butcher)
export const getEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = Marzo, 4 = Abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

export const isEasterPeriod = (date) => {
  const year = date.getFullYear();
  const easter = getEasterSunday(year);
  const currentMidnight = new Date(year, date.getMonth(), date.getDate());
  const easterMidnight = new Date(year, easter.getMonth(), easter.getDate());
  const diffDays = Math.round((currentMidnight - easterMidnight) / (1000 * 60 * 60 * 24));
  // Desde Domingo de Ramos (-7) hasta Lunes de Pascua (+1)
  return diffDays >= -7 && diffDays <= 1;
};

export const getHolidayOrSeasonTheme = (date = new Date()) => {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const year = date.getFullYear();

  // 1. Halloween (desde el 20 de octubre hasta el 31 de octubre inclusive)
  if (month === 10 && day >= 20) {
    return {
      id: 'halloween',
      name: 'Halloween',
      badge: '🎃 ¡Feliz Halloween en el Barrio Tiro Federal! 👻',
      subtitle: '¡Preparando las parrillas para una noche de brujas inolvidable!',
      background: '/assets/backgrounds/fondo_halloween.png',
      buttonGradient: 'linear-gradient(135deg, #ff7518, #7b1fa2)',
      accentColor: '#ff7518',
      isHoliday: true,
    };
  }

  // 2. Navidad (arranca apenas pasa Halloween: del 1 de noviembre al 26 de diciembre)
  if (month === 11 || (month === 12 && day <= 26)) {
    return {
      id: 'navidad',
      name: 'Navidad',
      badge: '🎄 ¡Feliz Navidad les desea el Barrio Tiro Federal! 🎅',
      subtitle: '¡Que estas fiestas estén llenas de unión, alegría y buenos asados en familia!',
      background: '/assets/backgrounds/fondo_navidad.png',
      buttonGradient: 'linear-gradient(135deg, #d32f2f, #ffb300)',
      accentColor: '#d32f2f',
      isHoliday: true,
    };
  }

  // 3. Año Nuevo (27 de diciembre al 2 de enero)
  if ((month === 12 && day >= 27) || (month === 1 && day <= 2)) {
    return {
      id: 'anio_nuevo',
      name: 'Año Nuevo',
      badge: '🥂✨ ¡Feliz Año Nuevo para todo el Barrio! 🎆',
      subtitle: '¡Brindemos por un nuevo año lleno de momentos compartidos!',
      background: '/assets/backgrounds/fondo_anio_nuevo.png',
      buttonGradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      accentColor: '#f59e0b',
      isHoliday: true,
    };
  }

  // 4. Semana Santa / Pascua (Domingo de Ramos a Lunes de Pascua)
  if (isEasterPeriod(date)) {
    return {
      id: 'pascua',
      name: 'Pascua',
      badge: '🐰🥚 ¡Felices Pascuas en el Barrio Tiro Federal! 🌸',
      subtitle: '¡Disfrutá de un hermoso encuentro en familia en nuestras parrillas!',
      background: '/assets/backgrounds/fondo_pascua.png',
      buttonGradient: 'linear-gradient(135deg, #ec4899, #f59e0b)',
      accentColor: '#ec4899',
      isHoliday: true,
    };
  }

  // 5. Fechas Patrias (24 mar, 2 abr, 18-25 may, 20 jun, 9 jul, 17 ago)
  if (
    (month === 3 && day === 24) ||
    (month === 4 && day === 2) ||
    (month === 5 && day >= 18 && day <= 25) ||
    (month === 6 && day === 20) ||
    (month === 7 && day === 9) ||
    (month === 8 && day === 17)
  ) {
    return {
      id: 'patrio',
      name: 'Fecha Patria',
      badge: '🇦🇷 ¡Viva la Patria! Día Festivo en el Barrio 🇦🇷',
      subtitle: '¡Nada mejor que celebrar nuestras fechas patrias con un gran asado!',
      background: '/assets/backgrounds/fondo_patrio_1779764902332.png',
      buttonGradient: 'linear-gradient(135deg, #38bdf8, #0284c7)',
      accentColor: '#0284c7',
      isHoliday: true,
    };
  }

  // 6. Mundial 2026: Junio 11 - Julio 19
  if (year === 2026 && ((month === 6 && day >= 11) || (month === 7 && day <= 19))) {
    return {
      id: 'mundial',
      name: 'Mundial',
      badge: '⚽🇦🇷 ¡Alentando a la Selección en el Barrio! 🏆',
      subtitle: '¡Prendé el fuego para vivir los partidos en comunidad!',
      background: '/assets/backgrounds/fondo_mundial_1779764916277.png',
      buttonGradient: 'linear-gradient(135deg, #38bdf8, #f59e0b)',
      accentColor: '#0284c7',
      isHoliday: true,
    };
  }

  // 7. Estaciones del año (Hemisferio Sur)
  // Verano: Dic 21 - Mar 20
  if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day <= 20)) {
    return {
      id: 'verano',
      name: 'Verano',
      badge: null,
      subtitle: '¡Gracias por visitar nuestro sitio web!',
      background: '/assets/backgrounds/fondo_verano_1779764842474.png',
      buttonGradient: 'linear-gradient(135deg, #ffb347, #ff7a18)',
      accentColor: '#ff7a18',
      isHoliday: false,
    };
  }

  // Otoño: Mar 21 - Jun 20
  if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day <= 20)) {
    return {
      id: 'otono',
      name: 'Otoño',
      badge: null,
      subtitle: '¡Gracias por visitar nuestro sitio web!',
      background: '/assets/backgrounds/fondo_otono_1779764858267.png',
      buttonGradient: 'linear-gradient(135deg, #ffb347, #ff7a18)',
      accentColor: '#d97706',
      isHoliday: false,
    };
  }

  // Invierno: Jun 21 - Sep 20
  if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day <= 20)) {
    return {
      id: 'invierno',
      name: 'Invierno',
      badge: null,
      subtitle: '¡Gracias por visitar nuestro sitio web!',
      background: '/assets/backgrounds/fondo_invierno_1779764872297.png',
      buttonGradient: 'linear-gradient(135deg, #ffb347, #ff7a18)',
      accentColor: '#2563eb',
      isHoliday: false,
    };
  }

  // Primavera: Sep 21 - Dic 20
  return {
    id: 'primavera',
    name: 'Primavera',
    badge: null,
    subtitle: '¡Gracias por visitar nuestro sitio web!',
    background: '/assets/backgrounds/fondo_primavera_1779764886087.png',
    buttonGradient: 'linear-gradient(135deg, #ffb347, #ff7a18)',
    accentColor: '#16a34a',
    isHoliday: false,
  };
};
