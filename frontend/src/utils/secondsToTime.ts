const secondsToTime = (secs: number) => {
  //   const hours = Math.floor(secs / 3600);
  //   secs = secs - hours * 3600;

  const minutes = Math.floor(secs / 60);
  const seconds = secs - minutes * 60;

  const prettyMinutes = `${minutes >= 0 ? minutes : 0}`.padStart(2, "0");
  const prettySecs = `${seconds >= 0 ? seconds : 0}`.padStart(2, "0");

  return `${prettyMinutes}: ${prettySecs}`;
};

export default secondsToTime;
