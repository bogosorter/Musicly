import emptyCover from '../../../../assets/empty.png';

/**
 * Gets an album's cover, returning a default one if it doesn't have a cover.
 */
export default function getCover(album) {
    // If the current album doesn't have a defined cover, use an empty one as
    // background image
    if (album.coverPath) return `url('file://${album.coverPath}')`;
    else return `url('${emptyCover}')`;
}