import { ILicense } from "../types";
import randomSymbols from "./randomSymbols";
import vigenereCipher from "./vigenereCipher";

const _generateLicense = () => {
  const ThirtyDaysInMs = 1000 * 60 * 60 * 24 * 30;
  const currentDateInMs = new Date().getTime();

  const phrase = randomSymbols();
  const codedPhrase = vigenereCipher().encrypt(
    phrase,
    vigenereCipher().generateKey(`${process.env.REACT_APP_SECRET_KEY}`, phrase)
  );

  const initialLicense = {
    launchesNumber: 0,
    expires: currentDateInMs + ThirtyDaysInMs,
    isConfirmed: false,
    codedPhrase,
  };

  return initialLicense;
};

export const generateLicense = () => {
  let license: ILicense | null = localStorage.getItem("license")
    ? JSON.parse(localStorage.getItem("license") || "null")
    : null;

  if (license) {
  } else {
    license = _generateLicense();
  }

  localStorage.setItem("license", JSON.stringify(license));
};

export const updateLicense = (fieldName: string, value: any) => {
  let license: Record<string, any> = JSON.parse(
    localStorage.getItem("license") as string
  );

  license[fieldName] = value;
  localStorage.setItem("license", JSON.stringify(license));
};

export const getLicenseInfo = () => {
  const license: ILicense = JSON.parse(
    localStorage.getItem("license") as string
  );

  if (!license) {
    generateLicense();
    return { isLicensedExpired: false };
  }

  if (license.isConfirmed) return { isLicensedExpired: false };

  if (
    license &&
    (Number(license.launchesNumber) >= 30 ||
      license.expires <= new Date().getTime())
  )
    return { isLicensedExpired: true, codedPhrase: license.codedPhrase };

  license.launchesNumber += 1;
  localStorage.setItem("license", JSON.stringify(license));

  return { isLicensedExpired: false };
};
