import {
  type WallpaperHandler,
  type ApodResponse,
} from "components/system/Desktop/Wallpapers/types";
import { type WallpaperFit } from "contexts/session/types";
import { MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR } from "utils/constants";
import {
  jsonFetch,
  viewWidth,
  isYouTubeUrl,
  getYouTubeUrlId,
  viewHeight,
} from "utils/functions";

export const wallpaperHandler: Record<string, WallpaperHandler> = {
  APOD: async ({ isAlt }) => {
    const response = await jsonFetch(
      `https://api.nasa.gov/planetary/apod?${
        isAlt ? "count=1&" : ""
      }api_key=DEMO_KEY`
    );
    const { hdurl, url } = (isAlt ? response[0] : response) as ApodResponse;

    let wallpaperUrl = "";
    let fallbackBackground = "";
    let newWallpaperFit = "" as WallpaperFit;

    if (hdurl || url) {
      wallpaperUrl = (viewWidth() > 1024 ? hdurl : url) || url || "";
      newWallpaperFit = "fit";

      if (isYouTubeUrl(wallpaperUrl)) {
        const ytBaseUrl = `https://i.ytimg.com/vi/${getYouTubeUrlId(
          wallpaperUrl
        )}`;

        wallpaperUrl = `${ytBaseUrl}/maxresdefault.jpg`;
        fallbackBackground = `${ytBaseUrl}/hqdefault.jpg`;
      } else if (hdurl && url && hdurl !== url) {
        fallbackBackground = wallpaperUrl === url ? hdurl : url;
      }
    }

    return {
      fallbackBackground,
      newWallpaperFit,
      updateTimeout: MILLISECONDS_IN_DAY,
      wallpaperUrl,
    };
  },
  LOREM_PICSUM: () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const createLoremPicsumUrl = (): string =>
      `https://picsum.photos/seed/${Math.floor(Math.random() * Date.now())}/${viewWidth()}/${viewHeight()}`;

    return {
      fallbackBackground: createLoremPicsumUrl(),
      newWallpaperFit: "fill",
      updateTimeout: MILLISECONDS_IN_HOUR,
      wallpaperUrl: createLoremPicsumUrl(),
    };
  },
};
