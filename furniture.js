class Furniture {
  constructor() {}

  async getFurnitureInfo() {
    const furnitureRes = await fetch("products.json");
    const furnitureData = await furnitureRes.json();
    return furnitureData;
  }
}
