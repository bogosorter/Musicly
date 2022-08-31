import SearchBox from '../SearchBox/SearchBox';

import { useState } from 'react';

/**
 * Component that implements a dummy search box.
 */
export default function SearchDummy() {
    const [searchParameters, setParameters] = useState({ query: '', genre: '' });

    return (
        <SearchBox
            searchParameters={searchParameters}
            genres={['Classical', 'Rock', 'Pop', 'Pop-Rock', 'Jazz', 'Funk']}
            setParameters={setParameters}
            dummy={true}
        />
    )
}