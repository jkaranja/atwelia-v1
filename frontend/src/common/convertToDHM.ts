//convert milliseconds to d h m
//time in ms
const convertToDHM = (time: number) => {
  const ms = Math.abs(time); //convert time to a positive number when past deadline
  const dhm = () => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000); //ignore seconds unless only sec = true

    //or use moment// not accurate//don't use
    //   const diff = moment.duration(ms);
    //   const days = Math.floor(diff.asDays()); // # of days in the duration
    //   const hours = Math.floor(diff.asHours()); // # of hours in the duration
    //   const minutes = Math.floor(diff.asMinutes()); // # of minutes in the duration

    //show only non zero date values
    if (!days && !hours && minutes) {
      return minutes + "m";
    }
    if (!days && hours && !minutes) {
      return hours + "h";
    }
    if (!days && hours && minutes) {
      return hours + "h" + " " + minutes + "m";
    }
    if (days && !hours && !minutes) {
      return days + "d";
    }
    if (days && hours && !minutes) {
      return days + "d" + " " + hours + "h";
    }
    if (days && !hours && minutes) {
      return days + "d" + " " + minutes + "m";
    }

    if (!days && !hours && !minutes && sec) {
      return sec + "s";
    }

    return days + "d" + " " + hours + "h" + " " + minutes + "m";
  };

  //if past deadline 
  if (time < 0) return `${dhm()} ago`;

  return dhm();
};

export default convertToDHM;
