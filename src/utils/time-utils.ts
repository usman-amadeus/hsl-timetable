export const refSecsToSecs = (refSecs: number) => {
  const oneDay = 60 * 60 * 24;
  return refSecs > oneDay ? refSecs - oneDay : refSecs;
};

export const parseTime = (refSecs: number) => {
  if (!refSecs) {
    return '';
  }
  
  const secs = refSecsToSecs(refSecs);
  const hours = Math.floor(secs / (60 * 60));
  const minutes = Math.floor((secs - hours * 60 * 60) / 60);
  const twoDigit = (n: number) => `${n < 10 ? '0' : ''}${n}`;
  return `${twoDigit(hours)}:${twoDigit(minutes)}`;
};

export const timeDiff = (refSecs: number) => {
  if (!refSecs) {
    return 0;
  }
  const now = new Date();
  // now.setHours(now.getHours() - 1);
  const nowSecs = now.getSeconds() + 60 * now.getMinutes() + 60 * 60 * now.getHours();
  const secs = refSecsToSecs(refSecs);
  return Math.floor((secs - nowSecs) / 60);
};
