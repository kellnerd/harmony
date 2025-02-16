import type { Artwork, ArtworkType } from '@/harmonizer/types.ts';

interface ImageObject {
	url: string;
	width: number;
	height: number;
}

const minThumbnailSize = 200;

/**
 * From a list of images select the largest one (based on image width) and return an `Artwork` object.
 *
 * The smallest image from the list that is still larger than `minThumbnailSize` will
 * be used as the thumbnail image.
 */
export function selectLargestImage(images: ImageObject[], types: ArtworkType[]): Artwork | undefined {
	let largestImage: ImageObject | undefined;
	let thumbnail: ImageObject | undefined;
	images.forEach((image) => {
		if (!largestImage || image.width > largestImage.width) {
			largestImage = image;
		}
		if (image.width >= minThumbnailSize && (!thumbnail || image.width < thumbnail.width)) {
			thumbnail = image;
		}
	});
	if (!largestImage) return;
	return {
		url: largestImage.url,
		thumbUrl: thumbnail?.url,
		types,
	};
}
