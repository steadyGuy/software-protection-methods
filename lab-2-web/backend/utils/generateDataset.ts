// Courtesy dataset from https://github.com/brian-the-dev/recaptcha-dataset/tree/main/Large

export const typesOfPhoto = [
  { name: "Bicycle", maxCount: 700 },
  { name: "Bridge", maxCount: 550 },
  { name: "Bus", maxCount: 550 },
  { name: "Car", maxCount: 2000 },
  { name: "Chimney", maxCount: 55 },
  { name: "Crosswalk", maxCount: 1000 },
  { name: "Hydrant", maxCount: 960 },
  { name: "Motorcycle", maxCount: 100 },
  { name: "Mountain", maxCount: 13 },
  { name: "Other", maxCount: 1000 },
  { name: "Palm", maxCount: 930 },
  { name: "Traffic Light", maxCount: 800 },
];

export const generateDataset = () => {
  const encodedTypesOfPhoto = typesOfPhoto.map((itm) => ({
    ...itm,
    name: encodeURI(itm.name),
  }));
  let dataset: { type: string; url: string }[] = [];

  encodedTypesOfPhoto.forEach((itm) => {
    for (let i = 1; i <= itm.maxCount; i++) {
      dataset.push({
        url: `https://raw.githubusercontent.com/brian-the-dev/recaptcha-dataset/main/Large/${
          itm.name
        }/${itm.name === "Traffic%20Light" ? "Tlight" : itm.name}%20(${i}).png`,
        type: decodeURI(itm.name),
      });
    }
  });

  return dataset;
};
