export default class AssetsManager {
  bgImg?: HTMLImageElement;

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.addEventListener(
        'load',
        () => {
          resolve(img);
        },
        { once: true },
      );

      img.src = url;
    });
  }
}
