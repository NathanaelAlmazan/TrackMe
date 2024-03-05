
export function getDayDiff(deadline: Date) {
    const difference = Math.abs(new Date().getTime() - deadline.getTime());
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
}
