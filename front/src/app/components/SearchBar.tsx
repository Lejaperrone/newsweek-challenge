import _ from 'lodash';
import { useCallback } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const debouncedSearch = useCallback(_.debounce(onSearch, 300), [onSearch]);

  const handleChange = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <div className="mb-4 sm:mb-0">
      <input
        type="text"
        placeholder="Buscar por email..."
        onChange={e => handleChange(e.target.value)}
        className="form-input mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-4 py-2"
      />
    </div>
  );
};

export default SearchBar;
