export const formatDates = (date) => {

    let newDate = new Date(date).toISOString().slice(0,10);

    const day = newDate.slice(8,10);
    const months = newDate.slice(5,7);
    const year = newDate.slice(0,4);

    newDate = months+'-'+day+'-'+year;

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(newDate).toLocaleDateString('en-US', options);
}