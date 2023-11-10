import { UseFormRegister, UseFormReset, UseFormSetValue } from "react-hook-form";


export type TAmenitiesInputs = {
  parking: boolean;
  wifi: boolean;
  gym: boolean;
  pool: boolean;
  watchman: boolean;
  cctv: boolean;
  securityLights: boolean;
  water: boolean;
  borehole: boolean;
};

export type TFactInputs = {
  bedrooms: string;
  bathrooms: string;
  price: number | string;
  //policies: string[];
  amenities: TAmenitiesInputs;
  overview: string;
};



export type TRegister = UseFormRegister<TFactInputs>;

export type TReset = UseFormReset<TFactInputs>;

export type TSetValue = UseFormSetValue<TFactInputs>;
