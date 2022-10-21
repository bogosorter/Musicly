import emptyCover from '../../../../assets/empty.png';

/**
 * Gets an album's cover, returning a default one if it doesn't have a cover.
 */
export default function getCover(album) {
    // If the current album doesn't have a defined cover, use an empty one as
    // background image
    if (album.coverPath) {
        let path = `url('file://${album.coverPath}')`;
        // Ensure that the path is escaped: this is needed for Windows paths.
        path = path.replace(/\\/g, '/');
        return path;
    }
    return `url('${emptyCover}')`;
}