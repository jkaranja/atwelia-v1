const matchRegEx = (value: string | undefined) => {
  return {
    $regex: `.*${value || ""}.*`,
    $options: "i",
  };
};

export default matchRegEx
