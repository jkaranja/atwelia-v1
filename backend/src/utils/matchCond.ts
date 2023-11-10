const matchCond = (value: undefined | boolean) => {
  return !!value || { $in: [false, true] };
};

export default matchCond;
