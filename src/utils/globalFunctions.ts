export const formatDate = (val) => {
    return new Date(val).toLocaleString('ru-Ru', {
        year: 'numeric', month: 'long', day: 'numeric',
    })
}

export const gotoTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
