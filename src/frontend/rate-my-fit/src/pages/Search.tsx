import { useParams } from 'react-router-dom';

const Search = () => {
    const params = useParams();
    const searchQuery = params.searchQuery;

    return (
        <h1>Hello</h1>
    );
};

export default Search;