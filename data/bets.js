// Ставки. Обновляется Владом через Клода: скинул ставку в чат → она появилась здесь → git push.
// status: 'pending' | 'win' | 'lose' | 'void'
// side: 'Паша' | 'AI' (батл) · contest: true = зачёт конкурса Лиги Ставок (идёт стороне Паши)

export const bets = [
  // ===== День 1 — 11 июня =====
  { id: 1, date: '2026-06-11', match: 'Мексика — ЮАР', bet: '1Х + ТМ 2.5', type: 'Экспресс', odds: 1.73, stake: 1, side: 'Паша', contest: true, status: 'win' },
  { id: 2, date: '2026-06-11', match: 'Южная Корея — Чехия', bet: 'ОЗ да', type: 'ОЗ', odds: 1.83, stake: 1, side: 'Паша', contest: true, status: 'win' },
  { id: 3, date: '2026-06-11', match: 'Южная Корея — Чехия', bet: 'Волевая победа Кореи (хедж)', type: 'Другое', odds: 17, stake: 0.3, side: 'Паша', status: 'win' },

  // ===== День 2 — 12 июня =====
  { id: 4, date: '2026-06-12', match: 'Канада — Босния', matchId: 'canada-bosnia', bet: 'ОЗ да', type: 'ОЗ', odds: 2.10, stake: 1, side: 'Паша', contest: true, status: 'win' },
  { id: 5, date: '2026-06-12', match: 'США — Парагвай', matchId: 'usa-paraguay', bet: 'ОЗ да', type: 'ОЗ', odds: 2.14, stake: 1, side: 'Паша', contest: true, status: 'pending' },
  { id: 6, date: '2026-06-12', match: 'Канада — Босния', matchId: 'canada-bosnia', bet: 'ТМ 2.5', type: 'ТМ', odds: 1.63, stake: 3, side: 'AI', status: 'win' },
  { id: 7, date: '2026-06-12', match: 'Канада — Босния', matchId: 'canada-bosnia', bet: 'П1 Канада', type: 'П1', odds: 1.80, stake: 2, side: 'AI', status: 'lose' },
  { id: 8, date: '2026-06-12', match: 'Канада — Босния', matchId: 'canada-bosnia', bet: 'ТС 1:0 Канада', type: 'ТС', odds: 6.0, stake: 0.7, side: 'AI', status: 'lose' },
  { id: 9, date: '2026-06-12', match: 'Канада — Босния', matchId: 'canada-bosnia', bet: '1Т 0:0', type: '1Т-рынок', odds: 2.2, stake: 0.5, side: 'AI', status: 'lose' },
  { id: 10, date: '2026-06-12', match: 'США — Парагвай', matchId: 'usa-paraguay', bet: 'ТМ 2.5', type: 'ТМ', odds: 1.75, stake: 2.5, side: 'AI', status: 'pending' },
  { id: 11, date: '2026-06-12', match: 'США — Парагвай', matchId: 'usa-paraguay', bet: '1Т 0:0', type: '1Т-рынок', odds: 2.0, stake: 1, side: 'AI', status: 'pending' },
  { id: 12, date: '2026-06-12', match: 'США — Парагвай', matchId: 'usa-paraguay', bet: 'ТС 1:0 США', type: 'ТС', odds: 7.0, stake: 0.5, side: 'AI', status: 'pending' },
  { id: 13, date: '2026-06-12', match: 'Канада ТМ 2.5 + США ТМ 2.5', bet: 'Экспресс ТМ × ТМ', type: 'Экспресс', odds: 2.85, stake: 1, side: 'AI', status: 'pending' },
];
