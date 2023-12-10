export const formatDate = (val) => {
  // формат: 17 мая 2022 г.
  return new Date(val).toLocaleString('ru-Ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateDDMMYYYY = (val) => {
  // формат: 17.01.2022
  return new Date(val).toLocaleString('ru-Ru', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  })
}

export const gotoTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
