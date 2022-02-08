import React, {useCallback, useState} from 'react';

import SearchSelectInput from "./components/SearchSelectInput/SearchSelectInput";
import Api from "./api";

import s from './App.module.css';

interface Joke {
  id: string;
  joke: string;
}

function App() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Joke | null>(null);
  const [results, setResults] = useState<Joke[]>([]);

  const requestResults = useCallback((query: string) => {
    setLoading(true);
    setError(false);
    Api.get(`search?term=${encodeURIComponent(query ?? "")}`)
      .then(({data}) => {
        setResults(data.results);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={s.app}>
      <div className={s.appBody}>
        <header>
          <h2>Test task search dropdown</h2>
          {error && <h4>Some error occured.</h4>}
          {selectedValue && <div>
            <div>{selectedValue.joke}</div>
          </div>}
        </header>
        <main>
          <SearchSelectInput
            loading={loading}
            options={results}
            onSearch={requestResults}
            onChange={setSelectedValue}
            getOptionLabel={(item) => `${item.joke}`}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
