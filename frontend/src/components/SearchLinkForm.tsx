import React, { useState } from 'react';

interface SearchLinkFormProps {
  onSearch: (identifier: string) => void;
  loading: boolean;
}

export const SearchLinkForm: React.FC<SearchLinkFormProps> = ({
  onSearch,
  loading,
}) => {
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSearch(search.trim());
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Поиск и управление</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Введите alias или shortCode для поиска/удаления"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Поиск...' : 'Найти информацию'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
